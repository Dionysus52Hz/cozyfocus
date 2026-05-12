<script setup lang="ts">
   import { Remove01Icon } from "@hugeicons/core-free-icons";
   import { Card, CardContent } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";

   import {
      ref,
      computed,
      watch,
      useTemplateRef,
      type HTMLAttributes,
   } from "vue";
   import { cn } from "@/lib/utils";
   import type { WidgetName } from "@/types";

   import { useLayoutStore } from "@/stores/useLayoutStore";
   import { useIdle } from "@/composables/useIdle";
   import { useDraggable } from "@vueuse/core";

   const { isIdle } = useIdle();

   const props = defineProps<{
      id: string;
      title: string;
      description: string;
      class?: HTMLAttributes["class"];
   }>();
   const store = useLayoutStore();
   const container = useTemplateRef("container");
   const handle = ref<HTMLElement | null>(null);
   const isDragging = ref(false);

   const widgetData = computed(
      () => store.state.widgets[props.id as WidgetName],
   );

   const { x, y, style } = useDraggable(container, {
      initialValue: {
         x: widgetData.value?.x ?? 0,
         y: widgetData.value?.y ?? 0,
      },
      handle: handle,

      onStart: () => {
         isDragging.value = true;
      },
      onMove: (pos) => {
         if (widgetData.value) {
            widgetData.value.x = pos.x;
            widgetData.value.y = pos.y;
         }
      },
      onEnd: () => {
         isDragging.value = false;
      },
   });

   watch(
      [() => widgetData.value?.x, () => widgetData.value?.y],
      ([newX, newY]) => {
         if (!isDragging.value) {
            if (newX !== undefined) x.value = newX;
            if (newY !== undefined) y.value = newY;
         }
      },
   );
</script>

<template>
   <div
      ref="container"
      :style="[style, { zIndex: widgetData?.zIndex ?? 10 }]"
      class="fixed touch-none will-change-transform"
      :class="{
         'opacity-0 pointer-events-none': isIdle,
         'opacity-100': !isIdle,
         'transition-all duration-300': store.isManuallyResetting,
      }">
      <Card
         :class="
            cn(
               'relative border-2 overflow-hidden min-w-50 py-3 max-h-100 min-h-50 gap-3',
               props.class,
            )
         "
         @mousedown="store.focusWidget(id)">
         <div class="absolute top-0 w-full flex justify-center pt-2">
            <span
               ref="handle"
               class="block w-22 h-2.5 rounded-full bg-primary hover:bg-primary/80 border-2 cursor-grab active:cursor-grabbing select-none"></span>
         </div>
         <div class="px-3 flex items-center justify-between">
            <h1
               class="text-xs sm:text-sm text-primary-foreground font-semibold">
               {{ title }}
            </h1>
            <div>
               <Button
                  variant="ghost"
                  size="icon-sm"
                  class="size-6 hover:ring-2 cursor-pointer hover:bg-transparent"
                  @click="store.toggleWidget(id)">
                  <HugeiconsIcon :icon="Remove01Icon" />
               </Button>
            </div>
         </div>

         <CardContent class="overflow-y-scroll min-h-0 no-scrollbar px-3">
            <slot />
         </CardContent>
      </Card>
   </div>
</template>
