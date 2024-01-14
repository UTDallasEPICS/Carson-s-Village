<script lang="ts" setup>


const actualBarWidth = ref(0)
const displayNothing = ref(false)
const props = defineProps<{modelBarWidth: string}>()
console.log(parseFloat(props.modelBarWidth), "bas")
if(props.modelBarWidth != null && props.modelBarWidth !="inf" ) {
    if(parseFloat(props.modelBarWidth) >= 100) {
        actualBarWidth.value = 100
    } else if(parseFloat(props.modelBarWidth) < 100 && parseFloat(props.modelBarWidth) > 0) {
        actualBarWidth.value = parseFloat(props.modelBarWidth)
    } else {
        actualBarWidth.value = 0
        displayNothing.value = true
    }

} else if(props.modelBarWidth == "inf") {
    actualBarWidth.value = 100
}

console.log(actualBarWidth.value)
const style = computed(() => 
`background: linear-gradient(90deg, rgba(15,200,0,1), rgba(133,233,0,1) 35%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; width:${actualBarWidth.value}%`);
</script>

<template lang="pug">
.rounded-full.text-white.flex.items-center.justify-center(:style="style")
    slot(v-if="!displayNothing")
</template>

<style scoped></style>
