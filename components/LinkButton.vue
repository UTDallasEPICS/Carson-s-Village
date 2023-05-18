<template lang="pug">
NuxtLink.p-4.mx-auto.text-white.font-poppins.font-bold.bg-orange-400.rounded-full.w-fit(:to="to") 
  slot
</template>

<script setup lang="ts">
const props = defineProps<{ to: string}>()
</script>