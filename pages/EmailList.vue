<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const successMessage = ref(false);

const getAuthRequestUrl = () => {
    window.location.href = '/api/constant_contacts';
}

const refreshToken = () => {
    window.location.href = '/api/refresh_token';
}

const submit =  async () => {
    try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                successMessage.value = true;
            } else {
                console.error('Failed to submit data:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
}


const checkSuccessParam = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' || '2') {
        successMessage.value = true;
    }
}

const data = {
    email: '',
    first_name: '',
    last_name: ''
};

onMounted(() => {
    checkSuccessParam();
});
</script>

<template lang="pug">
button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl") Authorize
button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken") Refresh
div(v-if="successMessage") Success! The token operation was completed!
.col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
    CVInput(v-model='data.email' placeholder="required" required)
.col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
    CVInput(v-model='data.first_name' placeholder="required" required)
.col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
    CVInput(v-model='data.last_name' placeholder="required" required)
button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="submit") Submit
//successMessage = false;
</template>
