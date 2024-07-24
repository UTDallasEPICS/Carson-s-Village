<script lang = "ts" setup>

const getAuthRequestUrl = () => {
    window.location.href = '/api/constant_contacts';

}

const refreshToken = () => {
    window.location.href = '/api/refresh_token';
}

</script>

<template lang = "pug">
button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="getAuthRequestUrl") Authorize
button.type-button.my-4.bg-orange-999.text-white.px-4.py-2.rounded-full.w-32.grow-0(type="button" @click="refreshToken") Refresh
</template>
