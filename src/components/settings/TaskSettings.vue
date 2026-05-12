<script setup lang="ts">
   import { TriangleAlertIcon } from "lucide-vue-next";
   import { Button } from "@/components/ui/button";
   import { Switch } from "@/components/ui/switch";
   import {
      FieldDescription,
      FieldContent,
      FieldLegend,
      FieldGroup,
      FieldLabel,
      FieldSet,
      Field,
   } from "@/components/ui/field";
   import {
      TooltipProvider,
      TooltipTrigger,
      TooltipContent,
      Tooltip,
   } from "@/components/ui/tooltip";

   import { useAppSettings } from "@/composables/useAppSettings";
   import { computed, reactive } from "vue";

   const { settings, updateSettings } = useAppSettings();

   const form = reactive({
      autoSwitchToNextTask: settings.value.autoSwitchToNextTask,
      autoCheckTask: settings.value.autoCheckTask,
   });

   const convertBoolean = (key: keyof typeof form, val: boolean) => {
      (form[key] as any) = val ? 1 : 0;
   };

   const hasChanges = computed(() => {
      const currentSettings = {
         autoSwitchToNextTask: settings.value.autoSwitchToNextTask,
         autoCheckTask: settings.value.autoCheckTask,
      };
      return JSON.stringify(form) !== JSON.stringify(currentSettings);
   });

   const resetForm = () => {
      Object.assign(form, {
         autoSwitchToNextTask: settings.value.autoSwitchToNextTask,
         autoCheckTask: settings.value.autoCheckTask,
      });
   };

   const onSubmit = async () => {
      await updateSettings({ ...form });
   };
</script>

<template>
   <div
      class="flex flex-col flex-1 overflow-hidden min-h-0 text-card-foreground">
      <div class="min-h-0 h-full overflow-y-scroll no-scrollbar my-6 pb-1">
         <FieldGroup class="pr-1">
            <FieldSet>
               <FieldLegend
                  variant="label"
                  class="uppercase font-semibold"
                  >Focus task</FieldLegend
               >
               <FieldGroup>
                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Auto check task</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-auto-check-task"
                        variant="reverse"
                        :model-value="form.autoCheckTask === 1"
                        @update:model-value="
                           (value) => convertBoolean('autoCheckTask', value)
                        " />
                  </Field>

                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Auto switch to next task</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-auto-switch-to-next-task"
                        variant="reverse"
                        :model-value="form.autoSwitchToNextTask === 1"
                        @update:model-value="
                           (value) =>
                              convertBoolean('autoSwitchToNextTask', value)
                        " />
                  </Field>
               </FieldGroup>
            </FieldSet>
         </FieldGroup>
      </div>

      <div class="mt-auto mb-1 mr-1">
         <span
            v-if="hasChanges"
            class="flex items-center text-sm gap-x-2 mb-2 text-destructive">
            <TriangleAlertIcon class="size-4" />
            Unsaved changes
         </span>
         <div class="grid grid-cols-2 gap-x-2">
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger as-child>
                     <Button
                        variant="destructive"
                        @click="resetForm"
                        class="cursor-pointer text-primary-foreground rounded-full border-2"
                        :disabled="!hasChanges">
                        Reset
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent
                     class="bg-destructive border-2 rounded-full text-secondary-foreground">
                     <p>Revert all changes to last saved state</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>

            <Button
               class="cursor-pointer border-2 rounded-full hover:bg-primary/80"
               @click="onSubmit"
               :disabled="!hasChanges">
               Save changes
            </Button>
         </div>
      </div>
   </div>
</template>
