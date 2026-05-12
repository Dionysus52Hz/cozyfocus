import { dexie, supabase } from "@/database";
import { ERROR_CODES } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import type {
   PlanTask,
   PlanTaskStatus,
   CreatePlanTaskInput,
   UpdatePlanTaskInput,
   PlanTaskTag,
} from "@/types";

export const planTaskService = {
   async getAll(): Promise<PlanTask[]> {
      return dexie.planTasks.orderBy("order").toArray();
   },

   async getByStatus(status: PlanTaskStatus): Promise<PlanTask[]> {
      return dexie.planTasks.where("status").equals(status).sortBy("order");
   },

   async getMaxOrder(status: PlanTaskStatus): Promise<number> {
      const tasks = await planTaskService.getByStatus(status);

      if (tasks.length === 0) return 0;

      return Math.max(...tasks.map((task) => task.order));
   },

   async create(input: CreatePlanTaskInput): Promise<PlanTask> {
      const status = input.status ?? "todo";
      const maxOrder = await planTaskService.getMaxOrder(status);

      const tags = await Promise.all(
         (input.tags ?? []).map((name) => planTaskService.ensureTag(name)),
      );

      const task: PlanTask = {
         id: uuidv4(),
         title: input.title,
         note: input.note,
         status,
         order: maxOrder + 1,
         priority: input.priority ?? "low",
         tags: tags,
         dueDate: input.dueDate,
         createdAt: Date.now(),
         updatedAt: Date.now(),
      };

      await dexie.planTasks.add(task);
      return task;
   },

   async update(id: string, input: UpdatePlanTaskInput): Promise<PlanTask> {
      const existing = await dexie.planTasks.get(id);

      if (!existing) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

      const tags =
         input.tags !== undefined
            ? await Promise.all(
                 input.tags.map((name) => planTaskService.ensureTag(name)),
              )
            : existing.tags;

      const updated: PlanTask = {
         ...existing,
         ...input,
         tags,
         updatedAt: Date.now(),
      };

      try {
         await dexie.planTasks.put(updated);
      } catch {
         throw new Error(ERROR_CODES.UPDATE_TASK_FAILED);
      }

      return updated;
   },

   async reorder(tasks: PlanTask[]): Promise<void> {
      await dexie.transaction("rw", dexie.planTasks, async () => {
         await Promise.all(
            tasks.map((task, index) =>
               dexie.planTasks.update(task.id, {
                  order: index + 1,
                  updatedAt: Date.now(),
               }),
            ),
         );
      });
   },

   async moveToColumn(
      id: string,
      status: PlanTaskStatus,
      columnTasks: PlanTask[],
   ): Promise<PlanTask> {
      return dexie.transaction("rw", dexie.planTasks, async () => {
         const existing = await dexie.planTasks.get(id);

         if (!existing) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

         await Promise.all(
            columnTasks.map((task, index) => {
               dexie.planTasks.update(task.id, {
                  status,
                  order: index + 1,
                  updatedAt: Date.now(),
               });
            }),
         );

         const updated = await dexie.planTasks.get(id);

         return updated!;
      });
   },

   async remove(id: string): Promise<PlanTask> {
      const existing = await dexie.planTasks.get(id);

      if (!existing) throw new Error(ERROR_CODES.TASK_NOT_FOUND);

      await dexie.planTasks.delete(id);

      return existing;
   },

   async fetchTags(): Promise<PlanTaskTag[]> {
      const { data, error } = await supabase
         .from("plan_task_tags")
         .select("id, name, created_at")
         .order("name");
      if (error) throw new Error(ERROR_CODES.DB_READ_TASK_TAGS_ERROR);

      return data.map((tag) => ({
         id: tag.id,
         name: tag.name,
         createdAt: new Date(tag.created_at).getTime(),
      }));
   },

   async ensureTag(name: string): Promise<PlanTaskTag> {
      const trimmed = name.trim();

      const { data, error } = await supabase
         .from("plan_task_tags")
         .upsert(
            { name: trimmed },
            { onConflict: "name", ignoreDuplicates: false },
         )
         .select("id, name, created_at")
         .single();

      if (error) throw new Error(error.message);
      return {
         id: data.id,
         name: data.name,
         createdAt: new Date(data.created_at).getTime(),
      };
   },

   async removeTag(id: string): Promise<void> {
      const { error } = await supabase
         .from("plan_task_tags")
         .delete()
         .eq("id", id);

      if (error) throw new Error(error.message);
   },
};
