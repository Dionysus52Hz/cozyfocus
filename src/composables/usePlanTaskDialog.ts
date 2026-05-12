import type { PlanTask, PlanTaskStatus } from "@/types";
import { ref } from "vue";

type DialogMode = "create" | "update";

const isOpen = ref(false);
const mode = ref<DialogMode>("create");
const defaultStatus = ref<PlanTaskStatus>("todo");
const editingTask = ref<PlanTask | null>(null);

export function usePlanTaskDialog() {
   const openCreate = (status: PlanTaskStatus = "todo") => {
      mode.value = "create";
      defaultStatus.value = status;
      editingTask.value = null;
      isOpen.value = true;
   };

   const openUpdate = (task: PlanTask) => {
      mode.value = "update";
      editingTask.value = task;
      isOpen.value = true;
   };

   const close = () => {
      isOpen.value = false;
      editingTask.value = null;
   };

   return {
      isOpen,
      mode,
      defaultStatus,
      editingTask,
      openCreate,
      openUpdate,
      close,
   };
}
