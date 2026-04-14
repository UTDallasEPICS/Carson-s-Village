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
</script>

<template lang="pug">
div(class="relative w-full")
    img(src='/footer.png')
    div(class="absolute w-full text-center ml-auto mr-auto left-0 right-0 top-[20%]")
        div(v-if="!isSubmitted")
            form(class="flex justify-between w-[98%]")
                div(class="col-md-8 mx-9 flex-1 mr-[10px]")
                    CVInput(id="email_list_first_name" v-model='data.first_name' placeholder="First Name*" required="required")
                div(class="col-md-8 mx-9 flex-1 mr-[10px]")
                    CVInput(id="email_list_last_name" v-model='data.last_name' placeholder="Last Name*" required="required")
            div(class="col-md-8 mx-9 mt-[10px]")
                CVInput(id="email_list_email" type="email" v-model='data.email' placeholder="Email*" required="required")
            button(class="type-button my-4 bg-orange-999 text-white px-4 py-2 rounded-full w-32 grow-0 transition duration-300 hover:bg-green-600" type="button" @click="submit") Submit

        div(v-else)
            div(class="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center")
                div(class="text-xl text-black mt-4") Thank you for signing up!
    
    LinkButton(class="absolute bottom-4 mx-auto text-md transition duration-300 bg-orange-999 hover:bg-green-600 left-1/2 -translate-x-1/2 text-white" to='https://carsonsvillage.org/contact-us/') Contact Us
div(class="bg-black flex text-[gray] font-bold justify-center items-center h-[100px]")
    label COPYRIGHT {{ (new Date()).toLocaleDateString('en', {year:'numeric'}) }} CARSON'S VILLAGE |&nbsp;
        NuxtLink(class="duration:200 hover:font-extrabold hover:underline" to='https://carsonsvillage.org/privacy-policy/') PRIVACY POLICY
</template>
