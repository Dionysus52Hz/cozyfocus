<script setup lang="ts">
   import {
      AlertDialog,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogCancel,
      AlertDialogAction,
   } from "@/components/ui/alert-dialog";

   import { useAlertDialog } from "@/composables/useAlertDialog";

   const { current, handleConfirm, handleCancel } = useAlertDialog();
</script>

<template>
   <AlertDialog :open="!!current">
      <AlertDialogContent
         class="bg-card border-2 shadow-none text-card-foreground">
         <AlertDialogHeader>
            <AlertDialogTitle class="text-sm">
               {{ current?.title }}
            </AlertDialogTitle>
            <AlertDialogDescription v-if="current?.description">
               {{ current?.description }}
            </AlertDialogDescription>
         </AlertDialogHeader>

         <AlertDialogFooter>
            <AlertDialogCancel
               @click="handleCancel"
               class="outline-none border-none shadow-none cursor-pointer hover:bg-accent bg-transparent">
               {{ current?.cancelLabel }}
            </AlertDialogCancel>
            <AlertDialogAction
               class="cursor-pointer border-2"
               :class="
                  current?.buttonVariant === 'destructive'
                     ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                     : ''
               "
               @click="handleConfirm">
               {{ current?.confirmLabel }}
            </AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
   </AlertDialog>
</template>
