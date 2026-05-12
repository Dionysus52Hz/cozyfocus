import type { FocusTask } from "@/types";
import { ref } from "vue";

type DialogMode = "create" | "update";

const isOpen = ref(false);
const mode = ref<DialogMode>("create");
const editingTask = ref<FocusTask | null>(null);

export function useFocusTaskDialog() {
   const openCreate = () => {
      mode.value = "create";
      editingTask.value = null;
      isOpen.value = true;
   };

   const openUpdate = (task: FocusTask) => {
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
      editingTask,
      openCreate,
      openUpdate,
      close,
   };
}
