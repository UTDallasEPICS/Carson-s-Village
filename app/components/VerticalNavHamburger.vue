<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user )

const props = defineProps<{ hamburgerOpen: boolean }>()
const isAdvocateAdmin = computed(() => user.value.role == "admin" || user.value.role == "advocate")
const isAdmin = computed(() => user.value.role == "admin")
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
const toggle = ref(true);

const onEnter = async() => {
  // Navigate to the search page with the entered query
  await navigateTo (`/Search/?searchbr
        .bar.mx-9(style="border-top: 0.5px solid #646464;")=${searchQuery.value}&isPageList=0`);
  
}
</script>

<template>
  <div
    v-if="hamburgerOpen"
    class="text-center p-2 pt-32 pr-12"
  >
    <div
      v-if="user && toggle"
      class="gap-2"
    >
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        :to="`/PageList`"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/page') || route.path.includes('/Page')}"
      >
        <p class="uppercase white mb-2 w-max">
          Pages
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        to="/EditPage/0"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditPage')}"
      >
        <p class="uppercase white mb-2 w-max">
          New page
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        to="/Users"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/Users')}"
      >
        <p class="uppercase white mb-2 w-max">
          Users
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        to="/EmailList"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EmailList')}"
      >
        <p class="uppercase white mb-2 w-max">
          Email List
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        to="/EditUser/0"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditUser')}"
      >
        <p class="uppercase white mb-2 w-max">
          Invite user
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        to="/EditFamily"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditFamily')}"
      >
        <p class="uppercase white mb-2 w-max">
          Edit Family
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        to="/"
        :class="{'!text-black border-green-999 bg-white': route.path == '/'}"
      >
        <p class="uppercase white mb-2 w-max">
          Profile
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        to="/Donations"
        :class="{'!text-black border-green-999 bg-white': route.path == '/Donations'}"
      >
        <p class="uppercase white mb-2 w-max">
          Donations
        </p>
      </NavLinkButtonHamburger>
      <div
        class="bar mx-20"
        style="border-top: 0.5px solid #646464;"
      />
      <NavLinkButtonHamburger
        v-if="isAdvocateAdmin"
        to="/FamilyReports"
        :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyReports'}"
      >
        <p class="uppercase white mb-2 w-max">
          Family Reports
        </p>
      </NavLinkButtonHamburger>
    </div>
  </div>
</template>

