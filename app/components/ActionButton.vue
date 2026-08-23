<script setup lang="ts">
  const props = defineProps<{ text: string }>();
</script>

<template>
  <button
    class="px-6 py-3 rounded-full text-white font-bold"
    type="button"
  >
    {{ props.text }}
  </button>
</template>
