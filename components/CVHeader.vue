<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
const cvuser = useCookie<User>('cvuser');
const cvtoken = useCookie('cvtoken');
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")
const cuid = computed(() => cvuser.value?.cuid)
const isLoggedIn = computed(() => cvuser.value)
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
console.log(isLoggedIn.value)
</script>

<template lang="pug">
ClientOnly
  .max-w-min.mx-auto.flex
    div.max-w-min.mx-auto.flex(v-if="isLoggedIn")
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(style="border: 1px solid #c4c4c4;"
      class='hover:text-white hover:bg-gray-600'  
      href="/api/logout"
      ) 
        p.uppercase.white.w-max LOGOUT
      NavLinkButton(:to="`/PageList/${cuid}`") 
        p.uppercase.white.w-max(v-if="isAdmin") List of client pages
        p.uppercase.white.w-max(v-else) View existing pages
      NavLinkButton(to='/EditPage/0') 
        p.uppercase.white.w-max Insert new page
      NavLinkButton( v-if="isAdmin" to='/Users') 
        p.uppercase.white.w-max See all users
      NavLinkButton( v-if="isAdmin" to='/EditUser/0') 
        p.uppercase.white.w-max Invite user
      NavLinkButton(to="/") 
        p.uppercase.white.w-max PROFILE
      NavLinkButton(v-if="isAdmin" to='/FamilyTransactionList') 
        p.uppercase.white.w-max See Family Donations
    div.max-w-min.mx-auto.flex(v-else)
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(style="border: 1px solid #c4c4c4;"
      class='hover:text-white hover:bg-gray-600'  
      href="/api/login"
      ) 
        p.uppercase.white.w-max LOGIN
      NavLinkButton(to='https://carsonsvillage.org/') 
        p.uppercase.white.w-max HOME
      NavLinkButton(to='https://carsonsvillage.org/#') 
        p.uppercase.white.w-max RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/') 
        p.uppercase.white.w-max GET INVOLVED
      NavLinkButton(to='https://carsonsvillage.org/') 
        p.uppercase.white.w-max ABOUT US
    
    .flex.w-max(v-if="isNotSearch")
      input(class="border border-gray-300 py-2 px-4 ml-8 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQuery")
      NuxtLink.inline(:to="`/Search/?search=${searchQuery}`")
        img(src="/CVSearchIcon.png")
</template>

<style scoped></style>
