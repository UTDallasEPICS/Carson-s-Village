
<template lang="pug">
CVHeader


// use footer and header components here

.border-2.border-black
  NuxtPage

CVFooter.mt-4
</template>

<script setup lang="ts">
const router = useRouter()
const routes = ref(router.getRoutes())
const cvCookie = useCookie('cvtoken')

if(!cvCookie.value){
  await navigateTo('/api/login')
} 
</script>