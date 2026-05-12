import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { planTaskService } from "@/services/planTaskService";
import { handleAction } from "@/utils/action";
import { QUERY_KEYS } from "@/constants";
import { computed } from "vue";
import type {
   PlanTask,
   PlanTaskStatus,
   CreatePlanTaskInput,
   UpdatePlanTaskInput,
   PlanTaskTag,
} from "@/types";

export function usePlanTasks() {
   const queryClient = useQueryClient();

   // ========== QUERY ==========
   const { data: tasks, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.PLAN_TASKS],
      queryFn: planTaskService.getAll,
      initialData: [],
   });

   const {
      data: tags,
      isLoading: isLoadingTags,
      refetch: refetchTags,
   } = useQuery({
      queryKey: [QUERY_KEYS.PLAN_TASK_TAGS],
      queryFn: planTaskService.fetchTags,
      initialData: [],
      staleTime: 1000 * 60 * 5,
   });

   const tasksTodo = computed(
      () =>
         tasks.value
            ?.filter((t) => t.status === "todo")
            .sort((a, b) => a.order - b.order) ?? [],
   );

   const tasksInProgress = computed(
      () =>
         tasks.value
            ?.filter((t) => t.status === "doing")
            .sort((a, b) => a.order - b.order) ?? [],
   );

   const tasksDone = computed(
      () =>
         tasks.value
            ?.filter((t) => t.status === "done")
            .sort((a, b) => a.order - b.order) ?? [],
   );

   // ========== HELPERS ==========
   function setTasks(updater: (old: PlanTask[]) => PlanTask[]) {
      queryClient.setQueryData<PlanTask[]>([QUERY_KEYS.PLAN_TASKS], (old) =>
         updater(old ?? []),
      );
   }

   // ========== REMOVE TAG ===========
   const { mutateAsync: removeTagMutateAsync } = useMutation({
      mutationFn: planTaskService.removeTag,
      onMutate: async (id) => {
         await queryClient.cancelQueries({
            queryKey: [QUERY_KEYS.PLAN_TASK_TAGS],
         });
         const previous = queryClient.getQueryData<PlanTaskTag[]>([
            QUERY_KEYS.PLAN_TASK_TAGS,
         ]);

         queryClient.setQueryData<PlanTaskTag[]>(
            [QUERY_KEYS.PLAN_TASK_TAGS],
            (old = []) => old.filter((tag) => tag.id !== id),
         );

         return { previous };
      },
      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASK_TAGS], ctx.previous);
      },
      onSettled: () =>
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PLAN_TASK_TAGS],
         }),
   });

   const removeTag = async (id: string) =>
      handleAction(removeTagMutateAsync(id));

   // ------------- CREATE TASK ----------------
   const { mutateAsync: createMutateAsync } = useMutation({
      mutationFn: planTaskService.create,
      onMutate: async (input) => {
         await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         const previous = queryClient.getQueryData<PlanTask[]>([
            QUERY_KEYS.PLAN_TASKS,
         ]);

         const optimisticTags = (input.tags ?? []).map((name) => {
            const cached = queryClient
               .getQueryData<PlanTaskTag[]>([QUERY_KEYS.PLAN_TASK_TAGS])
               ?.find((t) => t.name.toLowerCase() === name.toLowerCase());

            return (
               cached ?? {
                  id: `optimistic-tag-${name}`,
                  name,
                  createdAt: Date.now(),
               }
            );
         });

         const optimistic: PlanTask = {
            id: `optimistic-${Date.now()}`,
            title: input.title,
            note: input.note,
            status: input.status ?? "todo",
            order: 9999,
            priority: input.priority ?? "medium",
            tags: optimisticTags,
            dueDate: input.dueDate,
            createdAt: Date.now(),
            updatedAt: Date.now(),
         };

         setTasks((old) => [...old, optimistic]);
         return { previous };
      },
      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASKS], ctx.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PLAN_TASK_TAGS],
         });
      },
   });

   const createTask = async (input: CreatePlanTaskInput) =>
      handleAction(createMutateAsync(input));

   // ========== UPDATE ==========
   const { mutateAsync: updateMutateAsync } = useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdatePlanTaskInput }) =>
         planTaskService.update(id, input),
      onMutate: async ({ id, input }) => {
         await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         const previous = queryClient.getQueryData<PlanTask[]>([
            QUERY_KEYS.PLAN_TASKS,
         ]);

         setTasks((old) =>
            old.map((task) =>
               task.id === id
                  ? {
                       ...task,
                       ...input,
                       tags: task.tags,
                       updatedAt: Date.now(),
                    }
                  : task,
            ),
         );
         return { previous };
      },
      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASKS], ctx.previous);
      },
      onSettled: () =>
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] }),
   });

   const updateTask = async (id: string, input: UpdatePlanTaskInput) =>
      handleAction(updateMutateAsync({ id, input }));

   // ========== DELETE ==========
   const { mutateAsync: deleteMutateAsync } = useMutation({
      mutationFn: planTaskService.remove,

      onMutate: async (id) => {
         await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         const previous = queryClient.getQueryData<PlanTask[]>([
            QUERY_KEYS.PLAN_TASKS,
         ]);
         setTasks((old) => old.filter((t) => t.id !== id));
         return { previous };
      },

      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASKS], ctx.previous);
      },

      onSettled: () =>
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] }),
   });

   const deleteTask = async (id: string) => handleAction(deleteMutateAsync(id));

   // ========== REORDER ==========
   const { mutateAsync: reorderMutateAsync } = useMutation({
      mutationFn: planTaskService.reorder,
      onMutate: async (reorderedTasks) => {
         await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         const previous = queryClient.getQueryData<PlanTask[]>([
            QUERY_KEYS.PLAN_TASKS,
         ]);

         const reorderedIds = reorderedTasks.map((t) => t.id);
         setTasks((old) => [
            ...old.filter((t) => !reorderedIds.includes(t.id)),
            ...reorderedTasks.map((t, i) => ({ ...t, order: i + 1 })),
         ]);
         return { previous };
      },
      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASKS], ctx.previous);
      },
      onSettled: () =>
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] }),
   });

   const reorderTasks = async (tasks: PlanTask[]) =>
      handleAction(reorderMutateAsync(tasks));

   // ========== MOVE TO COLUMN ==========
   const { mutateAsync: moveMutateAsync } = useMutation({
      mutationFn: ({
         id,
         status,
         columnTasks,
      }: {
         id: string;
         status: PlanTaskStatus;
         columnTasks: PlanTask[];
      }) => planTaskService.moveToColumn(id, status, columnTasks),

      onMutate: async ({ id, status, columnTasks }) => {
         await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] });
         const previous = queryClient.getQueryData<PlanTask[]>([
            QUERY_KEYS.PLAN_TASKS,
         ]);

         setTasks((old) => {
            const otherTasks = old.filter(
               (t) => t.id !== id && !columnTasks.find((c) => c.id === t.id),
            );
            const updatedColumn = columnTasks.map((t, i) => ({
               ...t,
               status,
               order: i + 1,
               updatedAt: Date.now(),
            }));
            return [...otherTasks, ...updatedColumn];
         });

         return { previous };
      },

      onError: (_, __, ctx) => {
         if (ctx?.previous)
            queryClient.setQueryData([QUERY_KEYS.PLAN_TASKS], ctx.previous);
      },
      onSettled: () =>
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAN_TASKS] }),
   });

   const moveTask = async (
      id: string,
      status: PlanTaskStatus,
      columnTasks: PlanTask[],
   ) => handleAction(moveMutateAsync({ id, status, columnTasks }));

   return {
      tasks,
      tasksTodo,
      tasksInProgress,
      tasksDone,
      isLoading,
      tags,
      isLoadingTags,

      createTask,
      updateTask,
      deleteTask,
      reorderTasks,
      moveTask,
      refetchTags,
      removeTag,
   };
}
