<script setup lang="ts">
   import { ArrowDown01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
   import { Separator } from "@/components/ui/separator";
   import { Textarea } from "@/components/ui/textarea";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Input } from "@/components/ui/input";
   import { toast } from "vue-sonner";
   import {
      ListboxItemIndicator,
      ListboxContent,
      ListboxFilter,
      ListboxItem,
      ListboxRoot,
      useFilter,
   } from "reka-ui";
   import {
      PopoverAnchor,
      PopoverContent,
      PopoverTrigger,
      Popover,
   } from "@/components/ui/popover";
   import {
      TagsInputItemDelete,
      TagsInputItemText,
      TagsInputInput,
      TagsInputItem,
      TagsInput,
   } from "@/components/ui/tags-input";
   import {
      DialogContent,
      DialogHeader,
      DialogTitle,
      Dialog,
   } from "@/components/ui/dialog";
   import {
      FieldContent,
      FieldGroup,
      FieldLabel,
      FieldError,
      Field,
   } from "@/components/ui/field";
   import {
      SelectContent,
      SelectTrigger,
      SelectValue,
      SelectItem,
      Select,
   } from "@/components/ui/select";

   import z from "zod";
   import { useForm, Field as VeeField } from "vee-validate";
   import { toTypedSchema } from "@vee-validate/zod";
   import { computed, nextTick, watch } from "vue";
   import { ref } from "vue";

   import { usePlanTaskDialog } from "@/composables/usePlanTaskDialog";
   import { usePlanTasks } from "@/composables/usePlanTasks";

   const {
      isOpen,
      mode,
      defaultStatus,
      editingTask,
      close: closePlanTaskForm,
   } = usePlanTaskDialog();
   const {
      createTask,
      updateTask,
      tags: availableTags,
      refetchTags,
   } = usePlanTasks();

   const vFocus = {
      mounted: (el: HTMLElement) => {
         nextTick(() => el.focus());
      },
   };

   const formSchema = toTypedSchema(
      z.object({
         title: z
            .string({ required_error: "Title is required" })
            .min(1, "Title is required")
            .max(100, "Title must be less than 100 characters"),
         note: z
            .string()
            .max(500, "Note must be less than 500 characters")
            .optional(),
         status: z.enum(["todo", "doing", "done"]).default("todo"),
         priority: z.enum(["low", "medium", "high"]).default("medium"),
         tags: z.array(z.string()).default([]),
         dueDate: z.string().optional(),
      }),
   );

   const initialValues = computed(() => ({
      title: editingTask.value?.title ?? "",
      note: editingTask.value?.note ?? "",
      status: editingTask.value?.status ?? defaultStatus.value,
      priority: editingTask.value?.priority ?? "low",
      tags:
         editingTask.value?.tags
            ?.filter((tag) => availableTags.value.some((t) => t.id === tag.id))
            .map((tag) => tag.name) ?? [],
      dueDate: editingTask.value?.dueDate
         ? new Date(editingTask.value.dueDate).toISOString().split("T")[0]
         : "",
   }));

   const { handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
      validationSchema: formSchema,
      initialValues: initialValues.value,
   });

   watch(isOpen, async (value) => {
      if (value) {
         await nextTick();
         await refetchTags();
         resetForm({ values: initialValues.value });
      }
   });

   const onSubmit = handleSubmit(async (values) => {
      const taskInput = {
         title: values.title,
         note: values.note || undefined,
         status: values.status,
         priority: values.priority,
         tags: values.tags,
         dueDate: values.dueDate
            ? new Date(values.dueDate).getTime()
            : undefined,
      };

      const result =
         mode.value === "create"
            ? await createTask(taskInput)
            : await updateTask(editingTask.value!.id, taskInput);

      if (result.success) {
         toast.success(
            mode.value === "create"
               ? `Task '${values.title}' created!`
               : "Task updated!",
         );
         resetForm();
         closePlanTaskForm();
      } else {
         toast.error(result.error);
      }
   });

   const handleClose = () => {
      resetForm();
      closePlanTaskForm();
   };

   const searchTerm = ref("");
   const open = ref(false);
   const { contains } = useFilter({ sensitivity: "base" });
   const filteredTags = computed(() =>
      searchTerm.value === ""
         ? availableTags.value
         : availableTags.value.filter((tag) =>
              contains(tag.name, searchTerm.value),
           ),
   );

   const handleAddCustomTag = (currentTags: string[]) => {
      const trimmed = searchTerm.value.trim();
      if (!trimmed) return;
      const already = currentTags.some(
         (t) => t.toLowerCase() === trimmed.toLowerCase(),
      );
      if (!already) setFieldValue("tags", [...currentTags, trimmed]);
      searchTerm.value = "";
      open.value = false;
   };

   watch(searchTerm, (term) => {
      if (term) {
         open.value = true;
      }
   });
