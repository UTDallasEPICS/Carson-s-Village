<script setup lang="ts">
  const model = defineModel<string>()
  const props = defineProps<{ 
    id: string,
    required?: string,
    type?: string,
  }>()
</script>

<template lang="pug">
input(
  class="rounded-md outline-0 border-box w-full p-2 rounded-md border-grey-600 border-r-2 border" 
  :id="id" 
  :required="required" 
  :type="type" 
  v-model="model"
)
</template>

<style scoped>
    input:user-invalid {
    border-color:red;
    }
</style>
