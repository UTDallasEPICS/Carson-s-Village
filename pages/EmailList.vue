<script lang="ts" setup>
const router = useRoute()
const success = computed(() => router.query.success)
//const fail = computed(() => router.query.fail)

const successMessage = ref<string | null>(null);
const failMessage = ref<string | null>(null);

const getAuthRequestUrl = () => {
    window.location.href = '/api/constant_contacts';
}

const refreshToken = async() => {
   const responce = await $fetch('/api/refresh_token', {
        method: "PUT"
    })
    if(responce?.statusCode === 200) {
        successMessage.value = 'Success! Constant Contacts Auth token was refreshed!';
    } else {
        failMessage.value = 'No access token present'
    }
}

const checkAccessToken = async() => {
    const tokenExists = await $fetch('/api/cc_access_token', {
            method: "GET"
    })
    
    if(tokenExists) {
        successMessage.value = 'Success! Constant Contacts Auth token was created'
    } else {
        successMessage.value = ''
    }
}

onMounted(() => {
    checkAccessToken();
});




</script>

<template lang="pug">
.ml-4(v-if="successMessage") {{ successMessage }}
.ml-4(v-if="failMessage") {{ failMessage }}
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl") Authorize
button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken") Refresh
</template>
