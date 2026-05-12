export const parseVideoId = (rawUrl: string): string | null => {
   if (!rawUrl) return null;

   const url = rawUrl.trim();

   const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

   const match = url.match(regex);

   return (match && match[1]) || null;
};
