<template lang="pug">
Datepicker.rounded-md.outline-0.border-box.p-2(style="border: 1px solid #c4c4c4;" type="String" v-model="value")
</template>
        
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{modelValue: string }>();

const emit = defineEmits(["update:modelValue"])
const value = computed({
    get(){
        return props.modelValue
    },
    set(v: string){
        emit("update:modelValue", v)
    },
})
</script>