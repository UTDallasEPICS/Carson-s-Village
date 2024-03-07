<script lang="ts" setup></script>

<template lang="pug">
div
    div.relative
        img(src='/footer.png')
        div.absolute(style="margin-left: auto;margin-right: auto; left: 0;right: 0;")
            LinkButton.absolute.bottom-4.mx-auto.text-md(class="transition duration-300 bg-orange-999 hover:bg-green-600 left-1/2 text-white" to='https://carsonsvillage.org/contact-us/') Contact Us
    div.bg-black.flex(style="color:gray; font-weight: 700; justify-content:center; align-items: center; height: 100px;")
        label COPYRIGHT 2023 CARSON'S VILLAGE |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/privacy-policy/') PRIVACY POLICY |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/carsons-village-non-discriminatory-statement/') CARSON’S VILLAGE NON-DISCRIMINATORY STATEMENT
</template>

<style scoped></style>
