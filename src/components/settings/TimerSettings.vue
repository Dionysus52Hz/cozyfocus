<script setup lang="ts">
   import { MinusIcon, PlusIcon, TriangleAlertIcon } from "lucide-vue-next";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
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
      TooltipContent,
      TooltipTrigger,
      Tooltip,
   } from "@/components/ui/tooltip";

   import { useAppSettings } from "@/composables/useAppSettings";
   import { reactive, computed } from "vue";

   const { settings, updateSettings } = useAppSettings();

   const form = reactive({
      focusDuration: settings.value.focusDuration,
      shortBreakDuration: settings.value.shortBreakDuration,
      longBreakDuration: settings.value.longBreakDuration,
      sessionsUntilLongBreak: settings.value.sessionsUntilLongBreak,
      autoStartBreaks: settings.value.autoStartBreaks,
      autoStartFocus: settings.value.autoStartFocus,
      countUp: settings.value.countUp,
      showTimerProgress: settings.value.showTimerProgress,
      pauseTimerWhenSwitchingTask: settings.value.pauseTimerWhenSwitchingTask,
   });

   const convertBoolean = (key: keyof typeof form, val: boolean) => {
      (form[key] as any) = val ? 1 : 0;
   };

   const hasChanges = computed(() => {
      const currentSettings = {
         focusDuration: settings.value.focusDuration,
         shortBreakDuration: settings.value.shortBreakDuration,
         longBreakDuration: settings.value.longBreakDuration,
         sessionsUntilLongBreak: settings.value.sessionsUntilLongBreak,
         autoStartBreaks: settings.value.autoStartBreaks,
         autoStartFocus: settings.value.autoStartFocus,
         countUp: settings.value.countUp,
         showTimerProgress: settings.value.showTimerProgress,
         pauseTimerWhenSwitchingTask:
            settings.value.pauseTimerWhenSwitchingTask,
      };
      return JSON.stringify(form) !== JSON.stringify(currentSettings);
   });

   const resetForm = () => {
      Object.assign(form, {
         focusDuration: settings.value.focusDuration,
         shortBreakDuration: settings.value.shortBreakDuration,
         longBreakDuration: settings.value.longBreakDuration,
         sessionsUntilLongBreak: settings.value.sessionsUntilLongBreak,
         autoStartBreaks: settings.value.autoStartBreaks,
         autoStartFocus: settings.value.autoStartFocus,
         countUp: settings.value.countUp,
         showTimerProgress: settings.value.showTimerProgress,
         pauseTimerWhenSwitchingTask:
            settings.value.pauseTimerWhenSwitchingTask,
      });
   };

   const onSubmit = async () => {
      await updateSettings({ ...form });
   };
</script>

