<script setup lang="ts">
   import type { SliderRootEmits, SliderRootProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import { reactiveOmit } from "@vueuse/core";
   import {
      SliderRange,
      SliderRoot,
      SliderThumb,
      SliderTrack,
      useForwardPropsEmits,
   } from "reka-ui";
   import { cn } from "@/lib/utils";

   const props = defineProps<
      SliderRootProps & {
         class?: HTMLAttributes["class"];
         hideThumb?: boolean;
         trackHeight?: number;
         hideBubble?: boolean;
      }
   >();
   const emits = defineEmits<SliderRootEmits>();

   const delegatedProps = reactiveOmit(
      props,
      "class",
      "hideThumb",
      "trackHeight",
      "hideBubble",
   );

   const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
   <SliderRoot
      v-slot="{ modelValue }"
      data-slot="slider"
      :class="
         cn(
            'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
            props.class,
         )
      "
      v-bind="forwarded">
      <SliderTrack
         data-slot="slider-track"
         class="cursor-pointer bg-transparent border-2 relative grow overflow-hidden rounded-full"
         :style="{
            height:
               props.orientation === 'vertical'
                  ? '100%'
                  : `${(props.trackHeight || 1.5) * 4}px`,
            width:
               props.orientation === 'horizontal'
                  ? '100%'
                  : `${(props.trackHeight || 1.5) * 4}px`,
         }">
         <SliderRange
            data-slot="slider-range"
            class="bg-primary border-r-2 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderTrack>

      <SliderThumb
         v-for="(_, key) in modelValue"
         :key="key"
         data-slot="slider-thumb"
         class="cursor-pointer group bg-card block size-4 shrink-0 rounded-full border-2 transition-[color,box-shadow] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
         :class="{ 'opacity-0': props.hideThumb }">
         <span
            class="absolute -top-9 left-1/2 -translate-x-1/2 size-7 flex items-center justify-center bg-primary text-xs leading-none text-primary-foreground rounded-sm border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm z-50"
            :class="{ 'opacity-0!': props.hideBubble }">
            {{ Math.round(modelValue?.[key] ?? 0) }}
         </span>
      </SliderThumb>
   </SliderRoot>
</template>
