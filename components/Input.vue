<script setup lang="ts">
//input(:value="modelValue" @input="$emit('update:modelValue',$event.target.value)")
   //slot
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    }
});
  </script>

<template lang="pug">
input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" :value="modelValue" @input="$emit('update:modelValue',$event.target.value)")
</template>