<script lang="ts" setup>
const props = defineProps<{modelBarWidth: string}>()
const style = computed(() => 
`background: linear-gradient(90deg, rgba(15,200,0,1), rgba(133,233,0,1) 35%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; width:${props.modelBarWidth}%`);
</script>

<template lang="pug">
.rounded-full.text-white.flex.items-center.justify-center(:style="style")
    slot
</template>

<style scoped></style>
