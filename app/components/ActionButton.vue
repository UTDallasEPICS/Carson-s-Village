<script setup lang="ts">
  const props = defineProps<{ text: string }>();
</script>

<template lang="pug">
button(class="px-6 py-3 rounded-full text-white font-bold" type="button") {{props.text}}
</template>
