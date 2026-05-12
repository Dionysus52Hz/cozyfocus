import type { TimerMode } from "@/types/timer";
import { ref } from "vue";

const activeTimerMode = ref<TimerMode>("focus");

export function useActiveTimerMode() {
   return { activeTimerMode };
}
