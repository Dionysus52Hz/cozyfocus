<script setup lang="ts">
   import { Field, FieldLabel } from "@/components/ui/field";
   import { RepeatIcon } from "@hugeicons/core-free-icons";
   import { Toggle } from "@/components/ui/toggle";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Input } from "@/components/ui/input";
   import {
      NumberFieldIncrement,
      NumberFieldDecrement,
      NumberFieldContent,
      NumberFieldInput,
      NumberField,
   } from "@/components/ui/number-field";

   import { ref, onMounted, onUnmounted, watch } from "vue";

   import { useMusicPlayer } from "@/composables/useMusicPlayer";
   import { parseVideoId } from "@/utils/youtube";

   declare global {
      interface Window {
         onYouTubeIframeAPIReady: () => void;
         YT: any;
      }
   }

   interface VideoData {
      video_id: string;
      author: string;
      title: string;
   }

   interface ExtendedYTPlayer extends YT.Player {
      getVideoData(): VideoData;
   }

   let player: ExtendedYTPlayer | null = null;
   let timeUpdater: ReturnType<typeof setInterval> | null = null;
   let isPlayerReady = ref(false);
   const urlInput = ref("");

   const {
      settings,
      updateSettings,
      playingState,
      currentTime,
      duration,
      seekYouTubeFn,
      isTrackFromYouTube,
   } = useMusicPlayer();

   const loadYouTubeAPI = () => {
      if (!window.YT) {
         window.onYouTubeIframeAPIReady = () => {
            initPlayer();
         };

         const tag = document.createElement("script");
         tag.src = "https://www.youtube.com/iframe_api";
         const firstScriptTag = document.getElementsByTagName("script")[0];
         firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      } else if (window.YT && window.YT.Player) {
         initPlayer();
      }
   };

   const initPlayer = () => {
      if (player) return;

      player = new window.YT.Player("czf-yt-player", {
         height: "100%",
         width: "100%",
         playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
         },
         events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
         },
      }) as ExtendedYTPlayer;

      seekYouTubeFn.value = (seconds: number) => {
         if (isTrackFromYouTube.value) {
            return player?.seekTo(seconds, true);
         }
      };
   };

   const onPlayerReady = () => {
      isPlayerReady.value = true;
      player?.setVolume(settings.value.volume);
      settings.value.isMuted ? player?.mute() : player?.unMute();
      player?.setPlaybackRate(settings.value.playbackRate);
      if (settings.value.lastYouTubeTrack) {
         if (settings.value.activeSource === "YouTube") {
            player?.loadVideoById(settings.value.lastYouTubeTrack.url);
         } else {
            player?.cueVideoById(settings.value.lastYouTubeTrack.url);
         }
      }
   };

   const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
      const PlayerState = window.YT.PlayerState;

      if (event.data === PlayerState.PLAYING) {
         playingState.value.YouTube = true;
         playingState.value.storage = false;
         if (settings.value.lastYouTubeTrack) {
            updateSettings({ currentTrack: settings.value.lastYouTubeTrack });
         }
         startTimeTracking();

         const videoData = player?.getVideoData();
         if (videoData?.title && settings.value.currentTrack) {
            settings.value.currentTrack.title = videoData.title;
         }
      } else if (event.data === PlayerState.PAUSED) {
         playingState.value.YouTube = false;
      } else if (event.data === PlayerState.ENDED && settings.value.inLoop) {
         player?.seekTo(0, true);
         player?.playVideo();
      }
   };

   const startTimeTracking = () => {
      stopTimeTracking();
      timeUpdater = setInterval(() => {
         if (player && playingState.value.YouTube && isPlayerReady.value) {
            currentTime.value = player.getCurrentTime();
            duration.value = player.getDuration();
         }
      }, 500);
   };

   const stopTimeTracking = () => {
      if (timeUpdater) clearInterval(timeUpdater);
   };

   watch(urlInput, (url) => {
      const videoId = parseVideoId(url.trim());

      if (videoId && videoId !== settings.value.lastYouTubeTrack?.url) {
         settings.value.currentTrack = {
            id: videoId,
            title: "Loading...",
            source: "YouTube",
            url: videoId,
         };

         currentTime.value = 0;

         if (isPlayerReady.value && player) {
            player.loadVideoById(videoId);
         }
      }
   });

   watch(
      () => playingState.value.YouTube,
      (value) => {
         if (!player || !isPlayerReady.value) return;
         value ? player.playVideo() : player.pauseVideo();
      },
   );

   watch(
      [
         () => settings.value.volume,
         () => settings.value.isMuted,
         () => settings.value.playbackRate,
      ],
      ([volume, muted, rate]) => {
         if (!player || !isPlayerReady.value) return;

         player.setVolume(volume);
         muted ? player.mute() : player.unMute();
         player.setPlaybackRate(rate);
      },
   );

   onMounted(() => {
      if (settings.value.lastYouTubeTrack) {
         urlInput.value = `https://www.youtube.com/watch?v=${settings.value.lastYouTubeTrack.url}`;
      }
      loadYouTubeAPI();
   });

   onUnmounted(() => {
      stopTimeTracking();
      if (player) {
         player.destroy();
         player = null;
      }
      isPlayerReady.value = false;
      playingState.value.YouTube = false;
      seekYouTubeFn.value = undefined;
   });
</script>

<template>
   <div class="flex flex-col w-full h-full gap-2">
      <Field orientation="horizontal">
         <Input
            v-model="urlInput"
            type="text"
            placeholder="Paste youtube link"
            class="h-8 text-xs! text-primary-foreground selection:bg-secondary" />
      </Field>

      <div
         class="w-full flex-1 min-h-0 overflow-y-scroll no-scrollbar flex flex-col gap-2">
         <div
            class="relative w-full aspect-video overflow-hidden rounded-md border border-accent/5 my-1">
            <div
               id="czf-yt-player"
               class="w-full aspect-video rounded-md" />
         </div>
      </div>

      <div class="player-actions flex justify-between">
         <Toggle
            v-model="settings.inLoop"
            class="border-2 rounded-full shadow-none text-xs hover:bg-primary/80 hover:text-primary-foreground cursor-pointer h-9 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <HugeiconsIcon
               :icon="RepeatIcon"
               :strokeWidth="2" />
            Loop
         </Toggle>

         <Field
            class="w-3/5"
            orientation="horizontal">
            <FieldLabel
               for="speed"
               class="text-card-foreground text-xs">
               Speed
            </FieldLabel>
            <NumberField
               id="speed"
               :default-value="1"
               :step="0.05"
               :min="0.25"
               :max="2">
               <NumberFieldContent
                  class="text-card-foreground overflow-hidden rounded-full border-2 text-xs h-9 bg-input">
                  <NumberFieldDecrement
                     class="cursor-pointer border-r-2 hover:bg-secondary p-2" />
                  <NumberFieldInput
                     class="outline-none overflow-hidden h-8! selection:bg-secondary" />
                  <NumberFieldIncrement
                     class="cursor-pointer border-l-2 hover:bg-secondary p-2" />
               </NumberFieldContent>
            </NumberField>
         </Field>
      </div>
   </div>
</template>
