<script setup lang="ts">
   import {
      Command,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList,
   } from "@/components/ui/command";
   import { EmptyMedia } from "@/components/ui/empty";
   import { Separator } from "@/components/ui/separator";

   import { useAppSettings } from "@/composables/useAppSettings";

   import { THEMES } from "@/constants";
   import { AlbumNotFoundIcon } from "@hugeicons/core-free-icons";
   import { HugeiconsIcon } from "@hugeicons/vue";

   const { settings, updateSetting } = useAppSettings();
</script>

<template>
   <div class="flex flex-col gap-3 h-full">
      <h1 class="text-sm font-semibold text-primary-foreground p-3 pb-0">
         Choose your theme
      </h1>
      <Separator class="h-0.5!" />
      <div class="flex-1 min-h-0 overflow-y-scroll no-scrollbar p-2 pt-0">
         <Command class="p-1">
            <CommandInput
               class="h-9 bg-input text-sm rounded-full border-2 text-primary-foreground selection:bg-primary/30"
               placeholder="Search themes..." />
            <CommandList class="no-scrollbar">
               <CommandEmpty
                  class="text-primary-foreground flex flex-col items-center gap-2">
                  <EmptyMedia
                     variant="icon"
                     class="m-0 bg-accent text-accent-foreground">
                     <HugeiconsIcon :icon="AlbumNotFoundIcon" />
                  </EmptyMedia>
                  No themes found.</CommandEmpty
               >
               <CommandGroup class="grid grid-cols-2 gap-2 pt-3">
                  <CommandItem
                     v-for="theme in THEMES"
                     :key="theme.id"
                     :value="theme.name"
                     @click="updateSetting('theme', theme.id)"
                     class="flex flex-col p-3 gap-2 border-2 border-transparent cursor-pointer transition-all"
                     :class="
                        settings.theme === theme.id
                           ? 'border-border bg-primary/30'
                           : 'hover:bg-accent'
                     ">
                     <div class="w-full flex rounded-[12px] overflow-hidden">
                        <span
                           class="h-14 w-1/5"
                           :style="{
                              background: theme.preview.secondary,
                           }" />
                        <span
                           class="h-14 w-1/5"
                           :style="{ background: theme.preview.input }" />
                        <span
                           class="h-14 w-1/5"
                           :style="{ background: theme.preview.card }" />
                        <span
                           class="h-14 w-1/5"
                           :style="{
                              background: theme.preview.accent,
                           }" />
                        <span
                           class="h-14 w-1/5"
                           :style="{
                              background: theme.preview.primary,
                           }" />
                     </div>
                     <p
                        class="text-sm font-normal text-card-foreground text-center">
                        {{ theme.name }}
                     </p>
                  </CommandItem>
               </CommandGroup>
            </CommandList>
         </Command>
      </div>
   </div>
</template>
