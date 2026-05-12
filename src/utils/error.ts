import { ERROR_MESSAGES } from "@/constants";

export const getFriendlyError = (error: unknown): string => {
   if (error instanceof Error) {
      return ERROR_MESSAGES[error.message] ?? ERROR_MESSAGES.DEFAULT;
   }
   return ERROR_MESSAGES.DEFAULT;
};
