<template lang="pug">
Datepicker.rounded-md.p-2(:id="id" type="Date" v-model="value" auto-apply)
    slot
</template>
        
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{
        modelValue: Date | string | null,
        id: string,
                        }>();

const emit = defineEmits(["update:modelValue"])
const value = computed({
    get(){
        /*if(props.modelValue == "null") {
            return null
        }*/
        return props.modelValue
    },
    set(v: Date | string | null) {
        emit("update:modelValue", v)
    },
})
</script>