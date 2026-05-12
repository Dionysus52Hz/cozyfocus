export const ERROR_CODES = {
   TASK_NOT_FOUND: "TASK_NOT_FOUND",
   UPDATE_TASK_FAILED: "UPDATE_TASK_FAILED",
   DELETE_TASK_FAILED: "DELETE_TASK_FAILED",
   DB_DUPLICATE_TASK: "DB_DUPLICATE_TASK",
   DB_READ_TASK_ERROR: "DB_READ_TASK_ERROR",
   DB_READ_TRACKS_ERROR: "DB_READ_TRACKS_ERROR",
   DB_READ_TASK_TAGS_ERROR: "DB_READ_TASK_TAGS_ERROR",
   VALIDATION_EMPTY_TASK_TITLE: "VALIDATION_EMPTY_TASK_TITLE",
} as const;

export const ERROR_MESSAGES: Record<string, string> & { DEFAULT: string } = {
   [ERROR_CODES.TASK_NOT_FOUND]: "Oops! We couldn't find that task.",
   [ERROR_CODES.UPDATE_TASK_FAILED]:
      "Something went wrong while updating the task.",
   [ERROR_CODES.DELETE_TASK_FAILED]:
      "Something went wrong while deleting the task.",
   [ERROR_CODES.DB_DUPLICATE_TASK]: "This task already exists in your list.",
   [ERROR_CODES.VALIDATION_EMPTY_TASK_TITLE]: "Please enter a task title.",
   [ERROR_CODES.DB_READ_TASK_ERROR]: "Could not retrieve task data",
   [ERROR_CODES.DB_READ_TRACKS_ERROR]: "Could not retrieve tracks list",
   [ERROR_CODES.DB_READ_TASK_TAGS_ERROR]: "Could not retrieve task tags list",
   DEFAULT: "An unexpected error occurred. Please try again.",
};
