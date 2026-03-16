<script lang="ts" setup>
const props = defineProps<{modelBarWidth: number | string}>()
const actualBarWidth = computed(() => { 
    if (props.modelBarWidth != null && props.modelBarWidth !== "inf" ) {
        const width = Number(props.modelBarWidth)
        if (width >= 100) {
            return 100
        } else if (width < 100 && width > 0) {
            return width
        } else {
            return 0
        }
    } else if (props.modelBarWidth === "inf") {
        return 100
    }
    return 0
})
</script>

<template lang="pug">
div(
    :style="{ width: `${actualBarWidth}%` }"
    class="h-7 rounded-full text-white flex items-center justify-center bg-[linear-gradient(90deg,rgba(15,200,0,1),rgba(133,233,0,1)_35%)] shadow-[0_3px_3px_-5px_#1ba710,0_2px_5px_#1ba710]"
)
    slot(v-if="actualBarWidth")
</template>

<style scoped></style>
