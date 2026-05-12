export type TrackSource = "YouTube" | "storage";

export interface Track {
   id: string;
   title: string;
   artist?: string;
   source: TrackSource;
   url: string;
   cover?: string;
}

export interface MusicPlayerSettings {
   activeSource: TrackSource;
   volume: number;
   isMuted: boolean;
   inLoop: boolean;
   playbackRate: number;
   currentTrack: Track | null;
   lastStorageTrack: Track | null;
   lastYouTubeTrack: Track | null;
}
