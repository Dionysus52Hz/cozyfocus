<script setup lang="ts">
   import { useBackground } from "@/composables/useBackground";
   import { ref, watch } from "vue";

   const { activeBackground, activeBackgroundUrl } = useBackground();

   const currentBackgroundUrl = ref(activeBackgroundUrl.value);
   const isChanging = ref(false);

   watch(activeBackgroundUrl, (newUrl) => {
      if (!newUrl || newUrl === currentBackgroundUrl.value) return;

      isChanging.value = true;

      if (activeBackground.value?.mediaType === "image") {
         const image = new Image();
         image.src = newUrl;
         image.onload = () => {
            currentBackgroundUrl.value = newUrl;
            requestAnimationFrame(() => {
               isChanging.value = false;
            });
         };
      } else if (activeBackground.value?.mediaType === "video") {
      }
   });

   const handleVideoCanPlay = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      currentBackgroundUrl.value = video.src;
      requestAnimationFrame(() => {
         isChanging.value = false;
      });
   };
</script>

<template>
   <div
      v-if="activeBackground && activeBackground.id !== 'none'"
      class="fixed inset-0 -z-10 w-full h-full">
      <div
         v-if="isChanging"
         class="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
         <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>

      <Transition name="fade">
         <img
            v-if="activeBackground.mediaType === 'image'"
            :src="currentBackgroundUrl"
            class="w-full h-full object-cover brightness-90" />

         <video
            v-else-if="activeBackground.mediaType === 'video'"
            :src="currentBackgroundUrl"
            class="w-full h-full object-cover brightness-90"
            autoplay
            loop
            muted
            playsinline></video>
      </Transition>

      <video
         v-if="isChanging && activeBackground.mediaType === 'video'"
         :src="activeBackgroundUrl"
         @canplaythrough="handleVideoCanPlay"
         class="hidden"
         muted></video>
   </div>
</template>

<style scoped></style>
