<script lang="ts" setup>
const props = defineProps({
    itemList: {
        type: [],
        default: "",
    }
});
// make the table based on a row of objects with a list of headers (list of objects) { title, property } iterate over headers

</script>

<template lang="pug">
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1000px]" style="height: auto; box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
    table(style="table-layout: auto;")
        thead
            tr
                th.font-poppins.font-bold.font-bold.p-2(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:33%; overflow: hidden") 
                    slot
                th.font-poppins.font-bold(style="width:34%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") 
                    slot
                th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));")
                    slot
                th.font-poppins.font-bold(style="width:33%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));")
                    slot
            tr(v-for="(item, i) in itemList" 
                :key="i" 
            )
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") 
                    slot
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") 
                    slot
                td
                LinkButton(class="sm:my-2" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="") 
                    slot
    .container.mx-auto(class="w-auto sm:w-[1000px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>
