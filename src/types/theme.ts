export type ThemeId =
   | "golden-summer-fields"
   | "pastel-bliss"
   | "soft-lavender"
   | "teal-coral"
   | "matcha-cream"
   | "rose-quartz"
   | "midnight-slate"
   | "carbon-rose"
   | "forest-dusk"
   | "berry-sage-peach";

export interface Theme {
   id: ThemeId;
   name: string;
   preview: {
      primary: string;
      secondary: string;
      input: string;
      card: string;
      accent: string;
   };
}
