<script lang="ts" setup>
const props = defineProps<{barWidth: number}>()
const emit = defineEmits(["update:modelValue"])

const BarWidth = computed({
   get() {
    return props.barWidth
   },
   set(v: number){
        emit("update:modelValue", v)
   },
})

</script>

<template lang="pug">
//.rounded-full.text-white.flex.items-center.justify-center(:style="{'width': BarWidth + "%"};")
.rounded-full.text-white.flex.items-center.justify-center(:modelbarWidth="BarWidth" style="background: linear-gradient(90deg, rgba(15,200,0,1) 100%, rgba(203,255,0,1) 35%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; height:100%")
    slot
</template>

<style scoped></style>
