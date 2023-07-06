<script lang="ts" setup></script>

<template lang="pug">
.information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
    CVLegend Image Preview Developer
    div(v-for="(image,i) in images" :key="i" style="background-color: #333; overflow: auto; white-space: nowrap; padding: 10px;")
        img.rounded-lg(style="padding: 10px;" :src = "`${image}`")
        .form-horizontal(style='position: absolute; top: 5px; right: 5px')
            button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;" @click = "removeImage(image)") x
</template>

<style scoped></style>
