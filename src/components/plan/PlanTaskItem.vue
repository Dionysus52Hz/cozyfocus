<script setup lang="ts">
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { Badge } from "@/components/ui/badge";
   import { toast } from "vue-sonner";
   import {
      ItemDescription,
      ItemActions,
      ItemContent,
      ItemMedia,
      ItemTitle,
      Item,
   } from "@/components/ui/item";
   import {
      DropdownMenuContent,
      DropdownMenuTrigger,
      DropdownMenuItem,
      DropdownMenu,
   } from "@/components/ui/dropdown-menu";
   import {
      MoreVerticalSquare01Icon,
      FavouriteIcon,
      Delete03Icon,
      Edit03Icon,
      Menu09Icon,
   } from "@hugeicons/core-free-icons";

   import { usePlanTaskDialog } from "@/composables/usePlanTaskDialog";
   import { usePlanTasks } from "@/composables/usePlanTasks";

   import type { PlanTask, PlanTaskPriority } from "@/types";
   import { useAlertDialog } from "@/composables/useAlertDialog";
   import { h } from "vue";

   const priorityColorMap: Record<PlanTaskPriority, string> = {
      low: "#95d387",
      medium: "#ffb561",
      high: "#f56c77",
   };

   const props = defineProps<{
      task: PlanTask;
   }>();

   const { openUpdate } = usePlanTaskDialog();
   const { deleteTask } = usePlanTasks();
   const { confirm } = useAlertDialog();

   const handleDeleteTask = async () => {
      const isConfirmed = await confirm({
         title: "Delete this task?",
         description: `Task '${props.task.title}' will be deleted permanently.`,
         confirmLabel: "Delete",
         cancelLabel: "Cancel",
         buttonVariant: "destructive",
         icon: () =>
            h(HugeiconsIcon, {
               icon: Delete03Icon,
               size: 20,
            }),
      });

      if (!isConfirmed) return;

      const result = await deleteTask(props.task.id);
      if (result.success) {
         toast.success(`Task '${result.data.title}' deleted 🗑️`);
      } else {
         toast.error(result.error);
      }
   };
</script>

<template>
   <Item
      size="sm"
      class="relative group cursor-pointer bg-accent hover:bg-primary/30 rounded-sm p-2 items-center gap-2 text-accent-foreground flex-nowrap"
      @click="openUpdate(task)">
      <ItemMedia
         class="drag-handle cursor-grab active:cursor-grabbing self-center!">
         <HugeiconsIcon
            :icon="Menu09Icon"
            :size="16" />
      </ItemMedia>

      <ItemContent class="select-none">
         <ItemTitle class="text-sm">
            {{ task.title }}
         </ItemTitle>
         <ItemDescription class="text-xs">{{ task.note }}</ItemDescription>

         <div
            v-if="task.tags"
            class="flex items-center gap-1 flex-wrap">
            <Badge
               v-for="tag in task.tags"
               variant="outline"
               class="text-xs text-card-foreground/80 bg-card"
               >#{{ tag.name }}</Badge
            >
         </div>

         <Badge
            variant="outline"
            class="uppercase font-semibold rounded-sm border-2 bg-card"
            :style="{
               color: priorityColorMap[task.priority],
               borderColor: priorityColorMap[task.priority],
            }">
            <HugeiconsIcon
               :icon="FavouriteIcon"
               :strokeWidth="2"
               fill="currentColor" />
            {{ task.priority }}</Badge
         >
      </ItemContent>

      <ItemActions class="drag-handle cursor-grab active:cursor-grabbing">
         <DropdownMenu>
            <DropdownMenuTrigger
               @click="(event: any) => event.stopPropagation()">
               <Button
                  size="icon-sm"
                  variant="ghost"
                  class="cursor-pointer size-7 border-2 border-transparent hover:border-border hover:bg-transparent">
                  <HugeiconsIcon :icon="MoreVerticalSquare01Icon" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem
                  @click="openUpdate(task)"
                  class="cursor-pointer text-card-foreground">
                  <HugeiconsIcon :icon="Edit03Icon" />
                  Edit task</DropdownMenuItem
               >
               <DropdownMenuItem
                  @click="
                     async () => {
                        await handleDeleteTask();
                     }
                  "
                  class="cursor-pointer text-destructive focus:bg-destructive">
                  <HugeiconsIcon :icon="Delete03Icon" />
                  Delete task</DropdownMenuItem
               >
            </DropdownMenuContent>
         </DropdownMenu>
      </ItemActions>
   </Item>
</template>
