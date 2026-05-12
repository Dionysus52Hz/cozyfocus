export const formatTime = (seconds: number): string => {
   if (isNaN(seconds) || seconds < 0) return "0:00";

   const h = Math.floor(seconds / 3600);
   const m = Math.floor((seconds % 3600) / 60);
   const s = Math.floor(seconds % 60);

   const hoursString = h.toString();
   const minutesString = m.toString();
   const secondsString = s.toString().padStart(2, "0");

   if (h > 0) {
      return `${hoursString}:${minutesString.padStart(2, "0")}:${secondsString}`;
   }
   return `${minutesString}:${secondsString}`;
};
