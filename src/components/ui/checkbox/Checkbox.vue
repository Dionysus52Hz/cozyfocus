<script setup lang="ts">
   import type { CheckboxRootEmits, CheckboxRootProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import { reactiveOmit } from "@vueuse/core";

   import {
      CheckboxIndicator,
      CheckboxRoot,
      useForwardPropsEmits,
   } from "reka-ui";
   import { cn } from "@/lib/utils";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Tick01Icon } from "@hugeicons/core-free-icons";

   const props = defineProps<
      CheckboxRootProps & { class?: HTMLAttributes["class"] }
   >();
   const emits = defineEmits<CheckboxRootEmits>();

   const delegatedProps = reactiveOmit(props, "class");

   const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
   <CheckboxRoot
      v-slot="slotProps"
      data-slot="checkbox"
      v-bind="forwarded"
      :class="
         cn(
            'peer aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border-2 outline-none disabled:cursor-not-allowed disabled:opacity-50',
            props.class,
         )
      ">
      <CheckboxIndicator
         data-slot="checkbox-indicator"
         class="grid place-content-center text-current transition-none">
         <slot v-bind="slotProps">
            <HugeiconsIcon
               :icon="Tick01Icon"
               :size="14"
               :strokeWidth="2.5" />
         </slot>
      </CheckboxIndicator>
   </CheckboxRoot>
</template>
