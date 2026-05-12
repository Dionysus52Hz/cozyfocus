<script setup lang="ts">
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      TabsTrigger,
      TabsContent,
      TabsList,
      Tabs,
   } from "@/components/ui/tabs";
   import {
      PopoverContent,
      PopoverTrigger,
      Popover,
   } from "@/components/ui/popover";
   import {
      DashboardSquareEditIcon,
      Notification01Icon,
      Maximize01Icon,
      Minimize01Icon,
      PaintBoardIcon,
      Settings01Icon,
      StopWatchIcon,
      Album02Icon,
      Note01Icon,
   } from "@hugeicons/core-free-icons";
   import {
      TooltipProvider,
      TooltipContent,
      TooltipTrigger,
      Tooltip,
   } from "@/components/ui/tooltip";

   import NotificationSettings from "@/components/settings/NotificationSettings.vue";
   import AppearanceSettings from "@/components/settings/AppearanceSettings.vue";
   import BackgroundGallery from "@/components/settings/BackgroundGallery.vue";
   import TimerSettings from "@/components/settings/TimerSettings.vue";
   import TaskSettings from "@/components/settings/TaskSettings.vue";
   import ThemePicker from "@/components/settings/ThemePicker.vue";

   import { onMounted, onUnmounted } from "vue";
   import { useWindowSize } from "@vueuse/core";

   import { useFullscreen } from "@/composables/useFullscreen";
   import { useLayoutStore } from "@/stores/useLayoutStore";

   const { isFullscreen, toggle, initListener, destroyListener } =
      useFullscreen();
   const { resetLayout } = useLayoutStore();
   const { width, height } = useWindowSize();

   onMounted(initListener);
   onUnmounted(destroyListener);

   const scrollIntoCenter = (event: MouseEvent) => {
      const element = event.currentTarget as HTMLElement;

      element.scrollIntoView({
         behavior: "smooth",
         block: "nearest",
         inline: "center",
      });
   };
</script>

