<script setup lang="ts">
   import { TriangleAlertIcon } from "lucide-vue-next";
   import { Button } from "@/components/ui/button";
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
   import {
      SelectTrigger,
      SelectContent,
      SelectItem,
      SelectValue,
      Select,
   } from "@/components/ui/select";

   import { computed, reactive } from "vue";

   import { useAppSettings } from "@/composables/useAppSettings";

   const { settings, updateSettings } = useAppSettings();

   const form = reactive({
      autoHideUIDelay: settings.value.autoHideUIDelay,
   });

   const hasChanges = computed(() => {
      const currentSettings = {
         autoHideUIDelay: settings.value.autoHideUIDelay,
      };
      return JSON.stringify(form) !== JSON.stringify(currentSettings);
   });

   const resetForm = () => {
      Object.assign(form, {
         autoHideUIDelay: settings.value.autoHideUIDelay,
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
                     <div class="grid grid-cols-2 gap-3">
                        <FieldContent>
                           <FieldLabel>Auto hide UI after</FieldLabel>
                           <FieldDescription
                              >Lorem ipsum dolor sit amet consectetur
                              adipisicing elit. Fugit, voluptates illum. Alias
                              a, asperiores quod at impedit nisi! Vel temporibus
                              iusto ipsum optio quas iure doloribus sequi velit
                              delectus facere.</FieldDescription
                           >
                        </FieldContent>

                        <Select v-model="form.autoHideUIDelay">
                           <SelectTrigger
                              class="w-full border-2 border-border! cursor-pointer bg-input outline-none! ring-0!">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent
                              class="bg-card border-2 text-primary-foreground [&_[data-slot=select-item][data-highlighted]]:bg-input [&_[data-slot=select-item][data-highlighted]]:text-primary-foreground [&_[data-slot=select-item][data-highlighted]]:border-">
                              <SelectItem :value="0"> Never </SelectItem>

                              <SelectItem :value="5000"> 5 seconds </SelectItem>

                              <SelectItem :value="10000">
                                 10 seconds
                              </SelectItem>

                              <SelectItem :value="15000">
                                 15 seconds
                              </SelectItem>

                              <SelectItem :value="30000">
                                 30 seconds
                              </SelectItem>

                              <SelectItem :value="60000"> 1 minute </SelectItem>

                              <SelectItem :value="600000">
                                 10 minutes
                              </SelectItem>

                              <SelectItem :value="1800000">
                                 30 minutes
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
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
                        class="border-2 rounded-full cursor-pointer text-primary-foreground"
                        :disabled="!hasChanges">
                        Reset
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent
                     class="border-2 rounded-full bg-destructive text-primary-foreground">
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
