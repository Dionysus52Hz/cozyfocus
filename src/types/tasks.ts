export interface FocusTask {
   id: string;
   title: string;
   isCompleted: 0 | 1;
   isActive: 0 | 1;
   pomodoros: number;
   estimatedPomodoros: number;
   createdAt: number;
   updatedAt?: number;
}

export type CreateFocusTaskInput = Pick<
   FocusTask,
   "title" | "estimatedPomodoros"
>;
export type UpdateFocusTaskInput = Partial<
   Pick<FocusTask, "title" | "estimatedPomodoros">
>;

export type PlanTaskStatus = "todo" | "doing" | "done";
export type PlanTaskPriority = "low" | "medium" | "high";

export interface PlanTaskTag {
   id: string;
   name: string;
   createdAt: number;
}

export interface PlanTask {
   id: string;
   title: string;
   note?: string;
   status: PlanTaskStatus;
   order: number;
   priority: PlanTaskPriority;
   tags?: PlanTaskTag[];
   dueDate?: number;
   completedAt?: number;
   createdAt: number;
   updatedAt?: number;
}

export type CreatePlanTaskInput = Pick<PlanTask, "title"> &
   Partial<Pick<PlanTask, "note" | "priority" | "dueDate" | "status">> & {
      tags: string[];
   };

export type UpdatePlanTaskInput = Partial<
   Pick<
      PlanTask,
      | "title"
      | "note"
      | "status"
      | "order"
      | "priority"
      | "dueDate"
      | "completedAt"
   >
> & {
   tags: string[];
};
