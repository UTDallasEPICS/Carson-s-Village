
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
//:BaseURL="`${process.env.process}`
CVHeader
NuxtPage
CVFooter.mt-4
</template>

<script setup lang="ts">
const router = useRouter()
const routes = ref(router.getRoutes())
const route = useRoute()
const cvCookie = useCookie('cvtoken')
const isNotSearch = computed(() => route.path !== "/Search/")

if(!cvCookie.value && isNotSearch.value){
  await navigateTo('/Search/?search=')
}

const login = (async() => {
  await navigateTo('/api/login')
})
const logout = (async() =>{
  await navigateTo('/api/logout')
})
</script>