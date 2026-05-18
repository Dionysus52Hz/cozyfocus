import {
   DEFAULT_LAYOUT_GAP,
   DEFAULT_WIDGET_INDEX,
   DEFAULT_WIDGETS_COORDINATE,
   DEFAULT_WIDGETS_STATE,
} from "@/constants/layout";
import { useStorage, useMediaQuery } from "@vueuse/core";
import type { LayoutState, WidgetName } from "@/types";
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", () => {
   const isMobile = useMediaQuery("(max-width: 767px)");

   const state = useStorage(
      "czf-draggable-layout",

      {
         initialized: false,
         widgets: { ...DEFAULT_WIDGETS_STATE },
      },
   );

   const widgets = computed(() => state.value.widgets);

   const initDynamicLayout = (_: number, parentHeight: number) => {
      if (state.value.initialized || !state.value.widgets) return;

      if (isMobile.value) {
         state.value.widgets.music.x = DEFAULT_WIDGETS_COORDINATE.music.x;
         state.value.widgets.music.y = DEFAULT_WIDGETS_COORDINATE.music.y;
         state.value.widgets.plan.x = DEFAULT_WIDGETS_COORDINATE.music.x;
         state.value.widgets.plan.y =
            DEFAULT_WIDGETS_COORDINATE.music.y + DEFAULT_LAYOUT_GAP * 5;
         state.value.widgets.focus.x = DEFAULT_WIDGETS_COORDINATE.music.x;
         state.value.widgets.focus.y =
            DEFAULT_WIDGETS_COORDINATE.music.y + DEFAULT_LAYOUT_GAP * 10;
      } else {
         state.value.widgets.music.x = DEFAULT_WIDGETS_COORDINATE.music.x;
         state.value.widgets.music.y = DEFAULT_WIDGETS_COORDINATE.music.y;
         state.value.widgets.plan.x = DEFAULT_WIDGETS_COORDINATE.plan.x;
         state.value.widgets.plan.y = DEFAULT_WIDGETS_COORDINATE.plan.y;
         state.value.widgets.focus.x = DEFAULT_WIDGETS_COORDINATE.focus.x;
         state.value.widgets.focus.y = Math.min(
            DEFAULT_WIDGETS_COORDINATE.focus.y,
            parentHeight - 24,
         );
      }

      state.value.initialized = true;
   };

   const toggleWidget = (id: WidgetName) => {
      const widget = state.value.widgets[id];
      if (!widget) return;

      widget.visible = !widget.visible;

      if (widget.visible) {
         focusWidget(id);
      }
   };

   const focusWidget = (id: WidgetName) => {
      const targetWidget = widgets.value[id];
      if (!targetWidget) return;

      const otherWidgets = Object.entries(widgets.value)
         .filter(([widgetName]) => widgetName !== id)
         .map(([_, widgetState]) => widgetState)
         .sort((a, b) => a.zIndex - b.zIndex);

      otherWidgets.forEach((widget, index) => {
         widget.zIndex = DEFAULT_WIDGET_INDEX + index;
      });

      targetWidget.zIndex = DEFAULT_WIDGET_INDEX + otherWidgets.length;
   };

   const isManuallyResetting = ref(false);
   const resetTimer = ref<ReturnType<typeof setTimeout> | null>(null);

   const resetLayout = (parentWidth: number, parentHeight: number) => {
      const currentMetaState = Object.fromEntries(
         Object.entries(state.value.widgets).map(
            ([widgetName, widgetState]) => [
               widgetName,
               { visible: widgetState.visible, zIndex: widgetState.zIndex },
            ],
         ),
      ) as Record<WidgetName, { visible: boolean; zIndex: number }>;

      if (resetTimer.value) {
         clearTimeout(resetTimer.value);
      }

      isManuallyResetting.value = true;
      state.value.initialized = false;
      state.value.widgets = Object.fromEntries(
         Object.entries(DEFAULT_WIDGETS_STATE).map(
            ([widgetName, widgetState]) => [
               widgetName,
               {
                  ...widgetState,
                  visible: currentMetaState[widgetName as WidgetName].visible,
                  zIndex: currentMetaState[widgetName as WidgetName].zIndex,
               },
            ],
         ),
      ) as LayoutState["widgets"];

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
