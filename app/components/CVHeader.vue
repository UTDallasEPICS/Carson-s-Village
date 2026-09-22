<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user )

const isAdvocateAdmin = computed(() => user.value.role == "admin" || user.value.role == "advocate")
const isAdmin = computed(() => user.value.role == "admin")
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
const toggle = ref(false);

const onEnter = async() => {
  // Navigate to the search page with the entered query
  await navigateTo (`/Search/?search=${searchQuery.value}&isPageList=0`);
  
}

async function handleLogout() {
  await authClient.signOut()

  if (isNotSearch.value) await navigateTo('/Search/?search=')
}
</script>

<template>
  <ClientOnly>
    <div class="max-w-min mx-auto flex items-center gap-2 text-center">
      <div
        v-if="user"
        class="max-w-min mx-auto flex items-center gap-2"
      >
        <a
          class="w-20 flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
          target="blank"
          href="https://carsonsvillage.org"
        ><img
          class="w-20 h-14"
          src="/CVLogo.png"
        ></a>
        <div
          class="flex items-center pt-5 px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
          @click.prevent="handleLogout"
        >
          <p class="uppercase white w-max font-bold text-orange-999">
            LOGOUT
          </p>
        </div>
        <DropdownMenu
          :has-submenus="true"
          :num-submenus="4"
          :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]"
          :dropdown-min-width="200"
        >
          RESOURCES
        </DropdownMenu>
        <NavLinkButton
          to="https://carsonsvillage.org/get-involved/"
          target="_blank"
        >
          <p class="uppercase white w-max text-black-999">
            GET INVOLVED
          </p>
        </NavLinkButton>
        <DropdownMenu
          :has-submenus="true"
          :num-submenus="6"
          :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]"
          :dropdown-min-width="150"
          :nested-dropdown-min-width="150"
        >
          ABOUT&nbsp;US
        </DropdownMenu>
      </div>
      <div
        v-else
        class="max-w-min mx-auto flex items-center gap-2"
      >
        <a
          class="w-20 flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:text-black bg-white"
          target="blank"
          href="https://carsonsvillage.org"
        ><img
          class="w-20 h-14"
          src="/CVLogo.png"
        ></a>
        <a
          class="flex items-center pt-5 px-2 py-2 text-sm font-medium rounded-md text-blue-999 cursor-pointer hover:!text-black bg-white"
          href="/login"
        >
          <p class="uppercase white w-max font-bold text-orange-999">
            LOGIN
          </p>
        </a>
        <DropdownMenu
          :has-submenus="true"
          :num-submenus="4"
          :submenus="[{ title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' }, { title: 'Resource Library', to: 'http://carsonsvillage.org/resource-library' }, { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' }, { title: 'Find Support', to: 'https://carsonsvillage.org/support/' }]"
          :dropdown-min-width="200"
        >
          RESOURCES
        </DropdownMenu>
        <NavLinkButton
          to="https://carsonsvillage.org/get-involved/"
          target="_blank"
        >
          <p class="pl-2 uppercase white w-max text-black-999">
            GET INVOLVED
          </p>
        </NavLinkButton>
        <DropdownMenu
          :has-submenus="true"
          :num-submenus="6"
          :submenus="[{ title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' }, { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' }, { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' }, { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' }, { title: 'Our Team >', submenus: [{ title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' }, { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' }, { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' }]}, { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' }]"
          :dropdown-min-width="150"
          :nested-dropdown-min-width="150"
        >
          ABOUT&nbsp;US
        </DropdownMenu>
      </div>
      <div
        v-if="isNotSearch"
        class="flex items-center w-max px-2 mt-3"
      >
        <input
          v-model="searchQuery"
          class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500 h-10"
          type="search"
          placeholder=" "
          @keyup.enter="onEnter"
        >
        <NuxtLink
          class="inline flex items-center"
          :to="`/Search/?search=${searchQuery}&isPageList=0`"
        >
          <img
            class="h-10"
            src="/CVSearchIcon.png"
          >
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.no-border {
  border: none;
}

.relative {
  position: relative;
}

</style>
