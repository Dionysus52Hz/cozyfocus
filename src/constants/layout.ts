import type { LayoutState, WidgetName } from "@/types";

export const DEFAULT_LAYOUT_GAP = 8;
export const DEFAULT_WIDGET_INDEX = 10;
export const WIDGET_MIN_SIZE: Record<
   WidgetName,
   {
      width: number;
      height: number;
   }
> = {
   music: {
      width: 260,
      height: 340,
   },
   plan: {
      width: 490,
      height: 310,
   },
   focus: {
      width: 260,
      height: 340,
   },
};
export const DEFAULT_WIDGETS_COORDINATE: Record<
   WidgetName,
   {
      x: number;
      y: number;
   }
> = {
   music: {
      x: 72,
      y: 16,
   },
   plan: {
      x: 72 + WIDGET_MIN_SIZE.music.width + DEFAULT_LAYOUT_GAP,
      y: 16,
   },
   focus: {
      x: 72,
      y: 16 + WIDGET_MIN_SIZE.music.height + DEFAULT_LAYOUT_GAP,
   },
};

export const DEFAULT_WIDGETS_STATE: LayoutState["widgets"] = {
   music: {
      i: "music",
      x: DEFAULT_WIDGETS_COORDINATE.music.x,
      y: DEFAULT_WIDGETS_COORDINATE.music.y,
      visible: false,
      zIndex: DEFAULT_WIDGET_INDEX,
      width: WIDGET_MIN_SIZE.music.width,
      height: WIDGET_MIN_SIZE.music.height,
   },
   plan: {
      i: "plan",
      x: DEFAULT_WIDGETS_COORDINATE.plan.x,
      y: DEFAULT_WIDGETS_COORDINATE.plan.y,
      visible: false,
      zIndex: DEFAULT_WIDGET_INDEX,
      width: WIDGET_MIN_SIZE.plan.width,
      height: WIDGET_MIN_SIZE.plan.height,
   },
   focus: {
      i: "focus",
      x: DEFAULT_WIDGETS_COORDINATE.focus.x,
      y: DEFAULT_WIDGETS_COORDINATE.focus.y,
      visible: false,
      zIndex: DEFAULT_WIDGET_INDEX,
      width: WIDGET_MIN_SIZE.focus.width,
      height: WIDGET_MIN_SIZE.focus.height,
   },
};
