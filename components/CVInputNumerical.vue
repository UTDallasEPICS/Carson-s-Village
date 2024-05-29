<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()

const emit = defineEmits(["update:modelValue"])
const value = computed({
    get(){
        return props.modelValue
    },
    set(v: number){
        emit("update:modelValue", v)
    },
})
</script>

<template lang="pug">
input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model="value")
</template>