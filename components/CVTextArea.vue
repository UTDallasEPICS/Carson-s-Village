<script setup lang="ts">
const props = defineProps<{ 
    modelValue: string,
    id: string,
                         }>()

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

<template lang="pug">
textarea.rounded-md.outline-0.border-box.w-full.p-2.border-grey-600.border-r-2.border(:id="id" v-model="value" type="text")
</template>

<style scoped>
input:user-invalid {
  border-color:red;
}
</style>