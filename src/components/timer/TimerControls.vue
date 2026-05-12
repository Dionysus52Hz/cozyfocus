<script setup lang="ts">
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      Refresh01Icon,
      PauseIcon,
      PlayIcon,
   } from "@hugeicons/core-free-icons";

   import { useTimer } from "@/composables/useTimer";

   const { isRunning, isPaused, start, pause, reset } = useTimer();
</script>

<template>
   <div
      class="flex items-center justify-center gap-x-4 [&_button]:uppercase [&_button]:font-normal [&_button]:cursor-pointer">
      <Button
         @click="isRunning ? pause() : start()"
         class="bg-primary text-primary-foreground rounded-full border-2">
         <HugeiconsIcon
            v-if="isRunning"
            :icon="PauseIcon"
            :stroke-width="2"
            fill="currentColor" />
         <HugeiconsIcon
            v-else
            :icon="PlayIcon"
            :stroke-width="2"
            fill="currentColor" />

         {{ isRunning ? "Pause" : isPaused ? "Resume" : "Start" }}
      </Button>

      <Button
         v-if="isRunning || isPaused"
         @click="reset"
         variant="destructive"
         class="rounded-full border-2 text-primary-foreground">
         <HugeiconsIcon
            :icon="Refresh01Icon"
            :strokeWidth="2" />
         Reset
      </Button>
   </div>
</template>
