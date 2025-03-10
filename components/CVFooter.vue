<script lang="ts" setup>
import { ref } from 'vue';

type EmailListUser = {
    email: string;
    first_name: string;
    last_name: string;
}

const data = ref<EmailListUser>({
    email: '',
    first_name: '',
    last_name: ''
});

const isSubmitted = ref(false);
//console.log(isSubmitted.value)

const submit = async () => {
    const response = await $fetch<{ success: boolean }>('/api/email_list', {
        method: 'POST',
        body: { ...data.value }
    }).catch((error) => {
        console.error('Error submitting data:', error);
    });

    if (response?.success) {
        isSubmitted.value = true;
        console.log('Data submitted successfully.');
    } else {
        console.error('Error submitting data.');
    }
}

</script>

<template lang="pug">
div
    div.relative
        img(src='/footer.png')
        div.absolute.w-full.text-center(style="margin-left: auto; margin-right: auto; left: 0; right: 0; top: 20%;")
            div(v-if="!isSubmitted")
                .flex.justify-between(style="width: 98%;")
                    .col-md-8.mx-9(style="flex: 1; margin-right: 10px;")
                        CVInput(v-model='data.first_name' placeholder="First Name*" required)
                    .col-md-8.mx-9(style="flex: 1; margin-right: 10px;")
                        CVInput(v-model='data.last_name' placeholder="Last Name*" required)
                .col-md-8.mx-9(style="width: 46.1%; margin-top: 10px;")
                    CVInput(v-model='data.email' placeholder="Email*" required)
                button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="submit" class="transition duration-300 bg-orange-999 hover:bg-green-600") Submit
            div(v-else)
                div.absolute(style="top: 20%; left: 50%; transform: translate(-50%, -50%); text-align: center;")
                    div.text-xl.text-black.mt-4 Thank you for signing up!
        
        LinkButton.absolute.bottom-4.mx-auto.text-md(class="transition duration-300 bg-orange-999 hover:bg-green-600 left-1/2 -translate-x-1/2 text-white" to='https://carsonsvillage.org/contact-us/') Contact Us
    div.bg-black.flex(style="color:gray; font-weight: 700; justify-content:center; align-items: center; height: 100px;")
        label COPYRIGHT {{ (new Date()).toLocaleDateString('en', {year:'numeric'}) }} CARSON'S VILLAGE |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/privacy-policy/') PRIVACY POLICY |&nbsp;
        .col
            NuxtLink(to='https://carsonsvillage.org/carsons-village-non-discriminatory-statement/') CARSON’S VILLAGE NON-DISCRIMINATORY STATEMENT
</template>

<style scoped>
</style>
