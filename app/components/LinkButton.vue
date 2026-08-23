<template>
  <NuxtLink
    class="p-4 mx-auto text-white font-poppins font-bold bg-orange-400 rounded-full w-fit"
    :to="to"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ to: string}>()
</script>