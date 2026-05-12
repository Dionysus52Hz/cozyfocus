import FocusTasksList from "@/components/focus/FocusTasksList.vue";
import YouTubePlayer from "@/components/music/YouTubePlayer.vue";
import TimerDisplay from "@/components/timer/TimerDisplay.vue";
import PlanTask from "@/components/plan/PlanTask.vue";
import {
   CenterFocusIcon,
   MusicThreeIcon,
   Note01Icon,
} from "@hugeicons/core-free-icons";

export const getIcon = (id: string) =>
   ({ music: MusicThreeIcon, plan: Note01Icon, focus: CenterFocusIcon })[id];

export const getTooltipContent = (id: string) =>
   ({ music: "Music", plan: "Plan tasks", focus: "Focus tasks" })[id];

export const getComponent = (id: string) =>
   ({
      music: YouTubePlayer,
      plan: PlanTask,
      timer: TimerDisplay,
      "focus-task": FocusTasksList,
   })[id];
