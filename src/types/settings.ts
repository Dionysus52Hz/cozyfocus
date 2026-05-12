import type { ThemeId } from "@/types/theme";

export interface AppSettings {
   theme: ThemeId;
   focusDuration: number;
   shortBreakDuration: number;
   longBreakDuration: number;
   sessionsUntilLongBreak: number;
   countUp: 0 | 1;
   autoStartBreaks: 0 | 1;
   autoStartFocus: 0 | 1;
   autoCheckTask: 0 | 1;
   autoSwitchToNextTask: 0 | 1;
   showTimerProgress: 0 | 1;
   pauseTimerWhenSwitchingTask: 0 | 1;
   backgroundId: string;
   autoHideUIDelay: number;
   // timerSound: boolean
}

export type MediaType = "image" | "video" | null;

export interface PresetBackground {
   id: string;
   name: string;
   url: string;
   type: "preset";
   mediaType: MediaType;
}

export type Background = PresetBackground;