</script>

<template>
   <Dialog
      :open="isOpen"
      @update:open="(value) => !value && handleClose()">
      <DialogContent
         :show-close-button="false"
         class="max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-3xl flex flex-col overflow-hidden shadow-none border-2 bg-card text-card-foreground p-0">
         <DialogHeader class="p-4 pb-0">
            <DialogTitle class="text-sm">{{
               mode === "create"
                  ? "New plan task"
                  : `Update task "${editingTask?.title}"`
            }}</DialogTitle>
         </DialogHeader>

         <Separator class="h-0.5!" />

         <div class="w-full min-h-0 overflow-auto no-scrollbar px-4">
            <form
               id="plan-task-form"
               class="text-primary-foreground"
               @submit="onSubmit">
               <FieldGroup class="gap-4">
                  <VeeField
                     :validate-on-blur="false"
                     v-slot="{ field, errors }"
                     name="title">
                     <Field
                        :data-invalid="!!errors.length"
                        class="gap-y-2">
                        <FieldContent>
                           <FieldLabel>Title</FieldLabel>
                           <Input
                              v-focus
                              autofocus
                              v-bind="field"
                              placeholder="What need to be done?"
                              autocomplete="off"
                              :aria-invalid="!!errors.length"
                              class="plan-task-title text-sm" />
                        </FieldContent>

                        <FieldError
                           v-if="errors.length"
                           :errors="errors"></FieldError>
                     </Field>
                  </VeeField>

                  <VeeField
                     :validate-on-blur="false"
                     v-slot="{ field, errors }"
                     name="note">
                     <Field
                        :data-invalid="!!errors.length"
                        class="gap-y-2">
                        <FieldContent>
                           <FieldLabel> Note </FieldLabel>
                           <Textarea
                              v-bind="field"
                              placeholder="Add a note..."
                              rows="3"
                              autocomplete="off"
                              :aria-invalid="!!errors.length"
                              class="border-2 border-border bg-input outline-0 ring-0 focus-visible:ring-0 focus-visible:border-border text-sm" />
                        </FieldContent>

                        <FieldError
                           v-if="errors.length"
                           :errors="errors"></FieldError>
                     </Field>
                  </VeeField>

                  <FieldGroup class="grid grid-cols-2 items-center gap-x-4">
                     <VeeField
                        :validate-on-blur="false"
                        v-slot="{ field, errors, value }"
                        name="status">
                        <Field
                           :data-invalid="!!errors.length"
                           class="gap-y-2">
                           <FieldContent>
                              <FieldLabel>Status</FieldLabel>
                              <Select
                                 :model-value="value"
                                 @update:model-value="field.onChange">
                                 <SelectTrigger
                                    class="w-full border-2 border-border cursor-pointer bg-input">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent
                                    class="border-2 shadow-none text-primary-foreground [&_[data-slot=select-item][data-highlighted]]:bg-accent">
                                    <SelectItem value="todo"> Todo </SelectItem>

                                    <SelectItem value="doing">
                                       In progress
                                    </SelectItem>

                                    <SelectItem value="done"> Done </SelectItem>
                                 </SelectContent>
                              </Select>
                           </FieldContent>

                           <FieldError
                              v-if="errors.length"
                              :errors="errors"></FieldError>
                        </Field>
                     </VeeField>

                     <VeeField
                        :validate-on-blur="false"
                        v-slot="{ field, errors, value }"
                        name="priority">
                        <Field
                           :data-invalid="!!errors.length"
                           class="gap-y-2">
                           <FieldContent>
                              <FieldLabel>Priority</FieldLabel>
                              <Select
                                 :model-value="value"
                                 @update:model-value="field.onChange">
                                 <SelectTrigger
                                    class="w-full border-2 border-border cursor-pointer bg-input">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent
                                    class="border-2 shadow-none text-primary-foreground [&_[data-slot=select-item][data-highlighted]]:bg-accent">
                                    <SelectItem value="low"> Low </SelectItem>

                                    <SelectItem value="medium">
                                       Medium
                                    </SelectItem>

                                    <SelectItem value="high"> High </SelectItem>
                                 </SelectContent>
                              </Select>
                           </FieldContent>

                           <FieldError
                              v-if="errors.length"
                              :errors="errors"></FieldError>
                        </Field>
                     </VeeField>
                  </FieldGroup>

                  <FieldGroup class="grid grid-cols-2 gap-x-4">
                     <VeeField
                        :validate-on-blur="false"
                        v-slot="{ value, errors }"
                        name="tags">
                        <Field
                           :data-invalid="!!errors.length"
                           class="gap-y-2">
                           <FieldContent>
                              <FieldLabel> Tags </FieldLabel>

                              <Popover v-model:open="open">
                                 <ListboxRoot
                                    :model-value="value"
                                    @update:model-value="
                                       (v) =>
                                          setFieldValue(
                                             'tags',
                                             (v as string[]) ?? [],
                                          )
                                    "
                                    highlight-on-hover
                                    multiple>
                                    <PopoverAnchor class="inline-flex">
                                       <TagsInput
                                          v-slot="{ modelValue: selectedTags }"
                                          :model-value="value"
                                          @update:model-value="
                                             (v) =>
                                                setFieldValue(
                                                   'tags',
                                                   (v as string[]) ?? [],
                                                )
                                          "
                                          class="w-full border-2 border-border focus-within:ring-0 focus-within:outline-none focus-within:border-border bg-input">
                                          <TagsInputItem
                                             v-for="item in selectedTags"
                                             :key="item.toString()"
                                             :value="item.toString()"
                                             class="bg-primary">
                                             <TagsInputItemText>
                                                #{{ item.toString() }}
                                             </TagsInputItemText>
                                             <TagsInputItemDelete />
                                          </TagsInputItem>
                                          <ListboxFilter
                                             v-model="searchTerm"
                                             as-child>
                                             <TagsInputInput
                                                placeholder="Work, study, play,..."
                                                @keydown.enter.prevent="
                                                   handleAddCustomTag(
                                                      value ?? [],
                                                   )
                                                "
                                                @keydown.down="open = true"
                                                class="selection:bg-secondary" />
                                          </ListboxFilter>
                                          <PopoverTrigger as-child>
                                             <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                class="size-6 order-last self-start ml-auto border-2 border-transparent cursor-pointer hover:border-border hover:bg-transparent">
                                                <HugeiconsIcon
                                                   :icon="ArrowDown01Icon" />
                                             </Button>
                                          </PopoverTrigger>
                                       </TagsInput>
                                    </PopoverAnchor>
                                    <PopoverContent
                                       class="p-1 border-2 shadow-none"
                                       @open-auto-focus.prevent>
                                       <ListboxContent
                                          class="max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto empty:after:content-['No_options'] empty:p-1 empty:after:block no-scrollbar"
                                          tabindex="0">
                                          <!-- <CommandEmpty>No results found.</CommandEmpty> -->
                                          <div
                                             v-if="
                                                searchTerm &&
                                                !filteredTags.length
                                             "
                                             class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-primary-foreground cursor-pointer hover:bg-input"
                                             @click="
                                                handleAddCustomTag(value ?? [])
                                             ">
                                             <span>Create tag</span>
                                             <span class="font-medium"
                                                >"{{ searchTerm }}"</span
                                             >
                                          </div>
                                          <ListboxItem
                                             v-for="tag in filteredTags"
                                             :key="tag.id"
                                             class="data-highlighted:bg-accent text-primary-foreground data-highlighted:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4"
                                             :value="tag.name"
                                             @select="
                                                () => {
                                                   searchTerm = '';
                                                }
                                             ">
                                             <span>{{ tag.name }}</span>
                                             <ListboxItemIndicator
                                                class="ml-auto inline-flex items-center justify-center">
                                                <HugeiconsIcon
                                                   :icon="Tick01Icon"
                                                   :strokeWidth="2" />
                                             </ListboxItemIndicator>
                                          </ListboxItem>
                                       </ListboxContent>
                                    </PopoverContent>
                                 </ListboxRoot>
                              </Popover>
                           </FieldContent>

                           <FieldError
                              v-if="errors.length"
                              :errors="errors"></FieldError>
                        </Field>
                     </VeeField>

                     <VeeField
                        :validate-on-blur="false"
                        v-slot="{ field, errors }"
                        name="dueDate">
                        <Field
                           :data-invalid="!!errors.length"
                           class="gap-y-2">
                           <FieldContent>
                              <FieldLabel> Deadline </FieldLabel>

                              <Input
                                 type="date"
                                 v-bind="field"
                                 :aria-invalid="!!errors.length"
                                 class="text-sm" />
                           </FieldContent>

                           <FieldError
                              v-if="errors.length"
                              :errors="errors"></FieldError>
                        </Field>
                     </VeeField>
                  </FieldGroup>
               </FieldGroup>
            </form>
         </div>

         <div class="flex justify-end gap-x-2 p-4 pt-0">
            <Button
               @click="handleClose"
               type="button"
               variant="ghost"
               class="cursor-pointer hover:bg-destructive/80"
               >Cancel</Button
            >
            <Button
               type="submit"
               form="plan-task-form"
               class="cursor-pointer border-2"
               :disabled="isSubmitting">
               {{
                  isSubmitting
                     ? mode === "create"
                        ? "Creating..."
                        : "Updating..."
                     : mode === "create"
                       ? "Create task"
                       : "Update task"
               }}
            </Button>
         </div>
      </DialogContent>
   </Dialog>
</template>
