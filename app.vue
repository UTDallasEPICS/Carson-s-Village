
<template lang="pug">
//NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to="http://localhost:3000/api/logout"
  ) 
  p.uppercase.white.w-max LOGOUT

//NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to="http://localhost:3000/api/login"
  ) 
  p.uppercase.white.w-max LOGIN
//Button.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(@click="logout") LOGOUT
CVHeader
NuxtPage
CVFooter.mt-4
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

console.log(route.path + "path after donation")
if(!cvCookie.value && !isSearch.value && !isFamilyPage.value){
  console.log(route.path + 'redirected to search')
  
  await navigateTo('/Search/?search=')
}

</script>