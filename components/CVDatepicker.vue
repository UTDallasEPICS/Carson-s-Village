<template lang="pug">
Datepicker.rounded-md.p-2(type="String" v-model="value")
    slot
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