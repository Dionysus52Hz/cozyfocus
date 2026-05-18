<script setup lang="ts">
   import { Add01Icon, StickyNote02Icon } from "@hugeicons/core-free-icons";
   import { Card, CardContent } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import {
      PaginationPrevious,
      PaginationContent,
      PaginationFirst,
      PaginationItem,
      PaginationLast,
      PaginationNext,
      Pagination,
   } from "@/components/ui/pagination";
   import {
      EmptyDescription,
      EmptyContent,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      Empty,
   } from "@/components/ui/empty";

   import FocusTaskForm from "@/components/focus/FocusTaskForm.vue";
   import FocusTaskItem from "@/components/focus/FocusTaskItem.vue";
   import { useFocusTasks } from "@/composables/useFocusTasks";

   import { ref } from "vue";
   import { useFocusTaskDialog } from "@/composables/useFocusTaskDialog";

   const isFormAddTaskOpen = ref(false);
   const { tasks, currentPage, pageSize, totalTasks } = useFocusTasks();
   const { openCreate } = useFocusTaskDialog();
</script>

<template>
   <Card class="w-full border-none shadow-none p-0 h-full gap-3">
      <div class="w-full flex items-center justify-center">
         <Button
            @click="openCreate()"
            size="sm"
            class="cursor-pointer border-2">
            <HugeiconsIcon :icon="Add01Icon" />
            Create task
         </Button>
      </div>

      <FocusTaskForm />

      <CardContent
         class="p-0 min-h-0 flex-1 overflow-y-scroll no-scrollbar flex flex-col">
         <Empty
            v-if="!tasks || tasks.length <= 0"
            class="tasks-empty p-2! gap-2">
            <EmptyHeader>
               <EmptyMedia variant="icon">
                  <HugeiconsIcon :icon="StickyNote02Icon" />
               </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>No Tasks Yet</EmptyTitle>
            <EmptyDescription
               >You haven't created any tasks yet. Get started by creating your
               first task.</EmptyDescription
            >
            <EmptyContent>
               <Button
                  class="cursor-pointer border-2 text-xs"
                  size="sm"
                  @click="isFormAddTaskOpen = true">
                  <HugeiconsIcon :icon="Add01Icon" />
                  Add task
               </Button>
            </EmptyContent>
         </Empty>
         <div
            v-else
            class="flex flex-col gap-2">
            <FocusTaskItem
               v-for="task in tasks"
               :key="task.id"
               :task="task" />
         </div>
      </CardContent>
      <Pagination
         v-if="tasks && tasks.length > 0"
         :items-per-page="pageSize"
         :total="totalTasks"
         :default-page="1"
         v-model:page="currentPage"
         :sibling-count="1"
         class="">
         <PaginationContent v-slot="{ items }">
            <PaginationFirst
               class="cursor-pointer border-2 border-transparent hover:border-border hover:bg-transparent"
               size="icon-sm" />

            <PaginationPrevious
               class="cursor-pointer border-2 border-transparent hover:border-border hover:bg-transparent"
               size="icon-sm" />

            <template
               v-for="(item, index) in items"
               :key="index">
               <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === currentPage"
                  size="icon-sm"
                  class="cursor-pointer border-2 border-transparent hover:border-border data-[selected=true]:bg-primary data-[selected=true]:border-border hover:bg-transparent">
                  {{ item.value }}
               </PaginationItem>
            </template>

            <PaginationNext
               size="icon-sm"
               class="cursor-pointer border-2 border-transparent hover:border-border hover:bg-transparent" />
            <PaginationLast
               size="icon-sm"
               class="cursor-pointer border-2 border-transparent hover:border-border hover:bg-transparent" />
         </PaginationContent>
      </Pagination>
   </Card>
</template>
