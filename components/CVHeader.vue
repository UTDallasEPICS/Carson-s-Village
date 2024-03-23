<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
const cvuser = useCookie<User>('cvuser');
const cvtoken = useCookie('cvtoken');
const isAdvocateAdmin = computed(() => cvuser.value?.user_role == "admin" || cvuser.value?.user_role == "advocate")
const isAdmin = computed(() => cvuser.value?.user_role == "admin")
const cuid = computed(() => cvuser.value?.cuid)
const familyCuid = computed(() => cvuser.value?.familyCuid)
const isLoggedIn = computed(() => cvuser.value)
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
console.log(route.path)
</script>

<template lang="pug">
ClientOnly
  .max-w-min.mx-auto.flex.gap-2.mt-7(style="text-align:center")
    div.max-w-min.mx-auto.flex.gap-2(v-if="isLoggedIn")
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-gray-999.cursor-pointer(
      class='hover:text-black border border-gray-999 hover:border-green-999 bg-white'  
      href="/api/logout"
      ) 
        p.uppercase.white.w-max LOGOUT
      NavLinkButton(:to="`/pageList/${cuid}/?fromUsers=0`" v-if="isAdvocateAdmin" :class="{'!text-black border-green-999 bg-white': route.path.includes('/page') || route.path.includes('/Page')}") 
        p.uppercase.white.w-max Pages
      NavLinkButton(:to="`/pageList/${familyCuid}/?fromUsers=0`" v-if="!isAdvocateAdmin" :class="{'!text-black border-green-999 bg-white': route.path.includes('/pageList')}")
        p.uppercase.white.w-max Pages
      NavLinkButton(to='/EditPage/0' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditPage')}") 
        p.uppercase.white.w-max New page
      NavLinkButton( v-if="isAdvocateAdmin" to='/Users' :class="{'!text-black border-green-999 bg-white': route.path.includes('/Users')}") 
        p.uppercase.white.w-max Users
      NavLinkButton( v-if="isAdvocateAdmin" to='/EditUser/0' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditUser')}") 
        p.uppercase.white.w-max Invite user
      NavLinkButton( v-if="isAdvocateAdmin" to='/EditFamily' :class="{'!text-black border-green-999 bg-white': route.path == '/EditFamily'}") 
        p.uppercase.white.w-max Create Family
      NavLinkButton(to="/" :class="{'!text-black border-green-999 bg-white': route.path == '/'}") 
        p.uppercase.white.w-max Home
      NavLinkButton(v-if="isAdmin" to='/FamilyTransactionList' :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyTransactionList'}") 
        p.uppercase.white.w-max Donations
      NavLinkButton(v-if="isAdvocateAdmin" to='/FamilyReports' :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyReports'}")
        p.uppercase.white.w-max Family Reports
    div.max-w-min.mx-auto.flex.gap-2(v-else)
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-gray-999.cursor-pointer(
      class='hover:!text-black border border-gray-999 hover:border-green-999 bg-white'  
      href="/api/login"
      ) 
        p.uppercase.white.w-max LOGIN
      NavLinkButton(to='https://carsonsvillage.org/' target="_blank") 
        p.uppercase.white.w-max HOME
      NavLinkButton(to='https://carsonsvillage.org/#' target="_blank") 
        p.uppercase.white.w-max RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/' target="_blank") 
        p.uppercase.white.w-max GET INVOLVED
      NavLinkButton(to='https://carsonsvillage.org/' target="_blank") 
        p.uppercase.white.w-max ABOUT US
    
    //&& isLoggedIn")
    .flex.w-max(v-if="isNotSearch")
      input(class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQuery")
      NuxtLink.inline(:to="`/Search/?search=${searchQuery}&isPageList=0`")
        img(src="/CVSearchIcon.png")
    //.flex.w-max(v-else) Todo: add to search page
      p.uppercase.white.w-max Welcome TO Carson's Village
</template>

<style scoped></style>
