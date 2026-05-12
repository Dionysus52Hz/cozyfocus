import type { FocusTask } from "@/types";
import mitt from "mitt";

type Events = {
   taskFocused: FocusTask;
};

export const emitter = mitt<Events>();
