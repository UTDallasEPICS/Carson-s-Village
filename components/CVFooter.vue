<script lang="ts" setup></script>

<template lang="pug">
div
    div
        img(src = '../footer.png')
        nuxt-link.mx-auto.text-md.bg-orange-500(to='https://carsonsvillage.org/contact-us/') 
    div.bg-black(style="align-content: center;")
        div.flex(style="color: gray; font-weight: 700;justify-content:center")
            label Copyright 2023 Carson's Village |&nbsp;
            .col
                nuxt-link(to='https://carsonsvillage.org/privacy-policy/') Privacy Policy

</template>

<style scoped></style>
