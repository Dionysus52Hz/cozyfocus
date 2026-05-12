import { useAppSettings } from "@/composables/useAppSettings";
import { useFocusTasks } from "@/composables/useFocusTasks";
import { computed, readonly, ref, watch } from "vue";
import type { TimerMode } from "@/types/timer";
import { TIMER_CONFIG } from "@/constants";
import { emitter } from "@/utils/eventBus";

const mode = ref<TimerMode>("focus");
const isRunning = ref(false);
const isPaused = ref(false);
const currentSession = ref(0);
const remainingSeconds = ref(0);

let intervalId: ReturnType<typeof setInterval> | null = null;
let endTime: number | null = null;
let isEmitListenerRegistered = false;

export function useTimer() {
   const { settings } = useAppSettings();
   const { activeTask, increasePomodoro, toggleTask } = useFocusTasks();

   const totalTime = computed(() => {
      const map: Record<TimerMode, number> = {
         focus: settings.value.focusDuration * 60,
         shortBreak: settings.value.shortBreakDuration * 60,
         longBreak: settings.value.longBreakDuration * 60,
      };
      return map[mode.value];
   });

   const elapsedSeconds = computed(
      () => totalTime.value - remainingSeconds.value,
   );

   const displaySeconds = computed(() =>
      settings.value.countUp ? elapsedSeconds.value : remainingSeconds.value,
   );

   const progress = computed(() =>
      totalTime.value > 0
         ? (remainingSeconds.value / totalTime.value) * 100
         : 0,
   );

   const formattedTime = computed(() => {
      const totalDisplay = displaySeconds.value;
      const m = Math.floor(totalDisplay / 60)
         .toString()
         .padStart(2, "0");
      const s = (totalDisplay % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
   });

   const modeLabel = computed(() => {
      const map: Record<TimerMode, string> = {
         focus: TIMER_CONFIG.DEFAULT_FOCUS_LABEL,
         shortBreak: TIMER_CONFIG.DEFAULT_SHORT_BREAK_LABEL,
         longBreak: TIMER_CONFIG.DEFAULT_LONG_BREAK_LABEL,
      };
      return map[mode.value];
   });

   watch(
      () => ({
         focus: settings.value.focusDuration,
         shortBreak: settings.value.shortBreakDuration,
         longBreak: settings.value.longBreakDuration,
      }),
      (newDurations, oldDurations) => {
         const currentMode = mode.value;

         if (newDurations[currentMode] !== oldDurations[currentMode]) {
            reset();
         }
      },
      { deep: true },
   );

   const getDuration = (mode: TimerMode): number => {
      const map: Record<TimerMode, number> = {
         focus: settings.value.focusDuration * 60,
         shortBreak: settings.value.shortBreakDuration * 60,
         longBreak: settings.value.longBreakDuration * 60,
      };
      return map[mode];
   };

   const clearTimer = () => {
      if (intervalId !== null) {
         clearInterval(intervalId);
         intervalId = null;
      }
   };

   const notify = (title: string, body: string) => {
      if ("Notification" in window && Notification.permission === "granted") {
         new Notification(title, { body, icon: "/favicon.ico" });
      }
   };

   const requestNotificationPermission = () => {
      if ("Notification" in window && Notification.permission === "default") {
         Notification.requestPermission();
      }
   };

   const onTaskFocused = () => {
      if (settings.value.pauseTimerWhenSwitchingTask) {
         pause();
      } else return;
   };

   const init = () => {
      remainingSeconds.value = getDuration(mode.value);

      if (!isEmitListenerRegistered) {
         emitter.on("taskFocused", onTaskFocused);
         isEmitListenerRegistered = true;
      }
   };

   const nextMode = () => {
      if (mode.value === "focus") {
         currentSession.value++;

         const isLongBreak =
            currentSession.value % settings.value.sessionsUntilLongBreak === 0;

         if (isLongBreak) {
            setMode("longBreak");
            notify(
               "Long Break! 🎉",
               `${currentSession.value} pomodoros done. Take a long rest!`,
            );
         } else {
            setMode("shortBreak");
            notify("Short Break! ☕", "Good work! Take a short break.");
         }

         if (settings.value.autoStartBreaks === 1) {
            setTimeout(() => start(), 100);
         }
      } else {
         setMode("focus");
         notify("Focus Time! 🍅", "Break is over. Time to focus!");

         if (settings.value.autoStartFocus === 1) {
            setTimeout(() => start(), 100);
         }
      }
   };

   const setMode = (newMode: TimerMode) => {
      clearTimer();
      isRunning.value = false;
      isPaused.value = false;
      mode.value = newMode;
      remainingSeconds.value = getDuration(newMode);
   };

   // const shouldPauseTimer = async () => {
   //    if (!activeTask.value) return false;

   //    const currentTask = await dexie.focusTasks.get(activeTask.value.id);
   //    if (!currentTask) return false;

   //    if (
   //       settings.value.autoCheckTask === 1 &&
   //       currentTask.pomodoros >= currentTask.estimatedPomodoros
   //    ) {
   //       await dexie.focusTasks.update(currentTask.id, { isCompleted: 1 });

   //       notify("Task Accomplished! 🎉", `"${currentTask.title}" is done.`);

   //       pause();
   //       return true;
   //    }

   //    return false;
   // };

   const start = () => {
      if (isRunning.value) return;
      requestNotificationPermission();
      isRunning.value = true;
      isPaused.value = false;

      endTime = Date.now() + remainingSeconds.value * 1000;

      intervalId = setInterval(async () => {
         const now = Date.now();
         const timeLeft = Math.round((endTime! - now) / 1000);

         if (timeLeft <= 0) {
            remainingSeconds.value = 0;
            clearTimer();
            isRunning.value = false;

            if (
               mode.value === "focus" &&
               activeTask.value &&
               activeTask.value.isCompleted === 0
            ) {
               const result = await increasePomodoro(activeTask.value.id);

               if (
                  result.success &&
                  settings.value.autoCheckTask === 1 &&
                  result.data?.pomodoros >= result.data?.estimatedPomodoros
               ) {
                  await toggleTask(result.data.id);
               }
            }
            nextMode();
            return;
         }
         remainingSeconds.value = timeLeft;
      }, 200);
   };

   const pause = () => {
      clearTimer();
      isRunning.value = false;
      isPaused.value = true;
   };

   const reset = () => {
      clearTimer();
      isRunning.value = false;
      isPaused.value = false;
      remainingSeconds.value = getDuration(mode.value);
   };

   const skip = () => {
      clearTimer();
      isRunning.value = false;
      nextMode();
   };

   return {
      mode: readonly(mode),
      isRunning: readonly(isRunning),
      isPaused: readonly(isPaused),
      remainingSeconds: readonly(remainingSeconds),
      currentSession: readonly(currentSession),
      progress,
      formattedTime,
      modeLabel,
      totalTime,
      init,
      start,
      pause,
      reset,
      skip,
      setMode,
      activeTask,
   };
}
