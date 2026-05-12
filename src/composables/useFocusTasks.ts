import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { focusTaskService } from "@/services/focusTaskService";
import { useAppSettings } from "@/composables/useAppSettings";
import { FOCUS_TASK_CONFIG, QUERY_KEYS } from "@/constants";
import type {
   FocusTask,
   ActionResponse,
   CreateFocusTaskInput,
   UpdateFocusTaskInput,
} from "@/types";
import { handleAction } from "@/utils/action";
import { emitter } from "@/utils/eventBus";
import { ref } from "vue";

const currentPage = ref<number>(FOCUS_TASK_CONFIG.DEFAULT_PAGE_NUMBER);
const pageSize = FOCUS_TASK_CONFIG.DEFAULT_TASKS_PER_PAGE;

export function useFocusTasks() {
   const queryClient = useQueryClient();
   const { settings } = useAppSettings();

   const { data: tasks, isLoading: isFetchingTasks } = useQuery({
      queryKey: [QUERY_KEYS.FOCUS_TASKS, currentPage],
      queryFn: () =>
         focusTaskService.fetchPagedTasks(currentPage.value, pageSize),
      placeholderData: (previous) => previous,
   });

   const { data: totalTasks } = useQuery({
      queryKey: [QUERY_KEYS.FOCUS_TASKS_COUNT],
      queryFn: () => focusTaskService.getTotalCount(),
   });

   const { data: activeTask } = useQuery({
      queryKey: [QUERY_KEYS.FOCUS_ACTIVE_TASK],
      queryFn: async () => {
         const result = await focusTaskService.getActiveTask();
         return result ?? null;
      },
   });

   // ========== HELPERS ==========
   function setTasks(updater: (old: FocusTask[]) => FocusTask[]) {
      queryClient.setQueryData<FocusTask[]>([QUERY_KEYS.FOCUS_TASKS], (old) =>
         updater(old ?? []),
      );
   }

   // ------------ CREATE TASK -----------
   const { mutateAsync: createMutateAsync } = useMutation({
      mutationFn: focusTaskService.create,
      onMutate: async (input) => {
         await queryClient.cancelQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });
         await queryClient.cancelQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS_COUNT],
         });
         const previousTasks = queryClient.getQueryData<FocusTask[]>([
            QUERY_KEYS.FOCUS_TASKS,
         ]);
         const previousTasksCount = queryClient.getQueryData<FocusTask[]>([
            QUERY_KEYS.FOCUS_TASKS_COUNT,
         ]);

         const optimistic: FocusTask = {
            id: `optimistic-${Date.now()}`,
            title: input.title,
            isCompleted: 0,
            isActive: 0,
            pomodoros: 0,
            estimatedPomodoros: input.estimatedPomodoros,
            createdAt: Date.now(),
            updatedAt: Date.now(),
         };

         setTasks((old) => [...old, optimistic]);

         return { previousTasks, previousTasksCount };
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS_COUNT],
         });
      },
      onError: (_, __, context) => {
         if (context?.previousTasks)
            queryClient.setQueryData(
               [QUERY_KEYS.FOCUS_TASKS],
               context.previousTasks,
            );
         if (context?.previousTasksCount)
            queryClient.setQueryData(
               [QUERY_KEYS.FOCUS_TASKS_COUNT],
               context.previousTasksCount,
            );
      },
   });

   const createTask = async (input: CreateFocusTaskInput) =>
      handleAction(createMutateAsync(input));

   // ------------ TOGGLE TASK -----------
   const { mutateAsync: toggleTaskMutateAsync } = useMutation({
      mutationFn: focusTaskService.toggleTask,
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });

         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_ACTIVE_TASK],
         });
      },
      onError: (error) => {
         console.error("Toggle task mutation error:", error);
      },
   });

   const toggleTask = async (
      id: string,
   ): Promise<ActionResponse<FocusTask & { nextTask?: FocusTask }>> => {
      return await handleAction(
         toggleTaskMutateAsync(id).then(async (updatedTask) => {
            if (
               updatedTask.isCompleted === 1 &&
               updatedTask.isActive === 1 &&
               settings.value.autoSwitchToNextTask === 1
            ) {
               const nextTask = await focusTaskService.findNextIncompleteTask(
                  updatedTask.id,
               );

               return { ...updatedTask, nextTask: nextTask ?? undefined };
            }

            return { ...updatedTask, nextTask: undefined };
         }),
      );
   };

   // ------------ SET ACTIVE TASK -----------
   const { mutateAsync: setActiveTaskMutateAsync } = useMutation({
      mutationFn: focusTaskService.setActiveTask,
      onSuccess: (data) => {
         emitter.emit("taskFocused", data);
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_ACTIVE_TASK],
         });
      },
      onError: (error) => {
         console.error("Set active task mutation error:", error);
      },
   });

   const setActiveTask = async (
      id: string,
   ): Promise<ActionResponse<FocusTask>> => {
      return await handleAction(setActiveTaskMutateAsync(id));
   };

   // ========== UPDATE TASK ==========
   const { mutateAsync: updateMutateAsync } = useMutation({
      mutationFn: ({
         id,
         input,
      }: {
         id: string;
         input: UpdateFocusTaskInput;
      }) => focusTaskService.update(id, input),
      onMutate: async ({ id, input }) => {
         await queryClient.cancelQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });
         const previous = queryClient.getQueryData<FocusTask[]>([
            QUERY_KEYS.FOCUS_TASKS,
         ]);

         setTasks((old) =>
            old.map((task) =>
               task.id === id
                  ? {
                       ...task,
                       ...input,
                       updatedAt: Date.now(),
                    }
                  : task,
            ),
         );
         return { previous };
      },
      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.FOCUS_TASKS], ctx.previous);
      },
      onSettled: () =>
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOCUS_TASKS] }),
   });

   const updateTask = async (id: string, input: UpdateFocusTaskInput) =>
      handleAction(updateMutateAsync({ id, input }));

   // --------------- DELETE TASK --------------
   const { mutateAsync: deleteTaskMutateAsync } = useMutation({
      mutationFn: focusTaskService.deleteTask,
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS_COUNT],
         });
         const newTotal =
            queryClient.getQueryData<number>([QUERY_KEYS.FOCUS_TASKS_COUNT]) ??
            0;
         const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));

         if (currentPage.value > maxPage) {
            currentPage.value = maxPage;
         } else {
            await queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.FOCUS_TASKS],
            });
         }

         await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_ACTIVE_TASK],
         });
      },
      onError: (error: any) => {
         console.error("Delete task mutation error: ", error);
      },
   });

   const deleteTask = async (
      id: string,
   ): Promise<ActionResponse<FocusTask>> => {
      return await handleAction(deleteTaskMutateAsync(id));
   };

   // ------------ INCREASE TASK POMODORO -----------
   const { mutateAsync: increasePomodoroAsync } = useMutation({
      mutationFn: focusTaskService.increasePomodoro,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_TASKS],
         });
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.FOCUS_ACTIVE_TASK],
         });
      },
      onError: (error) => {
         console.error("Increase pomodoro mutation error:", error);
      },
   });

   const increasePomodoro = async (
      id: string,
   ): Promise<ActionResponse<FocusTask>> => {
      return await handleAction(increasePomodoroAsync(id));
   };

   return {
      tasks,
      activeTask,
      totalTasks,
      isFetchingTasks,
      currentPage,
      pageSize,
      createTask,
      updateTask,
      toggleTask,
      setActiveTask,
      deleteTask,
      increasePomodoro,
   };
}
