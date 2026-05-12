<script setup lang="ts">
   import { Add01Icon } from "@hugeicons/core-free-icons";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Input } from "@/components/ui/input";
   import { toast } from "vue-sonner";
   import {
      FieldGroup,
      FieldLabel,
      FieldError,
      Field,
   } from "@/components/ui/field";
   import {
      DialogContent,
      DialogHeader,
      DialogTitle,
      Dialog,
   } from "@/components/ui/dialog";
   import {
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldContent,
      NumberFieldInput,
      NumberField,
   } from "@/components/ui/number-field";

   import { useForm, Field as VeeField } from "vee-validate";
   import { toTypedSchema } from "@vee-validate/zod";
   import { computed, watch } from "vue";
   import z from "zod";

   import { useFocusTasks } from "@/composables/useFocusTasks";
   import { useFocusTaskDialog } from "@/composables/useFocusTaskDialog";

   const emit = defineEmits<{
      (e: "closeForm"): void;
   }>();

   const vFocus = {
      mounted: (el: HTMLElement) => {
         const input =
            el.querySelector("input") ||
            (el instanceof HTMLInputElement ? el : null);
         input?.focus();
      },
   };

   const { createTask, updateTask } = useFocusTasks();
   const {
      isOpen,
      mode,
      editingTask,
      close: closeFocusTaskForm,
   } = useFocusTaskDialog();

   const formSchema = toTypedSchema(
      z.object({
         title: z.string().min(1, "Task title is required"),
         estimatedPomodoros: z.number(),
      }),
   );

   const initialValues = computed(() => ({
      title: editingTask.value?.title ?? "",
      estimatedPomodoros: editingTask.value?.estimatedPomodoros ?? 1,
   }));

   const { handleSubmit, resetForm } = useForm({
      validationSchema: formSchema,
      initialValues: initialValues.value,
   });

   const onSubmit = handleSubmit(async (values) => {
      const taskInput = {
         title: values.title,
         estimatedPomodoros: values.estimatedPomodoros,
      };
      const result =
         mode.value === "create"
            ? await createTask(taskInput)
            : await updateTask(editingTask.value!.id, taskInput);

      if (result.success) {
         toast.success(`Task '${values.title}' has been created`);
         resetForm();
         closeFocusTaskForm();
      } else {
         toast.error(result.error);
      }
   });

   const handleClose = () => {
      resetForm();
      closeFocusTaskForm();
   };

   watch(isOpen, async (value) => {
      if (value) {
         resetForm({ values: initialValues.value });
      }
   });
</script>

<template>
   <Dialog
      :open="isOpen"
      @update:open="(value) => !value && handleClose()">
      <DialogContent
         :show-close-button="false"
         class="max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-3xl flex flex-col overflow-hidden shadow-none border-2 bg-card text-card-foreground p-4">
         <DialogHeader>
            <DialogTitle class="text-sm">{{
               mode === "create" ? "New task" : "Update task"
            }}</DialogTitle>
         </DialogHeader>
         <form
            id="focus-task-form"
            class="flex flex-col gap-4"
            @submit="onSubmit">
            <FieldGroup class="gap-4">
               <VeeField
                  :validate-on-blur="false"
                  v-slot="{ field, errors }"
                  name="title">
                  <Field
                     orientation="horizontal"
                     :data-invalid="!!errors.length"
                     class="gap-y-1">
                     <FieldLabel class="text-sm">Title</FieldLabel>

                     <div class="flex flex-col gap-2 w-2/3">
                        <Input
                           v-focus
                           v-bind="field"
                           placeholder="What are you focusing on?"
                           autocomplete="off"
                           :aria-invalid="!!errors.length"
                           class="text-xs h-8" />
                        <FieldError
                           v-if="errors.length"
                           :errors="errors"
                           class="text-xs pl-2"></FieldError>
                     </div>
                  </Field>
               </VeeField>

               <VeeField
                  :validate-on-blur="false"
                  v-slot="{ field, errors }"
                  name="estimatedPomodoros">
                  <Field
                     :data-invalid="!!errors.length"
                     class="gap-y-1"
                     orientation="horizontal">
                     <FieldLabel class="text-sm"
                        >Estimated pomodoros</FieldLabel
                     >
                     <div class="flex flex-col gap-2 w-2/3">
                        <NumberField
                           id="estimatedPomodoros"
                           :model-value="field.value"
                           @update:model-value="field.onChange"
                           :step="1"
                           :min="1"
                           :max="100">
                           <NumberFieldContent
                              class="text-card-foreground overflow-hidden rounded-full border-2 text-xs h-9 bg-input">
                              <NumberFieldDecrement
                                 class="cursor-pointer border-r-2 hover:bg-secondary p-2" />
                              <NumberFieldInput
                                 class="outline-none overflow-hidden h-8! selection:bg-secondary" />
                              <NumberFieldIncrement
                                 class="cursor-pointer border-l-2 hover:bg-secondary p-2" />
                           </NumberFieldContent>
                        </NumberField>

                        <FieldError
                           v-if="errors.length"
                           :errors="errors"
                           class="text-xs pl-2"></FieldError>
                     </div>
                  </Field>
               </VeeField>
            </FieldGroup>

            <div class="flex justify-end items-center gap-2">
               <Button
                  @click="handleClose"
                  type="button"
                  variant="ghost"
                  class="cursor-pointer hover:bg-destructive/80"
                  >Cancel</Button
               >
               <Button
                  type="submit"
                  size="sm"
                  form="focus-task-form"
                  class="cursor-pointer text-xs border-2 text-primary-foreground">
                  <HugeiconsIcon :icon="Add01Icon" />{{
                     mode === "create" ? "Create task" : "Update task"
                  }}
               </Button>
            </div>
         </form>
      </DialogContent>
   </Dialog>
</template>
