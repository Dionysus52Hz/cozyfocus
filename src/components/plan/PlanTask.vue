<script setup lang="ts">
   import { Card, CardContent, CardTitle } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Badge } from "@/components/ui/badge";
   import {
      TickDouble04Icon,
      Loading01Icon,
      Note03Icon,
      Add01Icon,
   } from "@hugeicons/core-free-icons";

   import PlanTaskItem from "@/components/plan/PlanTaskItem.vue";
   import PlanTaskForm from "@/components/plan/PlanTaskForm.vue";
   import EmptyTask from "@/components/plan/EmptyTask.vue";

   import { usePlanTaskDialog } from "@/composables/usePlanTaskDialog";
   import { usePlanTasks } from "@/composables/usePlanTasks";

   import type { PlanTask, PlanTaskStatus } from "@/types";
   import { APPEARANCE_CONFIG } from "@/constants";

   import draggable from "vuedraggable";

   const { openCreate } = usePlanTaskDialog();
   const { tasksTodo, tasksInProgress, tasksDone, reorderTasks, moveTask } =
      usePlanTasks();

   const onDragChange = async (
      event: any,
      columnStatus: PlanTaskStatus,
      columnTasks: PlanTask[],
   ) => {
      if (event.moved) {
         await reorderTasks(columnTasks);
      }

      if (event.added) {
         await moveTask(event.added.element.id, columnStatus, columnTasks);
      }
   };
</script>

