<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const successMessage = ref<string | null>(null);

const getAuthRequestUrl = () => {
    window.location.href = '/api/constant_contacts';
}

const refreshToken = () => {
    window.location.href = '/api/refresh_token';
}

const checkSuccessParam = () => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');

    if (successParam === '1') {
        successMessage.value = 'Success! Auth token was created!';
    } else if (successParam === '2') {
        successMessage.value = 'Success! Token was refreshed!';
    } else if (successParam === '3') {
        successMessage.value = 'Success! You have been added to the email list!';
    }
    else {
        successMessage.value = null;
    }
}



onMounted(() => {
    checkSuccessParam();
});
</script>

<template lang="pug">
div(v-if="successMessage") {{ successMessage }}
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl") Authorize
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken") Refresh
</template>
