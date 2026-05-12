import { supabase } from "@/database";
import { ERROR_CODES } from "@/constants";

export const musicService = {
   async fetchTracks({ queryKey, pageParam }: any) {
      const [_key, search] = queryKey;
      const itemsPerPage = 10;

      let query = supabase
         .from("tracks")
         .select("*")
         .order("created_at", { ascending: false })
         .order("id", { ascending: false })
         .limit(itemsPerPage);

      if (pageParam) {
         query = query.or(
            `created_at.lt.${pageParam.created_at},and(created_at.eq.${pageParam.created_at},id.lt.${pageParam.id})`,
         );
      }

      if (search) {
         query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);
      }
      const { data, error } = await query;

      if (error) {
         throw new Error(ERROR_CODES.DB_READ_TRACKS_ERROR);
      }

      const lastItem =
         data.length === itemsPerPage ? data[data.length - 1] : null;
      const nextCursor = lastItem
         ? { created_at: lastItem.created_at, id: lastItem.id }
         : null;
      return {
         data: data || [],
         nextCursor,
      };
   },
};
