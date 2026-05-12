<script setup lang="ts">
   import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

   import { useAppSettings } from "@/composables/useAppSettings";

   import { THEMES } from "@/constants";

   const { settings, updateSetting } = useAppSettings();
</script>

<template>
   <div class="flex flex-col gap-3 h-full">
      <h1 class="text-sm font-semibold text-primary-foreground">Theme</h1>
      <div class="flex-1 min-h-0 overflow-y-scroll no-scrollbar">
         <div class="grid grid-cols-2 gap-2">
            <Item
               v-for="theme in THEMES"
               :key="theme.id"
               @click="updateSetting('theme', theme.id)"
               class="p-3 gap-2 border-2 border-transparent cursor-pointer transition-all"
               :class="
                  settings.theme === theme.id
                     ? 'border-border bg-primary/30'
                     : 'hover:bg-accent'
               ">
               <ItemContent class="gap-2">
                  <div class="flex rounded-[12px] overflow-hidden">
                     <span
                        class="h-14 w-1/5"
                        :style="{ background: theme.preview.secondary }" />
                     <span
                        class="h-14 w-1/5"
                        :style="{ background: theme.preview.input }" />
                     <span
                        class="h-14 w-1/5"
                        :style="{ background: theme.preview.card }" />
                     <span
                        class="h-14 w-1/5"
                        :style="{ background: theme.preview.accent }" />
                     <span
                        class="h-14 w-1/5"
                        :style="{ background: theme.preview.primary }" />
                  </div>
                  <ItemTitle class="text-xs font-normal text-card-foreground">{{
                     theme.name
                  }}</ItemTitle>
               </ItemContent>
            </Item>
         </div>
      </div>
   </div>
</template>