<template>
   <div
      class="setting-triggers flex flex-col items-center [&_button]:text-card-foreground [&_button]:rounded-full [&_button]:border-2 [&_button]:border-transparent [&_button]:hover:bg-primary/50 [&_button]:data-[state=closed]:hover:border-transparent rounded-full border-2 bg-card gap-1 py-1">
      <TooltipProvider>
         <Tooltip>
            <Popover>
               <TooltipTrigger as-child>
                  <PopoverTrigger as-child>
                     <Button
                        size="icon-sm"
                        variant="ghost"
                        class="cursor-pointer data-[state=open]:bg-primary data-[state=open]:border-border data-[state=open]:rotate-30">
                        <HugeiconsIcon
                           :icon="Settings01Icon"
                           :strokeWidth="2" />
                     </Button>
                  </PopoverTrigger>
               </TooltipTrigger>

               <TooltipContent side="left">Settings</TooltipContent>

               <PopoverContent
                  @interact-outside="(e) => e.preventDefault()"
                  side="left"
                  align="start"
                  :align-offset="-8"
                  :side-offset="16"
                  class="h-[calc(100dvh-104px)] w-[calc(100vw-80px)] sm:w-sm md:w-md flex flex-col overflow-hidden border-2">
                  <Tabs
                     default-value="timer"
                     class="flex flex-col flex-1 min-h-0 overflow-hidden pr-1"
                     :unmount-on-hide="false">
                     <TabsList
                        class="relative shrink-0 [&_button]:cursor-pointer h-11 w-full bg-transparent gap-x-2 border-2 rounded-full [&_button]:data-[state=active]:bg-primary [&_button]:rounded-full [&_button]:data-[state=active]:border-border [&_button]:data-[state=inactive]:hover:bg-accent [&_button]:data-[state=active]:text-primary-foreground [&_button]:data-[state=inactive]:text-card-foreground overflow-hidden">
                        <div class="w-full h-full overflow-x-auto no-scrollbar">
                           <div
                              class="justify-start sm:justify-center h-full min-w-full inline-flex items-center gap-x-1">
                              <TabsTrigger
                                 value="timer"
                                 @click="scrollIntoCenter">
                                 <HugeiconsIcon
                                    :icon="StopWatchIcon"
                                    :strokeWidth="2" />
                                 Timer
                              </TabsTrigger>

                              <TabsTrigger
                                 value="task"
                                 @click="scrollIntoCenter">
                                 <HugeiconsIcon
                                    :icon="Note01Icon"
                                    :strokeWidth="2" />
                                 Task
                              </TabsTrigger>

                              <TabsTrigger
                                 value="appearance"
                                 @click="scrollIntoCenter">
                                 <HugeiconsIcon
                                    :icon="PaintBoardIcon"
                                    :strokeWidth="2" />
                                 Appearance
                              </TabsTrigger>

                              <TabsTrigger
                                 value="notifications"
                                 @click="scrollIntoCenter">
                                 <HugeiconsIcon
                                    :icon="Notification01Icon"
                                    :strokeWidth="2" />
                                 Notifications
                              </TabsTrigger>
                           </div>
                        </div>
                     </TabsList>

                     <TabsContent
                        value="timer"
                        class="flex flex-col flex-1 overflow-hidden">
                        <TimerSettings />
                     </TabsContent>

                     <TabsContent
                        value="task"
                        class="flex flex-col flex-1 overflow-hidden">
                        <TaskSettings />
                     </TabsContent>

                     <TabsContent
                        value="appearance"
                        class="flex flex-col flex-1 overflow-hidden"
                        ><AppearanceSettings
                     /></TabsContent>

                     <TabsContent value="notifications"
                        ><NotificationSettings
                     /></TabsContent>
                  </Tabs>
               </PopoverContent>
            </Popover>
         </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
         <Tooltip>
            <Popover>
               <TooltipTrigger as-child>
                  <PopoverTrigger as-child>
                     <Button
                        size="icon-sm"
                        variant="ghost"
                        class="cursor-pointer data-[state=open]:bg-primary data-[state=open]:border-border border-2 border-transparent ring-0 outline-none">
                        <HugeiconsIcon
                           :icon="Album02Icon"
                           :strokeWidth="2" />
                     </Button>
                  </PopoverTrigger>
               </TooltipTrigger>

               <TooltipContent side="left">Change background</TooltipContent>

               <PopoverContent
                  side="left"
                  align="start"
                  :align-offset="-52"
                  :side-offset="20"
                  class="h-[calc(100dvh-104px)] w-[calc(100vw-80px)] sm:w-sm md:w-md flex flex-col overflow-hidden border-2">
                  <BackgroundGallery />
               </PopoverContent>
            </Popover>
         </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
         <Tooltip>
            <Popover>
               <TooltipTrigger as-child>
                  <PopoverTrigger as-child>
                     <Button
                        size="icon-sm"
                        variant="ghost"
                        class="cursor-pointer data-[state=open]:bg-primary data-[state=open]:border-border border-2 border-transparent ring-0 outline-none">
                        <HugeiconsIcon
                           :icon="PaintBoardIcon"
                           :strokeWidth="2" />
                     </Button>
                  </PopoverTrigger>
               </TooltipTrigger>

               <TooltipContent side="left">Change color theme</TooltipContent>

               <PopoverContent
                  side="left"
                  align="start"
                  :align-offset="-52"
                  :side-offset="20"
                  class="h-[calc(100dvh-104px)] w-[calc(100vw-80px)] sm:w-sm md:w-md flex flex-col overflow-hidden border-2">
                  <ThemePicker />
               </PopoverContent>
            </Popover>
         </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger as-child>
               <Button
                  @click="() => resetLayout(width, height)"
                  class="cursor-pointer"
                  variant="ghost"
                  size="icon-sm">
                  <HugeiconsIcon
                     :icon="DashboardSquareEditIcon"
                     :strokeWidth="2" />
               </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset widgets layout</TooltipContent>
         </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger as-child>
               <Button
                  @click="toggle"
                  class="cursor-pointer"
                  :class="{ 'bg-primary': isFullscreen }"
                  variant="ghost"
                  size="icon-sm">
                  <HugeiconsIcon
                     v-if="!isFullscreen"
                     :icon="Maximize01Icon"
                     :strokeWidth="2" />
                  <HugeiconsIcon
                     v-else
                     :icon="Minimize01Icon"
                     :strokeWidth="2" />
               </Button>
            </TooltipTrigger>

            <TooltipContent side="left">{{
               isFullscreen ? "Exit fullscreen" : "Fullscreen"
            }}</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   </div>
</template>