<template>
   <div
      class="flex flex-col flex-1 overflow-hidden min-h-0 text-card-foreground">
      <div class="min-h-0 h-full overflow-y-scroll no-scrollbar my-4 pb-1">
         <FieldGroup class="">
            <FieldSet
               class="[&_button]:bg-transparent [&_button]:hover:bg-input [&_button]:cursor-pointer [&_button]:text-card-foreground">
               <FieldLegend
                  variant="label"
                  class="uppercase font-semibold">
                  Duration (minutes)
               </FieldLegend>

               <FieldGroup>
                  <Field
                     orientation="horizontal"
                     class="grid grid-cols-2">
                     <FieldLabel for="settings-focus-duration"
                        >Focus</FieldLabel
                     >

                     <div class="flex items-center gap-x-2">
                        <Button
                           class="rounded-full border-2"
                           @click="
                              form.focusDuration > 1 && form.focusDuration--
                           "
                           size="icon">
                           <MinusIcon />
                        </Button>

                        <Input
                           id="settings-focus-duration"
                           class="no-spinner text-center"
                           v-model.number="form.focusDuration"
                           type="number"
                           min="1" />

                        <Button
                           class="rounded-full border-2"
                           @click="form.focusDuration++"
                           size="icon">
                           <PlusIcon />
                        </Button>
                     </div>
                  </Field>

                  <Field
                     orientation="horizontal"
                     class="grid grid-cols-2">
                     <FieldLabel for="settings-short-break-duration"
                        >Short Break</FieldLabel
                     >

                     <div class="flex items-center gap-x-2">
                        <Button
                           class="rounded-full border-2"
                           @click="
                              form.shortBreakDuration > 1 &&
                              form.shortBreakDuration--
                           "
                           size="icon">
                           <MinusIcon />
                        </Button>

                        <Input
                           id="settings-short-break-duration"
                           class="no-spinner text-center"
                           v-model.number="form.shortBreakDuration"
                           type="number"
                           min="1" />

                        <Button
                           class="rounded-full border-2"
                           @click="form.shortBreakDuration++"
                           size="icon">
                           <PlusIcon />
                        </Button>
                     </div>
                  </Field>

                  <Field
                     orientation="horizontal"
                     class="grid grid-cols-2">
                     <FieldLabel for="settings-long-break-duration"
                        >Long Break</FieldLabel
                     >

                     <div class="flex items-center gap-x-2">
                        <Button
                           class="rounded-full border-2"
                           @click="
                              form.longBreakDuration > 1 &&
                              form.longBreakDuration--
                           "
                           size="icon">
                           <MinusIcon />
                        </Button>

                        <Input
                           id="settings-long-break-duration"
                           class="no-spinner text-center"
                           v-model.number="form.longBreakDuration"
                           type="number"
                           min="1" />

                        <Button
                           class="rounded-full border-2"
                           @click="form.longBreakDuration++"
                           size="icon">
                           <PlusIcon />
                        </Button>
                     </div>
                  </Field>

                  <Field
                     orientation="horizontal"
                     class="grid grid-cols-2">
                     <FieldLabel for="settings-long-break-interval"
                        >Sessions until long break</FieldLabel
                     >
                     <div class="flex items-center gap-x-2">
                        <Button
                           class="rounded-full border-2"
                           @click="
                              form.sessionsUntilLongBreak > 1 &&
                              form.sessionsUntilLongBreak--
                           "
                           size="icon">
                           <MinusIcon />
                        </Button>

                        <Input
                           id="settings-long-break-interval"
                           class="no-spinner text-center"
                           v-model.number="form.sessionsUntilLongBreak"
                           type="number"
                           min="1" />

                        <Button
                           class="rounded-full border-2"
                           @click="form.sessionsUntilLongBreak++"
                           size="icon">
                           <PlusIcon />
                        </Button>
                     </div>
                  </Field>
               </FieldGroup>
            </FieldSet>

            <FieldSet>
               <FieldLegend
                  variant="label"
                  class="uppercase font-semibold"
                  >Options</FieldLegend
               >
               <FieldGroup>
                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Count up</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-count-up"
                        class="cursor-pointer"
                        :model-value="form.countUp === 1"
                        @update:model-value="
                           (value) => convertBoolean('countUp', value)
                        " />
                  </Field>

                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Show timer progress</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-show-timer-progress"
                        class="cursor-pointer"
                        :model-value="form.showTimerProgress === 1"
                        @update:model-value="
                           (value) => convertBoolean('showTimerProgress', value)
                        " />
                  </Field>

                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Auto start breaks</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-auto-start-breaks"
                        class="cursor-pointer"
                        :model-value="form.autoStartBreaks === 1"
                        @update:model-value="
                           (value) => convertBoolean('autoStartBreaks', value)
                        " />
                  </Field>

                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Auto start focus</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-auto-start-focus"
                        class="cursor-pointer"
                        :model-value="form.autoStartFocus === 1"
                        @update:model-value="
                           (value) => convertBoolean('autoStartFocus', value)
                        " />
                  </Field>

                  <Field orientation="horizontal">
                     <FieldContent>
                        <FieldLabel>Pause timer when switching task</FieldLabel>
                        <FieldDescription
                           >Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Fugit, voluptates illum. Alias a, asperiores
                           quod at impedit nisi! Vel temporibus iusto ipsum
                           optio quas iure doloribus sequi velit delectus
                           facere.</FieldDescription
                        >
                     </FieldContent>
                     <Switch
                        id="settings-pause-timer-when-switching-task"
                        class="cursor-pointer"
                        :model-value="form.pauseTimerWhenSwitchingTask === 1"
                        @update:model-value="
                           (value) =>
                              convertBoolean(
                                 'pauseTimerWhenSwitchingTask',
                                 value,
                              )
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
                        class="cursor-pointer rounded-full border-2 text-primary-foreground"
                        :disabled="!hasChanges">
                        Reset
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent
                     class="bg-destructive border-2 rounded-full text-primary-foreground">
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
