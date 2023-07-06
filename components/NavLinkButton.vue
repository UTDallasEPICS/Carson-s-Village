<template lang="pug">
NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(style="border: 1px solid #c4c4c4;" class='hover:text-white hover:bg-gray-600' :to="to")
    slot
</template>
    
<script setup lang="ts">
const props = defineProps<{ to: string}>()
</script>