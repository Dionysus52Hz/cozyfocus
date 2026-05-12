import { useIdle as useIdleVueuse, useTimestamp } from "@vueuse/core";
import { useAppSettings } from "@/composables/useAppSettings";
import { computed } from "vue";

export const useIdle = () => {
   const { settings } = useAppSettings();
   const { lastActive } = useIdleVueuse(0);
   const timestamp = useTimestamp();

   const isIdle = computed(() => {
      const delay = settings.value.autoHideUIDelay;

      if (delay === 0) return false;

      return timestamp.value - lastActive.value >= delay;
   });

   return { isIdle };
};
