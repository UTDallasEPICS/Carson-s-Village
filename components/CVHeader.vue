<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'

// No need to import ref, watch, and useFetch as Nuxt 3 provides them globally
// Assuming useCookie is provided by a Nuxt module you have installed such as @nuxt/auth-next

const cvuser = useCookie<User>('cvuser');
const isAdmin = computed(() => cvuser.value?.user_role === "advocate");
const cuid = computed(() => cvuser.value?.cuid);
const isLoggedIn = computed(() => !!cvuser.value);
const pages = ref<Page[]>([]);
const searchQuery = ref('');
const route = useRoute();
const isNotSearch = computed(() => route.path !== "/Search/");

// Define a method for logout if needed
const logout = () => {
  // Your logout logic here
};
</script>

<template lang="pug">
ClientOnly
  .max-w-min.mx-auto.flex.gap-2
    div.max-w-min.mx-auto.flex.gap-2(v-if="isLoggedIn")
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
        style="border: 1px solid #c4c4c4;"
        class='hover:text-white hover:bg-gray-600'  
        @click="logout"
      )
        p.uppercase.white.w-max LOGOUT
      NavLinkButton(:to="`/PageList/${cuid.value}`")
        p.uppercase.white.w-max(v-if="isAdmin") Pages
        p.uppercase.white.w-max(v-else) Pages
      NavLinkButton(to='/EditPage/0')
        p.uppercase.white.w-max New page
      NavLinkButton(v-if="isAdmin" to='/Users')
        p.uppercase.white.w-max Users
      NavLinkButton(v-if="isAdmin" to='/EditUser/0')
        p.uppercase.white.w-max Invite user
      NavLinkButton(to="/")
        p.uppercase.white.w-max Home
      NavLinkButton(v-if="isAdmin" to='/FamilyTransactionList')
        p.uppercase.white.w-max Donations
    div.max-w-min.mx-auto.flex.gap-2(v-else)
      a.items-center.px-2.py-2.text-base.font-medium.rounded-md.text-green-600.cursor-pointer(
        style="border: 1px solid #c4c4c4;"
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
      input(
        class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500"
        type="search"
        placeholder="Search"
        v-model="searchQuery"
      )
      NuxtLink(:to="`/Search/?search=${searchQuery}`")
        img(src="/CVSearchIcon.png")
</template>

<style scoped>
  /* Example styles, replace with your actual styles */
  .hover\:text-white:hover {
    color: #fff;
  }
  .hover\:bg-gray-600:hover {
    background-color: #4a5568;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .white {
    color: #fff;
  }
  .w-max {
    width: max-content;
  }
</style>
