<script lang="ts" setup>
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
    }
});

const BarWidth = computed( () => {
    props.modelValue
})
</script>

<template lang="pug">
.rounded-full.text-white.flex.items-center.justify-center(:style="{'width': BarWidth + "%"}")
</template>

<style scoped></style>
