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
        //console.log("Submit?", isSubmitted.value)
    } else {
        console.error('Error submitting data.');
    }
}

//console.log("Submitted?", isSubmitted.value)

</script>

<template lang="pug">
div
    div.relative
        img(src='/footer.png')
        img(src='/join_email_list.png' style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: auto; z-index: 2;")
        div.absolute(style="position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; top: 30%; text-align: center; width: 100%;")
            div(v-if="!isSubmitted")
                div(style="display: flex; justify-content: space-between; width: 98%;")
                    .col-md-8.mx-9(style="flex: 1; margin-right: 10px;")
                        CVInput(v-model='data.first_name' placeholder="First Name*" required)
                    .col-md-8.mx-9(style="flex: 1; margin-right: 10px;")
                        CVInput(v-model='data.last_name' placeholder="Last Name*" required)
                .col-md-8.mx-9(style="width: 46.1%; margin-top: 10px;")
                    CVInput(v-model='data.email' placeholder="Email*" required)
                button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="submit") Submit
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
.absolute {
    position: absolute;
}

.relative {
    position: relative;
}
</style>
