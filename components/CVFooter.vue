<script lang="ts" setup></script>

<template lang="pug">
div
    div.relative
        img(src = '../footer.png')
        div.absolute(style="margin-left: auto;margin-right: auto; left: 0;right: 0; text-align: center;")
            LinkButton.absolute.bottom-4.mx-auto.text-md(class="left-1/2" to='https://carsonsvillage.org/contact-us/') Contact Us
    div.bg-black(style="align-content: center;")
        div.flex(style="color: gray; font-weight: 700;justify-content:center")
            label Copyright 2023 Carson's Village |&nbsp;
            .col
                NuxtLink(to='https://carsonsvillage.org/privacy-policy/') Privacy Policy

</template>

<style scoped></style>
