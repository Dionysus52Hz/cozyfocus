<script setup lang="ts">
   import { Remove01Icon, ResizeFieldIcon } from "@hugeicons/core-free-icons";
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
   import { DEFAULT_WIDGETS_STATE, WIDGET_MIN_SIZE } from "@/constants/layout";

   const { isIdle } = useIdle();

   const props = defineProps<{
      id: WidgetName;
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

   const w = computed({
      get: () =>
         widgetData.value?.width ?? DEFAULT_WIDGETS_STATE[props.id].width,
      set: (v) => {
         if (widgetData.value) widgetData.value.width = v;
      },
   });

   const h = computed({
      get: () =>
         widgetData.value?.height ?? DEFAULT_WIDGETS_STATE[props.id].height,
      set: (v) => {
         if (widgetData.value) widgetData.value.height = v;
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

   function startResize(
      e: MouseEvent,
      widget: WidgetName,
      direction: "horizontal" | "vertical" | "both",
   ) {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = w.value;
      const startH = h.value;

      function onMove(e: MouseEvent) {
         if (direction === "horizontal" || direction === "both") {
            w.value = Math.max(
               WIDGET_MIN_SIZE[widget].width,
               startW + (e.clientX - startX),
            );
         }

         if (direction === "vertical" || direction === "both") {
            h.value = Math.max(
               WIDGET_MIN_SIZE[widget].height,
               startH + (e.clientY - startY),
            );
         }
      }

      function onUp() {
         window.removeEventListener("mousemove", onMove);
         window.removeEventListener("mouseup", onUp);
         document.body.style.cursor = "";
      }

      if (direction === "horizontal") document.body.style.cursor = "e-resize";
      else if (direction === "vertical")
         document.body.style.cursor = "s-resize";
      else document.body.style.cursor = "se-resize";

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
   }
</script>

<template>
   <div
      ref="container"
      :style="[
         style,
         {
            zIndex: widgetData?.zIndex ?? 10,
            width: w + 'px',
            height: h + 'px',
         },
      ]"
      class="fixed touch-none will-change-transform"
      :class="{
         'opacity-0 pointer-events-none': isIdle,
         'opacity-100': !isIdle,
         'transition-all duration-300': store.isManuallyResetting,
      }">
      <Card
         :class="
            cn('relative border-2 py-3 pt-0 w-full h-full gap-2', props.class)
         "
         @mousedown="store.focusWidget(id)">
         <div class="w-full flex justify-center pt-2">
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

         <CardContent class="px-3 flex-1 overflow-hidden">
            <slot />
         </CardContent>

         <div
            class="absolute -right-1 w-2 h-10 inset-y-0 my-auto cursor-e-resize z-40 rounded-full bg-zinc-400 border-2 transition-colors"
            @mousedown.stop="startResize($event, id, 'horizontal')"></div>

         <div
            class="absolute -bottom-1 inset-x-0 mx-auto h-2 w-10 rounded-full cursor-s-resize z-40 bg-zinc-400 border-2 transition-colors"
            @mousedown.stop="startResize($event, id, 'vertical')"></div>

         <Button
            size="icon-sm"
            variant="ghost"
            class="size-6 absolute bottom-1 right-1 cursor-se-resize z-50 text-primary-foreground/60 hover:bg-transparent hover:text-primary-foreground"
            @mousedown.stop="startResize($event, id, 'both')">
            <HugeiconsIcon
               :icon="ResizeFieldIcon"
               :strokeWidth="2" />
         </Button>
      </Card>
   </div>
</template>
