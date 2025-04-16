<template lang="pug">
    .group.overflow-visible.relative
        svg(xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" style="max-width:30px;" :fill="chevronColor" className="size-6")
            path(fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd")
    </template>
    
<script setup lang="ts">
const props = defineProps<{ isEnd: Boolean }>();
const chevronColor = computed(() => {
    return props.isEnd ? "#566f81" : "#000000"
})
</script>
