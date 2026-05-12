import { ref } from "vue";

const isFullscreen = ref(false);
const showAppHeader = ref(false);
const showTimerControls = ref(false);

export function useFullscreen() {
   function enter() {
      document.documentElement.requestFullscreen?.();
   }

   function exit() {
      document.exitFullscreen?.();
   }

   function toggle() {
      if (isFullscreen.value) exit();
      else enter();
   }

   function onFullscreenChange() {
      isFullscreen.value = !!document.fullscreenElement;
      if (!isFullscreen.value) {
         showTimerControls.value = false;
         showAppHeader.value = false;
      }
   }

   function initListener() {
      document.addEventListener("fullscreenchange", onFullscreenChange);
   }

   function destroyListener() {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
   }

   return {
      isFullscreen,
      showTimerControls,
      showAppHeader,
      enter,
      exit,
      toggle,
      initListener,
      destroyListener,
   };
}
