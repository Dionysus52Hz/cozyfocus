import { useAppSettings } from "@/composables/useAppSettings";
import { PRESET_BACKGROUNDS } from "@/constants";
import type { Background } from "@/types";
import { computed, ref } from "vue";

const isLoaded = ref(false);
const hasBackground = ref(false);

export function useBackground() {
   const { settings, updateSetting } = useAppSettings();

   const allBackgrounds = [...PRESET_BACKGROUNDS];

   const imageBackgrounds = computed(() => {
      return PRESET_BACKGROUNDS.filter(
         (background) => background.mediaType === "image",
      );
   });

   const videoBackgrounds = computed(() => {
      return PRESET_BACKGROUNDS.filter(
         (background) => background.mediaType === "video",
      );
   });

   const activeBackground = computed<Background | undefined>(() =>
      allBackgrounds.find(
         (background) => background.id === settings.value.backgroundId,
      ),
   );

   const activeBackgroundUrl = computed<string>(() => {
      if (!activeBackground.value) return "";

      if (activeBackground.value.type === "preset")
         return activeBackground.value.url;

      return "";
   });

   const setBackground = async (id: string) => {
      await updateSetting("backgroundId", id);
      if (id === "none") {
         hasBackground.value = false;
      } else {
         hasBackground.value = true;
      }
   };

   const deleteBackground = async (id: string) => {
      if (settings.value.backgroundId === id) {
         await setBackground("none");
      }
   };

   return {
      allBackgrounds,
      imageBackgrounds,
      videoBackgrounds,
      activeBackground,
      activeBackgroundUrl,
      isLoaded,
      hasBackground,
      setBackground,
      deleteBackground,
   };
}
