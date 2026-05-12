<script setup lang="ts">
   import { Skeleton } from "@/components/ui/skeleton";
   import { AudioLinesIcon } from "lucide-vue-next";
   import { Field } from "@/components/ui/field";
   import { Input } from "@/components/ui/input";

   import { onMounted, onUnmounted, ref, watch } from "vue";

   import { useMusicPlayer } from "@/composables/useMusicPlayer";
   import { useDebounceFn } from "@vueuse/core";

   const audioRef = ref<HTMLAudioElement>();
   const {
      settings,
      tracks,
      search,
      playingState,
      isTrackFromStorage,
      isLoading,
      currentTime,
      duration,
      seekStorageFn,
      updateSettings,
   } = useMusicPlayer();
   const localSearch = ref("");

   const updateSearch = useDebounceFn((value: string) => {
      search.value = value;
   }, 500);

   watch(localSearch, (newValue) => {
      updateSearch(newValue);
   });

   // const onScroll = (e: UIEvent) => {
   //    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
   //    if (scrollTop + clientHeight >= scrollHeight - 20) {
   //       if (hasNextPage && !isFetchingNextPage.value) {
   //          fetchNextPage();
   //       }
   //    }
   // };

   watch(
      () => playingState.value.storage,
      (value) => {
         if (value) {
            if (audioRef.value?.src) {
               audioRef.value.play().catch((error) => {
                  console.warn(error);
               });
            }
         } else {
            audioRef.value?.pause();
         }
      },
   );

   watch(
      [() => settings.value.volume, () => settings.value.isMuted],
      ([volume, muted]) => {
         if (audioRef.value) {
            if (muted) {
               audioRef.value.muted = true;
            } else {
               audioRef.value.volume = volume / 100;
               audioRef.value.muted = false;
            }
         }
      },
   );

   const selectTrack = (track: any) => {
      updateSettings({ currentTrack: track, lastStorageTrack: track });
      playingState.value.storage = true;
      playingState.value.YouTube = false;
   };

   const onLoadedMetadata = () => {
      if (audioRef.value) {
         duration.value = audioRef.value.duration;
         audioRef.value.volume = settings.value.volume / 100;
         if (currentTime.value > 0) {
            audioRef.value.currentTime = currentTime.value;
         }
      }
   };

   const onCanPlay = () => {
      if (playingState.value.storage) {
         audioRef.value?.play().catch((err) => {
            console.warn(err);
         });
      }
   };

   const onTimeUpdate = () => {
      if (audioRef.value && !audioRef.value.seeking) {
         currentTime.value = audioRef.value.currentTime;
      }
   };

   const onEnded = () => {
      if (!settings.value.inLoop) {
         playingState.value.storage = false;
      }
   };

   onMounted(() => {
      seekStorageFn.value = (seconds: number) => {
         if (audioRef.value && isTrackFromStorage.value) {
            audioRef.value.currentTime = seconds;
            currentTime.value = seconds;
         }
      };
   });

   onUnmounted(() => {
      seekStorageFn.value = undefined;
   });
</script>

<template>
   <audio
      ref="audioRef"
      :src="isTrackFromStorage ? settings.currentTrack?.url : ''"
      :loop="settings.inLoop"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay" />

   <Field class="mb-3">
      <Input
         v-model="localSearch"
         class="h-8 text-xs! text-secondary-foreground selection:bg-secondary"
         placeholder="Search by title or artist..." />
   </Field>

   <div class="w-full h-full">
      <div
         v-if="isLoading"
         class="space-y-2 sm:space-y-4">
         <Skeleton
            v-for="i in 2"
            :key="i"
            class="w-full h-12 bg-primary/30 rounded-sm" />
      </div>

      <div
         v-else
         class="grid gap-2">
         <span
            v-if="tracks.length === 0"
            class="text-center text-xs sm:text-sm"
            >No tracks found.</span
         >
         <div
            v-for="track in tracks"
            :key="track.id"
            @click="selectTrack(track)"
            class="flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-colors border-2 border-transparent"
            :class="
               settings.currentTrack?.id === track.id
                  ? 'bg-primary text-primary-foreground border-border!'
                  : 'text-card-foreground hover:bg-primary/30'
            ">
            <img
               v-if="track.cover"
               :src="track.cover"
               class="size-10 rounded-[12px] object-cover shadow" />
            <span
               v-else
               class="size-10 block rounded-[12px] bg-accent border-2"></span>
            <div class="flex flex-col min-w-0 flex-1 gap-y-1">
               <span class="text-sm truncate font-semibold">{{
                  track.title
               }}</span>
               <span class="text-xs">{{ track.artist }}</span>
            </div>

            <span
               class="opacity-0 transition-opacity duration-500"
               :class="{
                  'opacity-100': settings.currentTrack?.id === track.id,
               }">
               <AudioLinesIcon
                  class="size-4 animate-pulse text-primary-foreground" />
            </span>
         </div>
      </div>
   </div>
</template>
