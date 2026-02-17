<template lang="pug">
label(class="ml-10 pt-1 whitespace-nowrap sm:ml-11 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]" :for="for")
    slot
</template>
        
<script setup lang="ts">
const props = defineProps<{ for: string }>()
</script>