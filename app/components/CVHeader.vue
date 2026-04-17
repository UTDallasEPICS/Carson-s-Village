<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'

const props = defineProps<{ hamburgerOpen: boolean }>()
const emit = defineEmits(["hamburger"])
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

const handleHamburgerClick = () => {
  emit('hamburger', !props.hamburgerOpen)
}

</script>

<template lang="pug">
ClientOnly
  div(class="max-w-min mx-auto pt-3 flex items-center gap-2 mt-7 text-center")
    div(class="max-w-min mx-auto flex items-center gap-2" v-if="isLoggedIn")
      a(class="w-20 flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
        target="blank"
        href="https://carsonsvillage.org"
      )
        img(class="w-20 h-14" src="/CVLogo.png")
      a(class="flex items-center pt-5 px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
        href="/api/logout"
      )
        p(class="uppercase white w-max font-bold text-orange-999") LOGOUT
      DropdownMenu(:has-submenus="true" :num-submenus="4"
        :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]" :dropdownMinWidth="200")
        | RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/' target="_blank")
        p(class="uppercase white w-max text-black-999") GET INVOLVED
      DropdownMenu(:has-submenus="true" :num-submenus="6"
        :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]" :dropdownMinWidth="150" :nestedDropdownMinWidth="150")
        | ABOUT&nbsp;US
      button(class="flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white lg:hidden mt-3"
        @click="handleHamburgerClick"
      )
        p(class="uppercase white w-max font-bold") |||

    div(class="max-w-min mx-auto flex items-center gap-2" v-else)
      a(class="w-20 flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
        target="blank"
        href="https://carsonsvillage.org"
      )
        img(class="w-20 h-14" src="/CVLogo.png")
      a(class="flex items-center pt-5 px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:!text-black bg-white"
        href="/login"
      )
        p(class="uppercase white w-max font-bold text-orange-999") LOGIN
      DropdownMenu(:has-submenus="true" :num-submenus="4"
        :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]" :dropdownMinWidth="200")
        | RESOURCES
      NavLinkButton(to='https://carsonsvillage.org/get-involved/' target="_blank")
        p(class="pl-2 uppercase white w-max text-black-999") GET INVOLVED
      DropdownMenu(:has-submenus="true" :num-submenus="6"
        :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]" :dropdownMinWidth="150" :nestedDropdownMinWidth="150")
        | ABOUT&nbsp;US
      button(class="flex items-center px-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white lg:hidden"
        @click="handleHamburgerClick"
      )
        p(class="uppercase white w-max font-bold pl-2") |||

    div(class="flex items-center w-max px-2 mt-3" v-if="isNotSearch")
      input(class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500 h-10"
        type="search"
        placeholder=" "
        v-model="searchQuery"
        v-on:keyup.enter="onEnter"
      )
      NuxtLink(class="inline flex items-center" :to="`/Search/?search=${searchQuery}&isPageList=0`")
        img(class="h-10" src="/CVSearchIcon.png")
</template>

<style scoped>
.no-border {
  border: none;
}

.relative {
  position: relative;
}

</style>
