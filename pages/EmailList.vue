<script lang="ts" setup>
const router = useRoute()
const success = computed(() => router.query.success)
//const fail = computed(() => router.query.fail)

const successMessage = ref<string | null>(null);
const failMessage = ref<string | null>(null);

const getAuthRequestUrl = () => {
    window.location.href = '/api/cc_access_token';
}

const refreshToken = async() => {
   const responce = await $fetch('/api/refresh_token', {
        method: "PUT"
    }).catch(error => {
        console.log(error)
        successMessage.value = ''
        failMessage.value = 'No access token present'
    })

    if(responce?.statusCode === 200) {
        successMessage.value = 'Success! Constant Contacts Auth token was refreshed!';
    } else {
        failMessage.value = 'Cannot refresh token, no access token present'
        successMessage.value = ''
    }

}

const checkAccessToken = async() => {
    // using $fetch instead of useFetch because we do not want to cache if the token exists or not
    const tokenExists = await $fetch('/api/cc_access_token_exists', {
            method: "GET"
    })

    if(tokenExists) {
        successMessage.value = 'Success! Constant Contacts Auth token was created or is already present'
    } else {
        failMessage.value = 'No access token present'
        successMessage.value = ''
    }
}

await checkAccessToken();
</script>

<template lang="pug">
.flex.justify-center.align-center
    .ml-4(v-if="successMessage") {{ successMessage }}
    .ml-4(v-if="failMessage") {{ failMessage }}
.flex.justify-center.align-center
    button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl" class="transition duration-300 bg-orange-999 hover:bg-green-600") Authorize
    button.type-button.ml-4.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken" class="transition duration-300 bg-orange-999 hover:bg-green-600") Refresh Token

</template>
