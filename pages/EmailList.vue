<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const router = useRoute()
const success = computed(() => router.query.success)
const fail = computed(() => router.query.fail)

const successMessage = ref<string | null>(null);
const failMessage = ref<string | null>(null);

const getAuthRequestUrl = () => {
    window.location.href = '/api/constant_contacts';
}

const refreshToken = () => {
    window.location.href = '/api/refresh_token';
}

const checkSuccessParam = () => {
    const successParam = success.value as string
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

const checkFailParam = () => {
    const failParam = fail.value as string
    
    if (failParam === '1') {
        failMessage.value = 'No access token'
    }  else {
        failMessage.value = null;
    }
}

onMounted(() => {
    checkSuccessParam();
    checkFailParam()
});


</script>

<template lang="pug">
.ml-4(v-if="successMessage") {{ successMessage }}
.ml-4(v-if="failMessage") {{ failMessage }}
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl") Authorize
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken") Refresh
</template>
