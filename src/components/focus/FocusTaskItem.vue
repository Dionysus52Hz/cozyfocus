<script setup lang="ts">
   import { Checkbox } from "@/components/ui/checkbox";
   import { Button } from "@/components/ui/button";
   import { HugeiconsIcon } from "@hugeicons/vue";
   import { toast } from "vue-sonner";
   import {
      DropdownMenuContent,
      DropdownMenuTrigger,
      DropdownMenuLabel,
      DropdownMenuItem,
      DropdownMenu,
   } from "@/components/ui/dropdown-menu";
   import {
      ItemDescription,
      ItemActions,
      ItemContent,
      ItemTitle,
      Item,
   } from "@/components/ui/item";
   import {
      MoreVerticalSquare01Icon,
      CenterFocusIcon,
      Delete03Icon,
      Edit03Icon,
   } from "@hugeicons/core-free-icons";

   import { useFocusTasks } from "@/composables/useFocusTasks";
   import { useFocusTaskDialog } from "@/composables/useFocusTaskDialog";
   import { useAlertDialog } from "@/composables/useAlertDialog";
   import type { FocusTask } from "@/types";
   import { h } from "vue";

   const props = defineProps<{
      task: FocusTask;
   }>();

   const { setActiveTask, activeTask, toggleTask, deleteTask } =
      useFocusTasks();
   const { openUpdate } = useFocusTaskDialog();
   const { confirm } = useAlertDialog();

   const handleSetActiveTask = async () => {
      if (activeTask.value?.id === props.task.id) return;
      if (props.task.isCompleted === 1) return;

      const result = await setActiveTask(props.task.id);

      if (result.success) {
         toast.success(`Now focusing on: '${result.data.title}'`);
      } else {
         toast.error(result.error);
      }
   };

   const handleToggleTask = async () => {
      const result = await toggleTask(props.task.id);

      if (!result.success) {
         toast.error(result.error);
         return;
      }

      const { nextTask, ...updatedTask } = result.data;
      if (nextTask) {
         return toast.promise(setActiveTask(nextTask.id), {
            success: `Task '${updatedTask.title}' done! Next focus: ${nextTask.title}`,
            error: `Task '${updatedTask.title}' done, but couldn't switch focus.`,
         });
      }

      if (updatedTask.isCompleted === 1) {
         toast.success(`Task '${updatedTask.title}' done! Nice work.`);
      } else {
         toast.info(`Task '${updatedTask.title}' marked as incompleted.`);
      }
   };

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
         toast.success(`Deleted task: ${result.data.title} 🗑️`);
      } else {
         toast.error(result.error);
      }
   };
</script>

<template>
   <Item
      class="relative overflow-hidden p-2"
      :class="
         task.isActive === 1
            ? 'bg-primary text-primary-foreground '
            : 'text-card-foreground hover:bg-accent'
      ">
      <ItemActions class="ml-1">
         <div
            @click.stop
            class="flex items-center cursor-pointer">
            <Checkbox
               class="size-5 border-2 cursor-pointer"
               :class="
                  task.isActive === 1
                     ? 'border-primary-foreground'
                     : 'border-border data-[state=checked]:bg-transparent data-[state=checked]:text-card-foreground'
               "
               :model-value="task.isCompleted === 1"
               @update:model-value="handleToggleTask" />
         </div>
      </ItemActions>

      <ItemContent>
         <ItemTitle
            class="font-semibold"
            :class="{
               'line-through': task.isCompleted === 1,
            }">
            {{ task.title }}
         </ItemTitle>
         <ItemDescription class="text-accent-foreground/60"
            >{{ task.pomodoros }} / {{ task.estimatedPomodoros }} pomodoros
         </ItemDescription>
      </ItemContent>

      <ItemActions>
         <DropdownMenu>
            <DropdownMenuTrigger as-child>
               <Button
                  variant="ghost"
                  class="cursor-pointer size-7 border-2 border-transparent hover:border-border hover:bg-transparent"
                  size="icon-sm">
                  <HugeiconsIcon :icon="MoreVerticalSquare01Icon" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               class="[&_svg]:mr-1 bg-card text-card-foreground shadow-none border-2">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>

               <DropdownMenuItem
                  :disabled="task.isActive === 1 || task.isCompleted === 1"
                  @click="handleSetActiveTask"
                  class="cursor-pointer text-card-foreground focus:bg-primary focus:text-primary-foreground">
                  <HugeiconsIcon :icon="CenterFocusIcon" />
                  Set as focus
               </DropdownMenuItem>

               <DropdownMenuItem
                  @click="openUpdate(props.task)"
                  class="cursor-pointer text-card-foreground focus:bg-primary focus:text-primary-foreground">
                  <HugeiconsIcon :icon="Edit03Icon" />
                  Edit task
               </DropdownMenuItem>

               <DropdownMenuItem
                  class="cursor-pointer text-destructive focus:bg-destructive"
                  @click="handleDeleteTask">
                  <HugeiconsIcon :icon="Delete03Icon" />
                  Delete task
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </ItemActions>
   </Item>
</template>
