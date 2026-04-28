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
input(
  class="rounded-md outline-0 border-box w-full p-2 border border-[#c4c4c4]" 
  type="number" 
  v-model="value"
)
</template>
