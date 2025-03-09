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
const toggle = ref(false);

const onEnter = async() => {
  // Navigate to the search page with the entered query
  await navigateTo (`/Search/?search=${searchQuery.value}&isPageList=0`);
  
}

</script>

<template lang="pug">
ClientOnly
  .max-w-min.mx-auto.pt-3.flex.gap-2.mt-7.text-center
    div.max-w-min.mx-auto.flex.gap-2(v-if="isLoggedIn")
      a.w-20.items-center.px-2.py-2.text-sm.font-medium.rounded-md.text-blue-999.cursor-pointer(
        class='hover:text-black bg-white'
        target="blank"  
        href="https://carsonsvillage.org"
      )         
        img.w-20.h-14(src="/CVLogo.png")

      a.items-center.pt-5.px-2.py-2.text-sm.font-medium.rounded-md.text-blue-999.cursor-pointer(
        class='hover:text-black bg-white'  
        href="/api/logout"
      ) 
        p.uppercase.white.w-max.font-bold.text-orange-999 LOGOUT
      DropdownMenu(:has-submenus="true" :num-submenus="4"
        :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]" :dropdownMinWidth="200")
        | RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/' target="_blank")
        p.uppercase.white.w-max.text-black-999 GET INVOLVED
      DropdownMenu(:has-submenus="true" :num-submenus="6"
        :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]" :dropdownMinWidth="150" :nestedDropdownMinWidth="150")
        | ABOUT&nbsp;US

    div.max-w-min.mx-auto.flex.gap-2(v-else)
      a.w-20.items-center.px-2.py-2.text-sm.font-medium.rounded-md.text-blue-999.cursor-pointer(
        class='hover:text-black bg-white'
        target="blank"  
        href="https://carsonsvillage.org"
      )         
        img.w-20.h-14(src="/CVLogo.png")

      a.items-center.pt-5.px-2.py-2.text-sm.font-medium.rounded-md.text-blue-999.cursor-pointer(
      class='hover:!text-black bg-white'  
      href="/api/login"
      ) 
        p.uppercase.white.w-max.font-bold.text-orange-999 LOGIN

      DropdownMenu(:has-submenus="true" :num-submenus="4"
        :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]" :dropdownMinWidth="200")
        | RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/' target="_blank")
        p.pl-2.uppercase.white.w-max.text-black-999 GET INVOLVED
      DropdownMenu(:has-submenus="true" :num-submenus="6"
        :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]" :dropdownMinWidth="150" :nestedDropdownMinWidth="150")
        | ABOUT&nbsp;US
    
    .flex.w-max.px-2.pt-2(v-if="isNotSearch")
      input(class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500" 
      type="search" placeholder=" " v-model="searchQuery" v-on:keyup.enter="onEnter" style="height: 40px")
      NuxtLink.inline(:to="`/Search/?search=${searchQuery}&isPageList=0`")
        img(src="/CVSearchIcon.png" style="height: 40px")
</template>

<style scoped>
.no-border {
  border: none;
}

.relative {
  position: relative;
}

.button-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.no-border:hover .button-content::before,
.active .button-content::before {
  background-color: green;
}
</style>
