<script setup lang="ts">
   import { ArrowRightDoubleIcon } from "@hugeicons/core-free-icons";
   import type { PaginationLastProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import type { ButtonVariants } from "@/components/ui/button";
   import { reactiveOmit } from "@vueuse/core";
   import { PaginationLast, useForwardProps } from "reka-ui";
   import { cn } from "@/lib/utils";
   import { buttonVariants } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";

   const props = withDefaults(
      defineProps<
         PaginationLastProps & {
            size?: ButtonVariants["size"];
            class?: HTMLAttributes["class"];
            text?: string;
         }
      >(),
      {
         size: "default",
      },
   );

   const delegatedProps = reactiveOmit(props, "class", "size", "text");
   const forwarded = useForwardProps(delegatedProps);
</script>

<template>
   <PaginationLast
      data-slot="pagination-last"
      :class="
         cn(
            buttonVariants({ variant: 'ghost', size }),
            'gap-1 justify-center',
            props.class,
         )
      "
      v-bind="forwarded">
      <slot>
         <!-- <span class="hidden sm:block">{{ text }}</span> -->
         <HugeiconsIcon :icon="ArrowRightDoubleIcon" />
      </slot>
   </PaginationLast>
</template>
