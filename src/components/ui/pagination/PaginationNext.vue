<script setup lang="ts">
   import type { PaginationNextProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import type { ButtonVariants } from "@/components/ui/button";
   import { reactiveOmit } from "@vueuse/core";
   import { PaginationNext, useForwardProps } from "reka-ui";
   import { cn } from "@/lib/utils";
   import { buttonVariants } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

   const props = withDefaults(
      defineProps<
         PaginationNextProps & {
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
   <PaginationNext
      data-slot="pagination-next"
      :class="
         cn(
            buttonVariants({ variant: 'ghost', size }),
            'gap-1 px-2.5 sm:pr-2.5',
            props.class,
         )
      "
      v-bind="forwarded">
      <slot>
         <!-- <span class="hidden sm:block">{{ text }}</span> -->
         <HugeiconsIcon :icon="ArrowRight01Icon" />
      </slot>
   </PaginationNext>
</template>
