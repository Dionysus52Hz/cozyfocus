import type { AppSettings, FocusTask, PlanTask } from "@/types";
import Dexie, { type Table } from "dexie";

export interface AppSetting {
   key: keyof AppSettings;
   value: any;
}

export class CozyFocusDB extends Dexie {
   settings!: Table<AppSetting, string>;
   focusTasks!: Table<FocusTask, string>;
   planTasks!: Table<PlanTask, string>;

   constructor() {
      super("cozyfocus");

      this.version(2).stores({
         settings: "key",
         focusTasks: "id, isCompleted, isActive, createdAt",
         planTasks: "id, status, order, priority, createdAt",
      });
   }
}
export const dexie = new CozyFocusDB();
