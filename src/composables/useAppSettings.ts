import { TIMER_CONFIG, APPEARANCE_CONFIG } from "@/constants";
import { useColorMode, useDebounceFn } from "@vueuse/core";
import type { AppSettings, ThemeId } from "@/types";
import { dexie } from "@/database";
import { ref } from "vue";

const DEFAULT_SETTINGS: AppSettings = {
   theme: APPEARANCE_CONFIG.DEFAULT_THEME,
   focusDuration: TIMER_CONFIG.DEFAULT_FOCUS_DURATION,
   shortBreakDuration: TIMER_CONFIG.DEFAULT_SHORT_BREAK_DURATION,
   longBreakDuration: TIMER_CONFIG.DEFAULT_LONG_BREAK_DURATION,
   sessionsUntilLongBreak: TIMER_CONFIG.DEFAULT_SESSIONS_UNTIL_LONG_BREAK,
   countUp: TIMER_CONFIG.DEFAULT_COUNT_UP,
   autoStartBreaks: TIMER_CONFIG.DEFAULT_AUTO_START_BREAKS,
   autoStartFocus: TIMER_CONFIG.DEFAULT_AUTO_START_FOCUS,
   autoCheckTask: TIMER_CONFIG.DEFAULT_AUTO_CHECK_TASK,
   autoSwitchToNextTask: TIMER_CONFIG.DEFAULT_AUTO_SWITCH_TO_NEXT_TASK,
   showTimerProgress: TIMER_CONFIG.DEFAULT_SHOW_TIMER_PROGRESS,
   pauseTimerWhenSwitchingTask:
      TIMER_CONFIG.DEFAULT_PAUSE_TIMER_WHEN_SWITCHING_TASK,
   backgroundId: APPEARANCE_CONFIG.DEFAULT_BACKGROUND_ID,
   autoHideUIDelay: APPEARANCE_CONFIG.DEFAULT_AUTO_HIDE_UI_DELAY,
   // timerSound: true,
};

const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS });
const isLoaded = ref(false);

export function useAppSettings() {
   const theme = useColorMode({
      attribute: "data-theme",
      storageKey: "czf-theme",
      initialValue: "golden-summer-fields",
      modes: {
         "golden-summer": "golden-summer",
         "soft-peachy": "soft-peachy",
         "midnight-bloom": "midnight-bloom",
         "matcha-latte": "matcha-latte",
         "ocean-breeze": "ocean-breeze",
      } as any,
   });

   const appliers: Partial<{
      [K in keyof AppSettings]: (value: AppSettings[K]) => void;
   }> = {
      theme: (value: ThemeId) => {
         theme.value = value as any;
      },
      // accentColor: (value) => {
      //   document.documentElement.style.setProperty('--accent', value)
      // },
   };

   const debouncedBulkPut = useDebounceFn(
      async (items: { key: keyof AppSettings; value: any }[]) => {
         await dexie.settings.bulkPut(items);
      },
      500,
   );

   async function loadSettings() {
      try {
         const allStored = await dexie.settings.toArray();

         if (allStored.length === 0) {
            const toItems = (
               Object.entries(DEFAULT_SETTINGS) as [keyof AppSettings, any][]
            ).map(([key, value]) => ({ key, value }));
            await dexie.settings.bulkPut(toItems);
         } else {
            allStored.forEach((item) => {
               if (item.key in settings.value) {
                  const k = item.key as keyof AppSettings;
                  (settings.value[k] as any) = item.value;
               }
            });
         }

         apply();
      } catch (error) {
         console.error("Failed to load settings:", error);
      } finally {
         isLoaded.value = true;
      }
   }

   function apply<K extends keyof AppSettings>(key?: K) {
      if (key) {
         (appliers[key] as any)?.(settings.value[key]);
      } else {
         for (const applier in appliers) {
            const k = applier as keyof AppSettings;
            (appliers[k] as any)?.(settings.value[k]);
         }
      }
   }

   async function updateSetting<K extends keyof AppSettings>(
      key: K,
      value: AppSettings[K],
   ) {
      if (settings.value[key] === value) return;
      settings.value[key] = value;
      appliers[key]?.(value);

      if (key === "theme") {
         await dexie.settings.put({ key, value });
      } else {
         debouncedBulkPut([{ key, value }]);
      }
   }

   async function updateSettings(newSettings: Partial<AppSettings>) {
      const entries = Object.entries(newSettings) as [keyof AppSettings, any][];
      const toPut: { key: keyof AppSettings; value: any }[] = [];

      entries.forEach(([key, value]) => {
         if (settings.value[key] === value) return;
         (settings.value[key] as any) = value;
         (appliers[key] as any)?.(value);
         toPut.push({ key, value });
      });

      if (toPut.length > 0) {
         await dexie.settings.bulkPut(toPut);
      }
   }

   return {
      settings,
      isLoaded,
      loadSettings,
      updateSetting,
      updateSettings,
   };
}
