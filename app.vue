<template lang="pug">
.group.flex.flex-row
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
    class='hover:text-white hover:bg-gray-600' 
    v-for="(route, i) in routes" 
    :key="i" 
    :to="route.path"
  ) 
    p.uppercase.white {{route.name}}
p the above is an example of how to work with routes, which are what govern navigation in Nuxt. 
p Keep in mind that public users (those who are not logged in) should *not* see a nav - they just need search and page view.
.border-2.border-black
  RouterView
</template>

<script setup lang="ts">
const router = useRouter()
const routes = ref(router.getRoutes())
const cvCookie =useCookie('cvtoken')

if(!cvCookie.value){
  await navigateTo('/api/login')
} 

</script>