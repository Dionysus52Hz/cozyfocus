<script setup lang="ts">
   import { useAppSettings } from "@/composables/useAppSettings";
   import { useTimer } from "@/composables/useTimer";
   import { Toaster } from "@/components/ui/sonner";
   import { onMounted } from "vue";
   import AlertDialog from "@/components/common/AlertDialog.vue";

   const { loadSettings } = useAppSettings();
   const { init: initTimer } = useTimer();

   onMounted(async () => {
      await loadSettings();
      initTimer();
   });
</script>

<template>
   <Toaster
      :toast-options="{
         classes: {
            toast: 'bg-primary! border-2! text-primary-foreground! rounded-sm!',
         },
      }"
      :style="{ fontFamily: 'inherit' }" />
   <RouterView />
   <AlertDialog />
</template>
