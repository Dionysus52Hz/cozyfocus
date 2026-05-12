import { ref, type Component } from "vue";

export interface AlertOptions {
   title?: string;
   description?: string;
   confirmLabel?: string;
   cancelLabel?: string;
   buttonVariant?: "default" | "destructive";
   icon?: Component;
}

interface DialogItem extends AlertOptions {
   resolve: (value: boolean) => void;
}

const queue = ref<DialogItem[]>([]);
const current = ref<DialogItem | null>(null);

const next = () => {
   current.value = queue.value.shift() ?? null;
};

export function useAlertDialog() {
   const confirm = (options: AlertOptions = {}): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
         queue.value.push({
            resolve,
            title: options.title ?? "Are you absolutely sure?",
            description: options.description,
            confirmLabel: options.confirmLabel ?? "Continue",
            cancelLabel: options.cancelLabel ?? "Cancel",
            buttonVariant: options.buttonVariant ?? "default",
            icon: options.icon,
         });

         if (!current.value) {
            next();
         }
         console.log(current.value);
      });
   };

   const handleConfirm = () => {
      current.value?.resolve(true);
      next();
   };

   const handleCancel = () => {
      current.value?.resolve(false);
      next();
   };

   const handleEscape = () => {
      if (!current.value) return;
      handleCancel();
   };

   return {
      current,
      confirm,
      handleConfirm,
      handleCancel,
      handleEscape,
   };
}
