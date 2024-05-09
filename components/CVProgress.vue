<script lang="ts" setup>
const props = defineProps<{modelBarWidth: string}>()
const actualBarWidth = computed(() => { 
    if(props.modelBarWidth != null && props.modelBarWidth !="inf" ) {
        if(parseFloat(props.modelBarWidth) >= 100) {
            return 100
        } else if(parseFloat(props.modelBarWidth) < 100 && parseFloat(props.modelBarWidth) > 0) {
            return parseFloat(props.modelBarWidth)
        } else {
            return 0
        }
    } else if(props.modelBarWidth == "inf") {
        return 100
    }})
console.log(parseFloat(props.modelBarWidth), " bar width")


console.log(actualBarWidth.value)
const style = computed(() => 
`height: 28px; background: linear-gradient(90deg, rgba(15,200,0,1), rgba(133,233,0,1) 35%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; width:${actualBarWidth.value}%`);
</script>

<template lang="pug">
.rounded-full.text-white.flex.items-center.justify-center(:style="style")
    slot(v-if="actualBarWidth")
</template>

<style scoped></style>
