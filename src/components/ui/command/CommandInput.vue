<script setup lang="ts">
   import type { ListboxFilterProps } from "reka-ui";
   import type { HTMLAttributes } from "vue";
   import { reactiveOmit } from "@vueuse/core";
   import { ListboxFilter, useForwardProps } from "reka-ui";
   import { cn } from "@/lib/utils";
   import { useCommand } from ".";

   defineOptions({
      inheritAttrs: false,
   });

   const props = defineProps<
      ListboxFilterProps & {
         class?: HTMLAttributes["class"];
      }
   >();

   const delegatedProps = reactiveOmit(props, "class");

   const forwardedProps = useForwardProps(delegatedProps);

   const { filterState } = useCommand();
</script>

<template>
   <div data-slot="command-input-wrapper">
      <ListboxFilter
         v-bind="{ ...forwardedProps, ...$attrs }"
         v-model="filterState.search"
         data-slot="command-input"
         auto-focus
         :class="
            cn(
               'placeholder:text-muted-foreground flex  w-full bg-transparent px-3 py-1 outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
               props.class,
            )
         " />
   </div>
</template>
