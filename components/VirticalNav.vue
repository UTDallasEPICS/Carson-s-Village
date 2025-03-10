<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
//import searchOnEnter from '@/Search.vue'
//import pageSearch from '@Search.vue'
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
const toggle = ref(true);

const onEnter = async() => {
  // Navigate to the search page with the entered query
  await navigateTo (`/Search/?search=${searchQuery.value}&isPageList=0`);
  
}


</script>

<template lang="pug">
ClientOnly
  .mt-48.text-center
    div.gap-2(v-if="isLoggedIn && toggle")
      NavLinkButtonVNav(:to="`/pageList/${cuid}/?fromUsers=0`" v-if="isAdvocateAdmin" :class="{'!text-black border-green-999 bg-white': route.path.includes('/page') || route.path.includes('/Page')}") 
        p.uppercase.white.mb-2.w-max Pages
      NavLinkButtonVNav(:to="`/pageList/${familyCuid}/?fromUsers=0`" v-if="!isAdvocateAdmin" :class="{'!text-black border-green-999 bg-white': route.path.includes('/pageList')}")
        p.uppercase.white.mb-2.w-max Pages
      NavLinkButtonVNav(to='/EditPage/0' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditPage')}") 
        p.uppercase.white.mb-2.w-max New page
      NavLinkButtonVNav( v-if="isAdvocateAdmin" to='/Users' :class="{'!text-black border-green-999 bg-white': route.path.includes('/Users')}") 
        p.uppercase.white.mb-2.w-max Users
      NavLinkButtonVNav( v-if="isAdvocateAdmin" to='/EmailList' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EmailList')}") 
        p.uppercase.white.mb-2.w-max Email List
      NavLinkButtonVNav( v-if="isAdvocateAdmin" to='/EditUser/0' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditUser')}") 
        p.uppercase.white.mb-2.w-max Invite user
      NavLinkButtonVNav( v-if="isAdvocateAdmin" to='/EditFamily' :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditFamily')}") 
        p.uppercase.white.mb-2.w-max Edit Family
      NavLinkButtonVNav(to="/" :class="{'!text-black border-green-999 bg-white': route.path == '/'}") 
        p.uppercase.white.mb-2.w-max Profile
      NavLinkButtonVNav(v-if="isAdmin" to='/FamilyTransactionList' :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyTransactionList'}") 
        p.uppercase.white.mb-2.w-max Donations
      NavLinkButtonVNav(v-if="isAdvocateAdmin" to='/FamilyReports' :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyReports'}")
        p.uppercase.white.mb-2.w-max Family Reports
      NavLinkButtonVNav(v-if="isAdvocateAdmin" to='/Families' :class="{'!text-black border-green-999 bg-white': route.path == '/Families'}")
        p.uppercase.white.mb-2.w-max Families

</template>

