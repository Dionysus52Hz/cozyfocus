import type { MusicPlayerSettings, Track, TrackSource } from "@/types";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { musicService } from "@/services/musicService";
import { getFriendlyError } from "@/utils/error";
import { ref, computed, watch } from "vue";
import { QUERY_KEYS } from "@/constants";
import { toast } from "vue-sonner";

const DEFAULT_SETTINGS: MusicPlayerSettings = {
   activeSource: "YouTube",
   volume: 50,
   isMuted: false,
   inLoop: true,
   currentTrack: null,
   lastYouTubeTrack: null,
   lastStorageTrack: null,
   playbackRate: 1,
};

const settings = useStorage<MusicPlayerSettings>(
   "czf-music-player-settings",
   DEFAULT_SETTINGS,
   undefined,
   {
      serializer: StorageSerializers.object,
   },
);

const playingState = ref<Record<TrackSource, boolean>>({
   YouTube: false,
   storage: false,
});
const currentTime = ref(0);
const duration = ref(0);
const seekYouTubeFn = ref<(seconds: number) => void>();
const seekStorageFn = ref<(seconds: number) => void>();

export function useMusicPlayer() {
   const switchActiveSource = (source: "YouTube" | "storage") => {
      settings.value.activeSource = source;
   };

   watch(
      () => settings.value.currentTrack,
      (track) => {
         if (!track) return;

         if (track.source === "YouTube") {
            settings.value.lastYouTubeTrack = track;
         } else if (track.source === "storage") {
            settings.value.lastStorageTrack = track;
         }
      },
      { deep: true },
   );

   const search = ref("");
   const {
      data,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
      isError,
      error,
   } = useInfiniteQuery({
      queryKey: [QUERY_KEYS.TRACKS, search],
      queryFn: musicService.fetchTracks,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   watch(isError, (value) => {
      if (value) toast.error(getFriendlyError(error.value));
   });

   const tracks = computed(
      () => (data.value?.pages.flatMap((page) => page.data) as Track[]) ?? [],
   );
   const isTrackFromYouTube = computed(
      () => settings.value.currentTrack?.source === "YouTube",
   );
   const isTrackFromStorage = computed(
      () => settings.value.currentTrack?.source === "storage",
   );

   const toggleMute = () => {
      settings.value.isMuted = !settings.value.isMuted;
   };
   const togglePlay = (source: TrackSource) => {
      const isPlaying = playingState.value[source];
      if (isPlaying) {
         playingState.value[source] = false;
      } else {
         (Object.keys(playingState.value) as TrackSource[]).forEach((s) => {
            playingState.value[s] = s === source;
         });
      }
   };

   const updateSettings = (newSettings: Partial<MusicPlayerSettings>) => {
      settings.value = { ...settings.value, ...newSettings };
   };

   return {
      settings,

      playingState,
      currentTime,
      duration,
      seekYouTubeFn,
      seekStorageFn,

      tracks,
      search,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      isTrackFromYouTube,
      isTrackFromStorage,

      switchActiveSource,
      togglePlay,
      toggleMute,
      refreshPlaylist: refetch,
      updateSettings,
   };
}
