<template lang="pug">
label.ml-10.pt-1.whitespace-nowrap(:for="for" class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);")
    slot
</template>
        
<script setup lang="ts">
const props = defineProps<{ for: string }>()
</script>