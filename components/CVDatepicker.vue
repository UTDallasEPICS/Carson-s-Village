<template lang="pug">
Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" type="String" :model-value="modelValue" @update:model-value="setDate")
</template>
        
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const modelValue = ref("")
const setDate = (value: string) => {
  modelValue.value = value;
}
</script>