import { type ActionResponse } from "@/types";
import { ERROR_MESSAGES } from "@/constants";

export const handleAction = async <T>(
   callback: Promise<T> | (() => Promise<T>),
   customMessages: Record<string, string> = {},
): Promise<ActionResponse<T>> => {
   try {
      const data = await (typeof callback === "function"
         ? callback()
         : callback);
      return {
         success: true,
         data,
         error: null,
      };
   } catch (error: any) {
      const code = error.message;

      const friendlyError =
         customMessages[code] ?? ERROR_MESSAGES[code] ?? ERROR_MESSAGES.DEFAULT;

      return {
         success: false,
         data: null,
         error: friendlyError,
      };
   }
};
