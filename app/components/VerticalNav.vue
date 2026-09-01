<script lang="ts" setup>
import type { User, Page } from "@/types.d.ts"
import { donationFormat, dateFormat } from '@/utils'
import { authClient } from '~/utils/auth-client';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const props = defineProps<{ requireOnboarding: boolean }>();

const isAdvocateAdmin = computed(() => user.value?.role == "admin" || user.value?.role == "advocate")
const isAdmin = computed(() => user.value?.role == "admin")
const pages = ref<Page[]>([])
const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
const toggle = ref(true);

const stripeOnboardingUrl = ref('');
watchEffect(async () => {
  if (props.requireOnboarding) {
    const { data: url, error } = await useFetch('/api/stripe/create_account');
    if (error.value) {
      console.error('Failed to fetch Stripe onboarding URL', error.value);
    } else if (url.value) {
      stripeOnboardingUrl.value = url.value as string;
    }
  }
});

</script>

<template>
  <div class="text-center p-2 pt-32 pr-12 rounded-md border-grey-600 border-r">
    <div
      v-if="user && toggle"
      class="min-w-[116px] gap-2"
    >
      <NavLinkButtonVNav
        :to="`/PageList`"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/page') || route.path.includes('/Page')}"
      >
        <p class="uppercase white mb-2 w-max">
          Pages
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        to="/EditPage/0"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditPage')}"
      >
        <p class="uppercase white mb-2 w-max">
          New page
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/Users"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/Users')}"
      >
        <p class="uppercase white mb-2 w-max">
          Users
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/EmailList"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EmailList')}"
      >
        <p class="uppercase white mb-2 w-max">
          Email List
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/EditUser/0"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditUser')}"
      >
        <p class="uppercase white mb-2 w-max">
          Invite user
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/EditFamily/0"
        :class="{'!text-black border-green-999 bg-white': route.path.includes('/EditFamily')}"
      >
        <p class="uppercase white mb-2 w-max">
          Edit Family
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/Families"
        :class="{'!text-black border-green-999 bg-white': route.path == '/Families'}"
      >
        <p class="uppercase white mb-2 w-max">
          Families
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        to="/"
        :class="{'!text-black border-green-999 bg-white': route.path == '/'}"
      >
        <p class="uppercase white mb-2 w-max">
          Profile
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        to="/Donations"
        :class="{'!text-black border-green-999 bg-white': route.path == '/Donations'}"
      >
        <p class="uppercase white mb-2 w-max">
          Donations
        </p>
      </NavLinkButtonVNav>
      <NavLinkButtonVNav
        v-if="isAdvocateAdmin"
        to="/FamilyReports"
        :class="{'!text-black border-green-999 bg-white': route.path == '/FamilyReports'}"
      >
        <p class="uppercase white mb-2 w-max">
          Family Reports
        </p>
      </NavLinkButtonVNav>
    </div>
    <div v-if="requireOnboarding && stripeOnboardingUrl" class="mt-4 w-[116px]">
      <div class="p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg flex flex-col items-start">
        <ExclamationTriangleIcon class="h-5 w-5 mr-2 shrink-0" />
        <div class="text-left">
          <p class="text-sm">You need to setup Stripe <a :href="stripeOnboardingUrl" class="underline font-bold">Click here to continue</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

