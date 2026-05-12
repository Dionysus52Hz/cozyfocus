import { ERROR_CODES } from "@/constants";
import type {
   FocusTask,
   CreateFocusTaskInput,
   UpdateFocusTaskInput,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { dexie } from "@/database";

export const focusTaskService = {
   async fetchPagedTasks(page: number, pageSize: number) {
      return await dexie.focusTasks
         .orderBy("createdAt")
         .offset((page - 1) * pageSize)
         .limit(pageSize)
         .toArray();
   },

   async getTotalCount() {
      return await dexie.focusTasks.count();
   },

   async getActiveTask() {
      return await dexie.focusTasks.where("isActive").equals(1).first();
   },

   async setActiveTask(id: string) {
      const targetTask = await dexie.focusTasks.get(id);
      if (!targetTask) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

      if (targetTask.isActive === 1 || targetTask.isCompleted === 1) {
         return targetTask;
      }

      return await dexie.transaction("rw", dexie.focusTasks, async () => {
         await dexie.focusTasks.where("isActive").equals(1).modify({
            isActive: 0,
         });

         const updatedCount = await dexie.focusTasks.update(id, {
            isActive: 1,
         });
         if (updatedCount === 0)
            throw new Error(ERROR_CODES.UPDATE_TASK_FAILED);

         const task = await dexie.focusTasks.get(id);
         if (!task) {
            throw new Error(ERROR_CODES.DB_READ_TASK_ERROR);
         }

         return task;
      });
   },

   async findNextIncompleteTask(
      currentTaskId: string,
   ): Promise<FocusTask | null> {
      const nextTask = await dexie.focusTasks
         .where("isCompleted")
         .equals(0)
         .and((task) => task.id !== currentTaskId)
         .sortBy("createdAt");

      return nextTask[0] ?? null;
   },

   async create(input: CreateFocusTaskInput): Promise<FocusTask> {
      const activeTaskCount = await dexie.focusTasks
         .where("isActive")
         .equals(1)
         .count();

      const shouldBeActive = activeTaskCount === 0 ? 1 : 0;

      const newTask: FocusTask = {
         id: uuidv4(),
         title: input.title.trim(),
         isCompleted: 0,
         isActive: shouldBeActive,
         pomodoros: 0,
         estimatedPomodoros: input.estimatedPomodoros,
         createdAt: Date.now(),
      };
      await dexie.focusTasks.add(newTask);
      return newTask;
   },
   async update(id: string, input: UpdateFocusTaskInput): Promise<FocusTask> {
      const existing = await dexie.focusTasks.get(id);

      if (!existing) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

      const updated: FocusTask = {
         ...existing,
         ...input,
         updatedAt: Date.now(),
      };

      try {
         await dexie.focusTasks.put(updated);
      } catch {
         throw new Error(ERROR_CODES.UPDATE_TASK_FAILED);
      }

      return updated;
   },

   async toggleTask(id: string) {
      const task = await dexie.focusTasks.get(id);
      if (!task) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

      const newStatus = task.isCompleted === 0 ? 1 : 0;
      await dexie.focusTasks.update(id, {
         isCompleted: newStatus,
         ...(newStatus === 0 && { pomodoros: 0 }),
      });

      const updatedTask = await dexie.focusTasks.get(id);
      return updatedTask!;
   },

   async deleteTask(id: string) {
      const task = await dexie.focusTasks.get(id);
      if (!task) {
         throw new Error(ERROR_CODES.TASK_NOT_FOUND);
      }

      await dexie.focusTasks.delete(id);
      return task;
   },

   async increasePomodoro(id: string) {
      const modifiedCount = await dexie.focusTasks
         .where("id")
         .equals(id)
         .modify((task) => {
            task.pomodoros += 1;
         });

      if (modifiedCount === 0) {
         throw new Error(ERROR_CODES.TASK_NOT_FOUND);
      }

      return (await dexie.focusTasks.get(id))!;
   },
};
