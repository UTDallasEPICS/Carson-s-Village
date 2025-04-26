<script setup lang="ts">
const props = defineProps<{ modelValue: string,
                            id: string,
                            required?: string,
                            type?: string,
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
input.rounded-md.outline-0.border-box.w-full.p-2.rounded-md.border-grey-600.border-r-2.border(:id="id" :required="required" :type="type" v-model="value")
</template>

<style scoped>
    input:user-invalid {
    border-color:red;
    }
</style>