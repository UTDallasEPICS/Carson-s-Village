
<template lang="pug">
.flex.flex-col.gap-5.min-h-screen
  CVHeader
  NuxtPage.grow
  CVFooter
</template>

<script setup lang="ts">
const runtime = useRuntimeConfig()
const router = useRouter()
const routes = ref(router.getRoutes())
const route = useRoute()
const cvCookie = useCookie('cvtoken')
const cvuser = useCookie('cvuser')
const isSearch = computed(() => route.path == "/Search/")
const isFamilyPage = computed(() => route.path.includes("/Page/"))

if(!cvCookie.value && !isSearch.value && !isFamilyPage.value){
  console.log(route.path + 'redirected to search')
  
  await navigateTo('/Search/?search=')
}

</script>