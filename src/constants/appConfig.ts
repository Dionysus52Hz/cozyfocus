import type { PresetBackground } from "@/types";

export const TIMER_CONFIG = {
   DEFAULT_FOCUS_DURATION: 25,
   DEFAULT_SHORT_BREAK_DURATION: 5,
   DEFAULT_LONG_BREAK_DURATION: 15,
   DEFAULT_SESSIONS_UNTIL_LONG_BREAK: 4,
   DEFAULT_COUNT_UP: 0,
   DEFAULT_AUTO_START_BREAKS: 1,
   DEFAULT_AUTO_START_FOCUS: 1,
   DEFAULT_AUTO_CHECK_TASK: 1,
   DEFAULT_AUTO_SWITCH_TO_NEXT_TASK: 1,
   DEFAULT_SHOW_TIMER_PROGRESS: 1,
   DEFAULT_PAUSE_TIMER_WHEN_SWITCHING_TASK: 1,
   DEFAULT_FOCUS_LABEL: "Focus",
   DEFAULT_SHORT_BREAK_LABEL: "Short break",
   DEFAULT_LONG_BREAK_LABEL: "Long break",
} as const;

export const APPEARANCE_CONFIG = {
   DEFAULT_ICON_STROKE_WIDTH: 1.5,
   DEFAULT_THEME: "golden-summer-fields",
   DEFAULT_BACKGROUND_ID: "none",
   DEFAULT_AUTO_HIDE_UI_DELAY: 5000,
} as const;

export const FOCUS_TASK_CONFIG = {
   DEFAULT_TASKS_PER_PAGE: 4,
   DEFAULT_PAGE_NUMBER: 1,
} as const;

export const PRESET_BACKGROUNDS: PresetBackground[] = [
   { id: "none", name: "None", url: "", type: "preset", mediaType: null },
   {
      id: "room-rainy-day",
      name: "Room Rainy Day",
      url: "/backgrounds/videos/room-rainy-day.mp4",
      type: "preset",
      mediaType: "video",
   },
   {
      id: "room-night",
      name: "Room Night",
      url: "/backgrounds/images/room-night.jpg",
      type: "preset",
      mediaType: "image",
   },
   {
      id: "room-night-2",
      name: "Room Night 2",
      url: "/backgrounds/images/room-night-2.jpg",
      type: "preset",
      mediaType: "image",
   },
];
