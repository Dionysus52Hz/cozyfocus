<script setup lang="ts">
   import { Button } from "@/components/ui/button";
   import { Slider } from "@/components/ui/slider";
   import { Toggle } from "@/components/ui/toggle";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Badge } from "@/components/ui/badge";
   import {
      VolumeMute02Icon,
      AudioWave01Icon,
      VolumeHighIcon,
      VolumeLowIcon,
      PreviousIcon,
      RepeatIcon,
      PauseIcon,
      PlayIcon,
      NextIcon,
   } from "@hugeicons/core-free-icons";
   import {
      Popover,
      PopoverContent,
      PopoverTrigger,
   } from "@/components/ui/popover";

   import { formatTime } from "@/utils/format";
   import { computed, ref } from "vue";

   import { useMusicPlayer } from "@/composables/useMusicPlayer";
   import { useIdle } from "@/composables/useIdle";
   import { Vue3Marquee } from "vue3-marquee";

   const { isIdle } = useIdle();

   const {
      isTrackFromYouTube,
      isTrackFromStorage,
      seekStorageFn,
      seekYouTubeFn,
      playingState,
      currentTime,
      togglePlay,
      toggleMute,
      settings,
      duration,
   } = useMusicPlayer();

   const isSeeking = ref(false);
   const seekValue = ref(0);

   const nextTrack = () => {};
   const prevTrack = () => {};

   const handleVolumeChange = (values: number[] | undefined) => {
      const newValue = values?.[0] ?? 0;
      settings.value.volume = newValue;

      if (settings.value.isMuted && newValue > 0) {
         settings.value.isMuted = false;
      }

      if (newValue === 0) {
         settings.value.isMuted = true;
      }
   };

   const dynamicVolumeIcon = computed(() => {
      if (settings.value.isMuted || settings.value.volume === 0)
         return VolumeMute02Icon;

      if (settings.value.volume <= 50) return VolumeLowIcon;

      return VolumeHighIcon;
   });

   const handleSliding = (values: number[] | undefined) => {
      if (!values || values[0] === undefined) return;
      isSeeking.value = true;
      seekValue.value = values[0];
   };

   const handleSeek = (values: number[] | undefined) => {
      if (!values || values[0] === undefined) return;

      const target = values[0];
      if (!target) return;

      isSeeking.value = false;
      if (isTrackFromYouTube.value && seekYouTubeFn.value) {
         seekYouTubeFn.value(target);
      } else if (isTrackFromStorage.value && seekStorageFn.value) {
         seekStorageFn.value(target);
      }

      currentTime.value = target;
   };

   const displayTime = computed(() =>
      isSeeking.value ? seekValue.value : currentTime.value,
   );

   const handleTogglePlay = () => {
      if (isTrackFromYouTube.value) {
         togglePlay("YouTube");
      } else if (isTrackFromStorage.value) {
         togglePlay("storage");
      }
      return;
   };
</script>

