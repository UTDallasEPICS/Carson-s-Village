<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
const cvuser = useCookie<User>('cvuser');
const cvtoken = useCookie('cvtoken');
const isAdmin = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin")
const cuid = computed(() => cvuser.value?.cuid)
const familyCuid = computed(() => cvuser.value?.familyCuid)
const isLoggedIn = computed(() => cvuser.value)
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")

</script>

<template lang="pug">
ClientOnly
  .max-w-min.mx-auto.flex.gap-2.mt-7(style="text-align:center")
    div.max-w-min.mx-auto.flex.gap-2(v-if="isLoggedIn")
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(style="border: 1px solid #c4c4c4;"
      class='hover:text-white hover:bg-gray-600'  
      href="/api/logout"
      ) 
        p.uppercase.white.w-max LOGOUT
      NavLinkButton(:to="`/PageList/${cuid}/?fromUsers=0`" v-if="isAdmin" target="_blank") 
        p.uppercase.white.w-max Pages
      NavLinkButton(:to="`/pageList/${familyCuid}/?fromUsers=0`" v-if="!isAdmin" target="_blank")
        p.uppercase.white.w-max Pages
      NavLinkButton(to='/EditPage/0' target="_blank") 
        p.uppercase.white.w-max New page
      NavLinkButton( v-if="isAdmin" to='/Users' target="_blank") 
        p.uppercase.white.w-max Users
      NavLinkButton( v-if="isAdmin" to='/EditUser/0' target="_blank") 
        p.uppercase.white.w-max Invite user
      NavLinkButton( v-if="isAdmin" to='/EditFamily' target="_blank") 
        p.uppercase.white.w-max Create Family
      NavLinkButton(to="/" target="_blank") 
        p.uppercase.white.w-max Home
      NavLinkButton(v-if="isAdmin" to='/FamilyTransactionList' target="_blank") 
        p.uppercase.white.w-max Donations
      NavLinkButton(v-if="isAdmin" to='/FamilyReports' target="_blank")
        p.uppercase.white.w-max Family Reports
    div.max-w-min.mx-auto.flex.gap-2(v-else)
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(style="border: 1px solid #c4c4c4;"
      class='hover:text-white hover:bg-gray-600'  
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
    
    .flex.w-max(v-if="isNotSearch")
      input(class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQuery")
      NuxtLink.inline(:to="`/Search/?search=${searchQuery}`")
        img(src="/CVSearchIcon.png")
</template>

<style scoped></style>
