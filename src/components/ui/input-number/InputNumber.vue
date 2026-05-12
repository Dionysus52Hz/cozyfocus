<script setup lang="ts">
   import { Input } from "@/components/ui/input";
   import { Button } from "@/components/ui/button";
   import { MinusIcon, PlusIcon } from "lucide-vue-next";

   interface Props {
      modelValue: number;
      min?: number;
      max?: number;
      step?: number;
   }

   const props = withDefaults(defineProps<Props>(), {
      min: 0,
      step: 1,
   });

   const emit = defineEmits(["update:modelValue"]);

   const updateValue = (newValue: number) => {
      if (props.min !== undefined && newValue < props.min) return;
      if (props.max !== undefined && newValue > props.max) return;
      emit("update:modelValue", newValue);
   };

   const increment = () => updateValue(props.modelValue + props.step);
   const decrement = () => updateValue(props.modelValue - props.step);

   const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      updateValue(Number(target.value));
   };
</script>

<template>
   <div class="flex items-center">
      <slot
         name="decrement"
         :decrement="decrement">
         <Button
            type="button"
            size="icon"
            @click="decrement">
            <MinusIcon />
         </Button>
      </slot>

      <Input
         type="number"
         :value="modelValue"
         @input="handleInput"
         class="h-9 w-20 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0 focus-visible:border-primary" />

      <slot
         name="increment"
         :increment="increment">
         <Button
            type="button"
            size="icon"
            @click="increment">
            <PlusIcon />
         </Button>
      </slot>
   </div>
</template>
