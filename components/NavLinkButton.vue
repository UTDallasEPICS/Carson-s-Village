<template lang="pug">
NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.cursor-pointer(style="text-align:center;" class='text-gray-999 hover:text-black border border-gray-999 hover:border-green-999 transition duration-300' :to="to")
    slot
</template>
    
<script setup lang="ts">
const props = defineProps<{ to: string}>()
</script>