<script lang="ts" setup>
import type {EmailListUser} from "@/types.d.ts"
import CVInput from './CVInput.vue';
const data_user = ref<EmailListUser>({
    first_name: "",
    last_name: "",
    email: ""
})

</script>

<template lang="pug">
div
    div.relative
    <div class="gdlr-core-pbf-background-wrap" style="background-color: #ededed ;">
    <div class="gdlr-core-pbf-background gdlr-core-parallax gdlr-core-js" style="background-size: cover; background-position: center; height: 605px; transform: translate(0px, -36.3px);" data-parallax-speed="0.1"></div>
        img(src='/footer.png')
        
            LinkButton.absolute.bottom-4.mx-auto.text-md(class="transition duration-300 bg-orange-999 hover:bg-green-600 left-1/2 -translate-x-1/2 text-white" to='https://carsonsvillage.org/contact-us/') Contact Us
    div.bg-black.flex(style="color:gray; font-weight: 700; justify-content:center; align-items: center; height: 100px;")
        label COPYRIGHT 2023 CARSON'S VILLAGE |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/privacy-policy/') PRIVACY POLICY |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/carsons-village-non-discriminatory-statement/') CARSON’S VILLAGE NON-DISCRIMINATORY STATEMENT
</template>

<style scoped></style>
