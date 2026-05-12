<script setup lang="ts">
   import type { SwitchRootEmits, SwitchRootProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import { reactiveOmit } from "@vueuse/core";
   import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
   import { cn } from "@/lib/utils";

   const props = defineProps<
      SwitchRootProps & { class?: HTMLAttributes["class"] }
   >();

   const emits = defineEmits<SwitchRootEmits>();

   const delegatedProps = reactiveOmit(props, "class");

   const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
   <SwitchRoot
      v-slot="slotProps"
      data-slot="switch"
      v-bind="forwarded"
      :class="
         cn(
            'peer cursor-pointer data-[state=checked]:bg-secondary data-[state=unchecked]:bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-7 w-13 shrink-0 items-center rounded-full border-2 transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            props.class,
         )
      ">
      <SwitchThumb
         data-slot="switch-thumb"
         :class="
            cn(
               'bg-card data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-primary dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-2 transition-transform data-[state=checked]:translate-x-[calc(100%+12px)] data-[state=unchecked]:translate-x-1',
            )
         ">
         <slot
            name="thumb"
            v-bind="slotProps" />
      </SwitchThumb>
   </SwitchRoot>
</template>
