<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
const cvuser = useCookie<User>('cvuser');
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
console.log(route.path)
</script>

<template lang="pug">
.max-w-min.mx-auto.flex
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to='https://carsonsvillage.org/'
  ) 
    p.uppercase.white.w-max HOME
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to='https://carsonsvillage.org/#'
  ) 
    p.uppercase.white.w-max RESOURCES
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to='https://carsonsvillage.org/get-involved/'
  ) 
    p.uppercase.white.w-max GET INVOLVED
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
  class='hover:text-white hover:bg-gray-600'  
    to='https://carsonsvillage.org/'
  ) 
    p.uppercase.white.w-max ABOUT US
  
  .flex.w-max(v-if="isNotSearch")
    input(class="border border-gray-300 py-2 px-4 ml-8 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQuery")
    NuxtLink.inline(:to="`/Search/?search=${searchQuery}`")
      img(src="../CVSearchIcon.png")
  
  NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(v-if="isAdmin"
    class='hover:text-white hover:bg-gray-600' 
    to="/"
  ) 
    p.uppercase.white.w-max PROFILE
p the above is an example of how to work with routes, which are what govern navigation in Nuxt. 
p Keep in mind that public users (those who are not logged in) should *not* see a nav - they just need search and page view.
NuxtLink.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(v-if="isAdmin"
    class='hover:text-white hover:bg-gray-600' 
    to="/FamilyTransactionList"
  ) 

  p FamilyTransactionList  
</template>

<style scoped></style>
