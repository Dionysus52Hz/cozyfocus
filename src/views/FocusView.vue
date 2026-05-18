<script setup lang="ts">
   import { useElementSize } from "@vueuse/core";
   import { ref, watch, provide } from "vue";

   import DraggableWidget from "@/components/common/DraggableWidget.vue";
   import YouTubePlayer from "@/components/music/YouTubePlayer.vue";
   import PlayerToolbar from "@/components/music/PlayerToolbar.vue";
   import TimerDisplay from "@/components/timer/TimerDisplay.vue";
   import { useMusicPlayer } from "@/composables/useMusicPlayer";
   import { useLayoutStore } from "@/stores/useLayoutStore";
   import MP3Player from "@/components/music/MP3Player.vue";
   import PlanTask from "@/components/plan/PlanTask.vue";
   import type { TrackSource } from "@/types";

   import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
   } from "@/components/ui/tabs";
   import FocusTasksList from "@/components/focus/FocusTasksList.vue";

   const store = useLayoutStore();
   const container = ref<HTMLElement | null>(null);
   const { width, height } = useElementSize(container);

   watch(height, (newHeight) => {
      if (newHeight > 0 && newHeight < 400) {
         Object.values(store.widgets).forEach(
            (widget) => (widget.visible = false),
         );
      }
   });

   watch(
      [width, height],
      ([newW, newH]) => {
         if (newW > 0 && newH > 0 && !store.state.initialized) {
            store.initDynamicLayout(newW, newH);
         }
      },
      { immediate: true },
   );

   provide("dragContainer", container);

   const { settings, switchActiveSource } = useMusicPlayer();
</script>

<template>
   <div
      ref="container"
      class="w-full h-full relative flex justify-center items-center">
      <DraggableWidget
         v-show="store.widgets.plan?.visible"
         id="plan"
         title="Plan"
         description="To-do list">
         <PlanTask />
      </DraggableWidget>

      <DraggableWidget
         v-show="store.widgets.music?.visible"
         id="music"
         title="Music"
         description="Music makes your day better">
         <Tabs
            :model-value="settings.activeSource"
            @update:model-value="
               (value) => switchActiveSource(value as TrackSource)
            "
            :unmount-on-hide="false"
            class="h-full overflow-hidden">
            <TabsList
               class="relative shrink-0 [&_button]:cursor-pointer h-10 w-full bg-transparent gap-x-1 border-2 rounded-full [&_button]:border-transparent [&_button]:data-[state=active]:border-border [&_button]:data-[state=active]:bg-primary [&_button]:data-[state=active]:text-primary-foreground [&_button]:data-[state=inactive]:hover:bg-accent [&_button]:data-[state=inactive]:text-card-foreground">
               <TabsTrigger
                  value="YouTube"
                  class="text-xs sm:text-sm">
                  Youtube
               </TabsTrigger>

               <TabsTrigger
                  value="storage"
                  class="text-xs sm:text-sm">
                  Songs
               </TabsTrigger>
            </TabsList>

            <TabsContent
               value="YouTube"
               class="flex-1 min-h-0 overflow-scroll no-scrollbar">
               <YouTubePlayer />
            </TabsContent>

            <TabsContent
               value="storage"
               class="flex-1 min-h-0 overflow-scroll no-scrollbar">
               <MP3Player />
            </TabsContent>
         </Tabs>
      </DraggableWidget>

      <DraggableWidget
         v-show="store.widgets.focus?.visible"
         id="focus"
         title="Focus task"
         description="Focus task">
         <FocusTasksList />
      </DraggableWidget>

      <TimerDisplay />

      <PlayerToolbar />
   </div>
</template>
