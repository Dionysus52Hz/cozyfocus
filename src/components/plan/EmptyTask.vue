<script setup lang="ts">
   import { Add01Icon } from "@hugeicons/core-free-icons";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      Empty,
      EmptyContent,
      EmptyDescription,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
   } from "@/components/ui/empty";

   const props = defineProps<{
      title: string;
      description: string;
      action: () => void;
   }>();
</script>

<template>
   <Empty class="tasks-empty p-0! gap-2">
      <EmptyHeader>
         <EmptyMedia
            variant="icon"
            class="m-0 bg-accent text-accent-foreground">
            <slot name="icon"> </slot>
         </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle class="text-sm">{{ title }}</EmptyTitle>
      <EmptyDescription> {{ description }}</EmptyDescription>
      <EmptyContent>
         <Button
            class="cursor-pointer border-2 bg-transparent text-xs text-card-foreground"
            size="sm"
            @click="action">
            <HugeiconsIcon :icon="Add01Icon" />
            Add task
         </Button>
      </EmptyContent>
   </Empty>
</template>
