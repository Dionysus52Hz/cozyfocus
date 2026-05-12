<script setup lang="ts">
   import "vue-sonner/style.css";

   import BackgroundRenderer from "@/components/common/BackgroundRenderer.vue";
   import SettingTriggers from "@/components/settings/SettingTriggers.vue";
   import { useFullscreen } from "@/composables/useFullscreen";
   import { useLayoutStore } from "@/stores/useLayoutStore";
   import { useIdle } from "@/composables/useIdle";
   import { getIcon, getTooltipContent } from "@/utils/components";

   import { onMounted, onUnmounted } from "vue";

   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
   } from "@/components/ui/tooltip";

   const { isFullscreen, initListener, destroyListener } = useFullscreen();

   const { isIdle } = useIdle();
   const layoutStore = useLayoutStore();

   onMounted(initListener);
   onUnmounted(destroyListener);
</script>

<template>
   <div
      class="main-layout relative h-dvh overflow-hidden p-4 grid grid-cols-[48px_1fr_48px] gap-4 pb-bottom-toolbar">
      <BackgroundRenderer />

      <aside
         class="transition-opacity duration-300 z-25"
         :class="isIdle ? 'opacity-0' : 'opacity-100'">
         <div
            class="flex flex-col items-center gap-1 bg-card text-card-foreground rounded-full border-2 py-1">
            <TooltipProvider v-for="widget in layoutStore.widgets">
               <Tooltip>
                  <TooltipTrigger>
                     <Button
                        :key="widget.i"
                        size="icon-sm"
                        variant="ghost"
                        class="border-2 border-transparent hover:bg-primary/50 cursor-pointer"
                        @click="layoutStore.toggleWidget(widget.i)"
                        :class="{
                           'bg-primary border-border text-primary-foreground':
                              widget.visible,
                        }">
                        <HugeiconsIcon
                           :icon="getIcon(widget.i)"
                           :strokeWidth="2" />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{{
                     getTooltipContent(widget.i)
                  }}</TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </div>
      </aside>

      <main
         class="transition-all duration-300 no-scrollbar pb-4"
         :class="isFullscreen ? 'mt-0 mb-0' : ''">
         <slot />
      </main>

      <aside
         class="z-25 transition-opacity duration-300"
         :class="isIdle ? 'opacity-0' : 'opacity-100'">
         <SettingTriggers />
      </aside>
   </div>
</template>
