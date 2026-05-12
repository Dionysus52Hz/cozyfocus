<script setup lang="ts">
   import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
   import { Progress } from "@/components/ui/progress";

   import type { TimerMode } from "@/types/timer";
   import { computed } from "vue";

   import TimerControls from "@/components/timer/TimerControls.vue";
   import { useAppSettings } from "@/composables/useAppSettings";
   import { useFocusTasks } from "@/composables/useFocusTasks";
   import { useTimer } from "@/composables/useTimer";

   const { progress, setMode, formattedTime, mode } = useTimer();
   const { settings, isLoaded } = useAppSettings();
   const { activeTask } = useFocusTasks();

   const displayProgress = computed(() => {
      return settings.value.countUp === 0
         ? progress.value
         : 100 - progress.value;
   });
   const formatMinutes = (minutes: number) => {
      return `${minutes.toString().padStart(2, "0")}:00`;
   };
   const formattedTotalTime = computed(() => {
      if (!settings.value) return "00:00";

      switch (mode.value) {
         case "shortBreak":
            return formatMinutes(settings.value.shortBreakDuration);
         case "longBreak":
            return formatMinutes(settings.value.longBreakDuration);
         default:
            return formatMinutes(settings.value.focusDuration);
      }
   });
</script>

<template>
   <div
      class="timer-display w-full flex flex-col items-center justify-center sm:w-sm">
      <Tabs
         :model-value="mode"
         @update:model-value="(value) => setMode(value as TimerMode)"
         class="w-full">
         <TabsList
            class="w-full bg-card text-card-foreground h-11 rounded-full gap-x-1 border-2 [&_button]:rounded-full [&_button]:bg-transparent [&_button]:border-transparent [&_button]:data-[state=inactive]:hover:bg-accent [&_button]:data-[state=active]:border-border [&_button]:data-[state=active]:bg-primary [&_button]:data-[state=active]:text-primary-foreground [&_button]:data-[state=inactive]:text-card-foreground">
            <TabsTrigger
               value="focus"
               class="cursor-pointer text-xs sm:text-sm px-1 sm:px-2">
               Pomodoro
            </TabsTrigger>
            <TabsTrigger
               value="shortBreak"
               class="cursor-pointer text-xs sm:text-sm px-1 sm:px-2">
               Short Break
            </TabsTrigger>
            <TabsTrigger
               value="longBreak"
               class="cursor-pointer text-xs sm:text-sm px-1 sm:px-2">
               Long Break
            </TabsTrigger>
         </TabsList>
      </Tabs>

      <div
         class="@container flex flex-col items-center justify-center w-full max-w-sm gap-y-4 my-4">
         <div
            v-if="isLoaded && settings.showTimerProgress === 1"
            class="timer-progress flex flex-col items-center justify-center w-full max-w-sm gap-y-1">
            <div class="flex justify-between items-center w-full">
               <span class="text-[#f8f8f8] text-sm">{{ formattedTime }}</span>
               <span class="text-[#f8f8f8] text-sm">{{
                  formattedTotalTime
               }}</span>
            </div>
            <Progress
               :model-value="displayProgress"
               class="h-2.5 bg-primary border-2" />
         </div>
         <p
            class="font-semibold text-[#f8f8f8] text-shadow-[2px_4px_0_var(--primary)] transition-all duration-500 leading-none text-9xl">
            {{ formattedTime }}
         </p>

         <div
            class="flex justify-center items-center gap-x-2 bg-card border-2 border-border rounded-full px-3 py-1.5">
            <div
               v-if="activeTask"
               class="flex justify-center items-center gap-2">
               <span
                  v-for="pomodoro in activeTask?.estimatedPomodoros"
                  class="inline-block w-2 h-2 rounded-full ring-2 ring-border"
                  :class="
                     pomodoro <= activeTask?.pomodoros
                        ? 'bg-primary'
                        : 'bg-accent'
                  "></span>
            </div>

            <p class="text-card-foreground text-xs sm:text-sm">
               {{ activeTask?.title || "No task in focus right now." }}
            </p>
         </div>
      </div>

      <TimerControls />
   </div>
</template>
