import { useStorage, useMediaQuery } from "@vueuse/core";
import type { WidgetName } from "@/types";
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", () => {
   const isMobile = useMediaQuery("(max-width: 767px)");

   const state = useStorage(
      "czf-draggable-layout",

      {
         initialized: false,
         widgets: {
            music: {
               i: "music",
               x: 72,
               y: 16,
               visible: false,
               zIndex: 10,
            },
            plan: {
               i: "plan",
               x: 72,
               y: 16,
               visible: false,
               zIndex: 10,
            },
            focus: {
               i: "focus",
               x: 72,
               y: 16,
               visible: false,
               zIndex: 10,
            },
         },
      },
   );

   const widgets = computed(() => state.value.widgets);

   const initDynamicLayout = (_: number, parentHeight: number) => {
      if (state.value.initialized || !state.value.widgets) return;

      const gap = 16;
      if (isMobile.value) {
         state.value.widgets.music.x = 72;
         state.value.widgets.music.y = 16;
         state.value.widgets.plan.x = 72;
         state.value.widgets.plan.y = 0;
         state.value.widgets.focus.x = 72;
         state.value.widgets.focus.y = 16;
      } else {
         state.value.widgets.music.x = 72;
         state.value.widgets.music.y = 16;
         state.value.widgets.plan.x = 72;
         state.value.widgets.plan.y = Math.min(360, parentHeight / 2 + gap);
         state.value.widgets.focus.x = 72;
         state.value.widgets.focus.y = Math.min(360, parentHeight / 2 + gap);
      }

      state.value.initialized = true;
   };

   const toggleWidget = (id: string) => {
      const widget = state.value.widgets[id as WidgetName];
      if (!widget) return;

      widget.visible = !widget.visible;
      widget.zIndex = 10;
   };

   const focusWidget = (id: string) => {
      const targetWidget = widgets.value[id as WidgetName];
      if (!targetWidget) return;

      const otherWidgets = Object.entries(widgets.value)
         .filter(([key]) => key !== id)
         .map(([_, v]) => v)
         .sort((a, b) => a.zIndex - b.zIndex);

      otherWidgets.forEach((w, i) => {
         w.zIndex = 10 + i;
      });

      targetWidget.zIndex = 10 + otherWidgets.length;
   };

   const isManuallyResetting = ref(false);
   const resetTimer = ref<ReturnType<typeof setTimeout> | null>(null);
   const resetLayout = (parentWidth: number, parentHeight: number) => {
      const currentVisibleState = {
         music: state.value.widgets.music.visible,
         plan: state.value.widgets.plan.visible,
         focus: state.value.widgets.focus.visible,
      };

      if (resetTimer.value) {
         clearTimeout(resetTimer.value);
      }

      isManuallyResetting.value = true;
      state.value.initialized = false;
      state.value.widgets.music = {
         i: "music",
         x: 72,
         y: 16,
         visible: currentVisibleState.music,
         zIndex: 10,
      };
      state.value.widgets.plan = {
         i: "plan",
         x: 72,
         y: 16,
         visible: currentVisibleState.plan,
         zIndex: 10,
      };
      state.value.widgets.focus = {
         i: "focus",
         x: 72,
         y: 16,
         visible: currentVisibleState.focus,
         zIndex: 10,
      };
      initDynamicLayout(parentWidth, parentHeight);

      resetTimer.value = setTimeout(() => {
         isManuallyResetting.value = false;
         resetTimer.value = null;
      }, 300);
   };

   return {
      widgets,
      state,
      initDynamicLayout,
      toggleWidget,
      focusWidget,
      isMobile,
      isManuallyResetting,
      resetLayout,
   };
});
