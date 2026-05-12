<script setup lang="ts">
   import { Image03Icon, VideoAiIcon } from "@hugeicons/core-free-icons";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      TabsContent,
      TabsTrigger,
      TabsList,
      Tabs,
   } from "@/components/ui/tabs";

   import { ref } from "vue";
   import { useDebounceFn } from "@vueuse/core";

   import { useBackground } from "@/composables/useBackground";

   const {
      imageBackgrounds,
      videoBackgrounds,
      activeBackground,
      setBackground,
   } = useBackground();

   const activeTab = ref(
      activeBackground.value?.mediaType === "video" ? "videos" : "images",
   );

   const debouncedSetBackground = useDebounceFn((id: string) => {
      setBackground(id);
   }, 300);

   const handleSelectBackground = (id: string) => {
      debouncedSetBackground(id);
   };
</script>

<template>
   <Tabs
      class="w-full h-full gap-3.5"
      v-model="activeTab"
      :unmount-on-hide="false">
      <TabsList
         class="w-full h-11 gap-x-1 bg-transparent border-2 [&_button]:cursor-pointer [&_button]:text-primary-foreground [&_button]:data-[state=inactive]:text-card-foreground [&_button]:data-[state=active]:bg-primary [&_button]:data-[state=active]:border-border [&_button]:data-[state=inactive]:hover:bg-primary/50 [&_button]:data-[state=active]:shadow-none">
         <TabsTrigger value="images">
            <HugeiconsIcon
               :icon="Image03Icon"
               :strokeWidth="2" />
            Images
         </TabsTrigger>
         <TabsTrigger value="videos">
            <HugeiconsIcon
               :icon="VideoAiIcon"
               :strokeWidth="2" />
            Videos
         </TabsTrigger>
      </TabsList>
      <TabsContent
         value="images"
         class="flex-1 min-h-0 overflow-y-scroll no-scrollbar">
         <div class="w-full grid grid-cols-2 gap-2 sm:gap-4">
            <div
               v-for="background in imageBackgrounds"
               :key="background.id"
               class="group p-1 sm:p-2 pb-2 relative border-2 border-transparent rounded-sm cursor-pointer transition-[background] flex flex-col gap-2"
               :class="
                  activeBackground?.id === background.id
                     ? 'bg-primary text-primary-foreground border-border!'
                     : 'text-card-foreground hover:text-secondary-foreground hover:bg-accent'
               "
               @click="handleSelectBackground(background.id)">
               <img
                  :src="background.url"
                  class="w-full aspect-4/3 rounded-[12px] object-cover border-2" />

               <span
                  class="inline-block w-full text-wrap text-center text-xs sm:text-sm"
                  >{{ background.name }}</span
               >
            </div>
         </div>
      </TabsContent>
      <TabsContent value="videos">
         <div class="w-full grid grid-cols-2 gap-2 sm:gap-4">
            <div
               v-for="background in videoBackgrounds"
               :key="background.id"
               class="group p-1 sm:p-2 pb-2 relative border-2 border-transparent rounded-sm cursor-pointer transition-[background] flex flex-col gap-2"
               :class="
                  activeBackground?.id === background.id
                     ? 'bg-primary text-primary-foreground border-border!'
                     : 'text-card-foreground hover:text-secondary-foreground hover:bg-accent'
               "
               @click="handleSelectBackground(background.id)">
               <video
                  :src="background.url"
                  class="w-full aspect-4/3 rounded-[12px] object-cover" />

               <span
                  class="inline-block w-full text-wrap text-center text-xs sm:text-sm"
                  >{{ background.name }}</span
               >
            </div>
         </div>
      </TabsContent>
   </Tabs>
</template>
