export type WidgetName = "music" | "plan" | "focus";

export interface WidgetState {
   i: WidgetName;
   x: number;
   y: number;
   width: number;
   height: number;
   visible: boolean;
   zIndex: number;
}

export interface LayoutState {
   initialized: boolean;
   widgets: Record<WidgetName, WidgetState>;
}