<template>
   <div
      class="grid grid-cols-3 w-full h-80 overflow-hidden rounded-sm transition-all duration-300 gap-x-1">
      <!-- TODO -->
      <Card
         class="todo min-h-0 h-full border-0 rounded-none py-2 gap-2 bg-transparent p-0 shadow-none">
         <div class="flex items-center justify-between text-xs sm:text-sm pr-2">
            <CardTitle class="flex items-center gap-x-2 text-card-foreground">
               <div class="flex gap-x-1 justify-center items-center h-8">
                  <HugeiconsIcon
                     :icon="Note03Icon"
                     :size="18" />
                  <span class="font-normal"> Todo </span>
                  <Badge class="rounded-full size-5 text-primary-foreground">{{
                     tasksTodo.length
                  }}</Badge>
               </div>
            </CardTitle>

            <Button
               @click="openCreate('todo')"
               class="cursor-pointer bg-transparent! border-2 border-transparent hover:border-border size-7 text-card-foreground"
               size="icon-sm">
               <HugeiconsIcon :icon="Add01Icon" />
            </Button>
         </div>

         <CardContent
            class="relative flex-1 min-h-60 overflow-y-auto no-scrollbar p-0">
            <EmptyTask
               v-if="!tasksTodo || tasksTodo.length === 0"
               class="absolute top-6 left-6 right-6"
               title="No tasks yet"
               description="Get started by creating your first task."
               :action="() => openCreate('todo')">
               <template #icon>
                  <HugeiconsIcon
                     :icon="Note03Icon"
                     :strokeWidth="APPEARANCE_CONFIG.DEFAULT_ICON_STROKE_WIDTH"
                     :size="16" />
               </template>
            </EmptyTask>

            <draggable
               class="text-primary-foreground flex flex-col min-h-20 gap-1"
               tag="ul"
               group="plan-task"
               handle=".drag-handle"
               :list="tasksTodo"
               :animation="300"
               :item-key="(item: PlanTask) => item.id"
               @change="(e: any) => onDragChange(e, 'todo', tasksTodo)">
               <template #item="{ element: task }">
                  <PlanTaskItem :task="task" />
               </template>
            </draggable>
         </CardContent>
      </Card>

      <!-- IN PROGRESS -->
      <Card
         class="doing min-h-0 h-full rounded-none border-none shadow-none gap-2 py-2 bg-transparent p-0">
         <div class="flex items-center justify-between text-xs sm:text-sm pr-2">
            <CardTitle class="flex items-center gap-x-2 text-card-foreground">
               <div class="flex gap-x-1 justify-center items-center h-8">
                  <HugeiconsIcon
                     :icon="Loading01Icon"
                     :size="18" />
                  <span class="font-normal">In progress</span>
                  <Badge class="rounded-full size-5 text-primary-foreground">{{
                     tasksInProgress.length
                  }}</Badge>
               </div>
            </CardTitle>

            <Button
               @click="openCreate('doing')"
               class="cursor-pointer bg-transparent! border-2 border-transparent hover:border-border size-7 text-ca"
               size="icon-sm">
               <HugeiconsIcon :icon="Add01Icon" />
            </Button>
         </div>

         <CardContent
            class="relative flex-1 min-h-60 overflow-y-auto no-scrollbar p-0">
            <EmptyTask
               v-if="!tasksInProgress || tasksInProgress.length === 0"
               class="absolute top-6 left-6 right-6"
               title="Nothing in progress"
               description="Drag a task here or create a new one to start
                  working."
               :action="() => openCreate('doing')">
               <template #icon>
                  <HugeiconsIcon
                     :icon="Loading01Icon"
                     :strokeWidth="
                        APPEARANCE_CONFIG.DEFAULT_ICON_STROKE_WIDTH
                     " />
               </template>
            </EmptyTask>

            <draggable
               class="text-primary-foreground flex flex-col min-h-20 gap-1"
               tag="ul"
               group="plan-task"
               handle=".drag-handle"
               :list="tasksInProgress"
               :animation="300"
               :item-key="(item: PlanTask) => item.id"
               @change="(e: any) => onDragChange(e, 'doing', tasksInProgress)">
               <template #item="{ element: task }">
                  <PlanTaskItem :task="task" />
               </template>
            </draggable>
         </CardContent>
      </Card>

      <!-- DONE -->
      <Card
         class="done min-h-0 h-full rounded-none border-0 gap-2 py-2 bg-transparent p-0 shadow-none">
         <div class="flex items-center justify-between text-xs sm:text-sm pr-2">
            <CardTitle class="flex items-center gap-x-2 text-card-foreground">
               <div class="flex items-center gap-x-1 justify-center h-8">
                  <HugeiconsIcon
                     :icon="TickDouble04Icon"
                     :size="18" />

                  <span class="font-normal"> Done </span>
                  <Badge class="rounded-full size-5 text-primary-foreground">{{
                     tasksDone.length
                  }}</Badge>
               </div>
            </CardTitle>

            <Button
               @click="openCreate('done')"
               class="cursor-pointer bg-transparent! border-2 border-transparent hover:border-border size-7 text-card-foreground"
               size="icon-sm">
               <HugeiconsIcon :icon="Add01Icon" />
            </Button>
         </div>

         <CardContent
            class="relative flex-1 min-h-60 overflow-y-auto no-scrollbar p-0">
            <EmptyTask
               v-if="!tasksDone || tasksDone.length === 0"
               class="absolute top-6 left-6 right-6"
               title="Nothing done yet"
               description="Complete a task and it will appear here."
               :action="() => openCreate('done')">
               <template #icon>
                  <HugeiconsIcon
                     :icon="TickDouble04Icon"
                     :strokeWidth="
                        APPEARANCE_CONFIG.DEFAULT_ICON_STROKE_WIDTH
                     " />
               </template>
            </EmptyTask>

            <draggable
               class="text-primary-foreground flex flex-col min-h-20 gap-1"
               tag="ul"
               group="plan-task"
               handle=".drag-handle"
               :list="tasksDone"
               :animation="300"
               :item-key="(item: PlanTask) => item.id"
               @change="(e: any) => onDragChange(e, 'done', tasksDone)">
               <template #item="{ element: task }">
                  <PlanTaskItem :task="task" />
               </template>
            </draggable>
         </CardContent>
      </Card>
   </div>

   <PlanTaskForm />
</template>