<template>
   <div
      v-if="settings.currentTrack"
      class="fixed bottom-0 left-0 w-full h-bottom-toolbar border-t-2 bg-card px-4 flex items-center justify-center z-25 text-card-foreground transition-opacity duration-300"
      :class="{ 'opacity-0': isIdle }">
      <div
         class="relative w-full lg:w-4xl xl:w-5xl flex items-center justify-center gap-6">
         <div class="flex items-center gap-3 w-1/3">
            <div class="overflow-hidden flex flex-col gap-1 pr-4">
               <Vue3Marquee
                  v-if="settings.currentTrack?.title"
                  :duration="20"
                  class="text-xs sm:text-sm font-semibold">
                  {{ settings.currentTrack.title }}
                  <span class="px-6"></span>
               </Vue3Marquee>

               <Badge
                  variant="secondary"
                  class="text-secondary-foreground/80">
                  {{ isTrackFromYouTube ? "YouTube" : "MP3" }}
               </Badge>
            </div>
         </div>

         <div class="flex w-1/3 flex-col items-center gap-1">
            <div class="flex items-center gap-4">
               <Button
                  v-if="isTrackFromStorage"
                  variant="ghost"
                  size="icon-sm"
                  @click="prevTrack"
                  class="cursor-pointer border-2 border-transparent hover:bg-primary/80">
                  <HugeiconsIcon
                     :icon="PreviousIcon"
                     :strokeWidth="2" />
               </Button>

               <Button
                  size="icon-sm"
                  variant="ghost"
                  class="rounded-full border-2 hover:bg-primary/80 cursor-pointer"
                  @click="handleTogglePlay">
                  <HugeiconsIcon
                     v-if="playingState.YouTube || playingState.storage"
                     :icon="PauseIcon"
                     :strokeWidth="2"
                     fill="currentColor" />
                  <HugeiconsIcon
                     v-if="!playingState.YouTube && !playingState.storage"
                     :icon="PlayIcon"
                     :strokeWidth="2"
                     fill="currentColor" />
               </Button>

               <Button
                  v-if="isTrackFromStorage"
                  variant="ghost"
                  size="icon-sm"
                  class="cursor-pointer border-2 border-transparent hover:bg-primary/80"
                  @click="nextTrack">
                  <HugeiconsIcon
                     :icon="NextIcon"
                     :strokeWidth="2" />
               </Button>
            </div>

            <div
               class="flex items-center justify-between gap-1.5 w-full text-xs sm:text-sm text-primary-foreground font-semibold">
               <span class="w-7">{{ formatTime(currentTime) }}</span>
               <Slider
                  :hide-thumb="true"
                  :model-value="[displayTime]"
                  @update:model-value="handleSliding"
                  @value-commit="handleSeek"
                  :max="duration"
                  :step="1"
                  :track-height="2.5"
                  class="flex-1" />
               <span class="w-7 text-end">{{ formatTime(duration) }}</span>
            </div>
         </div>

         <div class="flex items-center gap-2 w-1/3 justify-end">
            <Toggle
               v-model="settings.inLoop"
               size="sm"
               class="cursor-pointer border-2 hover:bg-primary/80 data-[state=on]:bg-primary text-primary-foreground hover:text-primary-foreground data-[state=on]:hover:bg-primary/80">
               <HugeiconsIcon
                  :icon="RepeatIcon"
                  :strokeWidth="2" />
            </Toggle>

            <div class="flex items-center gap-2 w-2/3 max-w-50">
               <Button
                  @click="toggleMute"
                  size="icon-sm"
                  variant="ghost"
                  class="cursor-pointer border-2 hover:bg-primary/80">
                  <HugeiconsIcon
                     :icon="dynamicVolumeIcon"
                     :strokeWidth="2" />
               </Button>

               <Slider
                  :track-height="2"
                  :model-value="[settings.volume]"
                  @update:model-value="handleVolumeChange"
                  :max="100"
                  :step="1" />

               <Popover>
                  <PopoverTrigger as-child>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        class="cursor-pointer border-2 hover:bg-primary/80 data-[state=open]:bg-primary data-[state=open]:hover:bg-primary/80">
                        <HugeiconsIcon
                           :icon="AudioWave01Icon"
                           :strokeWidth="2" />
                     </Button>
                  </PopoverTrigger>

                  <PopoverContent
                     align="end"
                     :side-offset="20"
                     class="border-2 flex flex-col gap-4 p-0 h-72">
                     <div
                        class="flex items-center justify-between text-primary-foreground text-sm p-4 pb-0">
                        <h1 class="text-xs sm:text-sm font-semibold">
                           Ambient sounds
                        </h1>
                     </div>

                     <div
                        class="p-4 pt-0 flex flex-col justify-start flex-1 overflow-hidden">
                        <div
                           class="w-full h-full overflow-y-scroll no-scrollbar flex flex-col gap-4 px-1">
                           <div
                              v-for="i in 10"
                              class="flex flex-col gap-2.5">
                              <span
                                 class="text-xs sm:text-sm text-primary-foreground"
                                 >Rain</span
                              >
                              <Slider
                                 :track-height="2"
                                 :hide-bubble="true" />
                           </div>
                        </div>
                     </div>
                  </PopoverContent>
               </Popover>
            </div>
         </div>
      </div>
   </div>
</template>
