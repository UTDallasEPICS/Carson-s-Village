<script lang="ts" setup>
import { authClient } from '~/utils/auth-client'
import {
  DocumentTextIcon,
  DocumentPlusIcon,
  UsersIcon,
  UserPlusIcon,
  HomeIcon,
  BuildingOffice2Icon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

const { data } = await authClient.useSession(useFetch)
const user = computed(() => data.value?.user || null)

const isAdvocateAdmin = computed(() => user.value?.role == 'admin' || user.value?.role == 'advocate')
const canInviteUser = computed(() =>
  isAdvocateAdmin.value || (user.value?.role == 'family' && !!user.value?.familyId)
)
const route = useRoute()
const expanded = ref(false)

type NavItem = {
  to: string
  label: string
  icon: Component
  show?: boolean
  active: boolean
}

const items = computed<NavItem[]>(() => {
  const path = route.path
  return [
    {
      to: '/PageList',
      label: 'Pages',
      icon: DocumentTextIcon,
      active: path.includes('/page') || path.includes('/Page'),
    },
    {
      to: '/EditPage/0',
      label: 'New page',
      icon: DocumentPlusIcon,
      active: path.includes('/EditPage'),
    },
    {
      to: '/Users',
      label: 'Users',
      icon: UsersIcon,
      show: isAdvocateAdmin.value,
      active: path.includes('/Users'),
    },
    {
      to: '/EditUser/0',
      label: 'Invite user',
      icon: UserPlusIcon,
      show: canInviteUser.value,
      active: path.includes('/EditUser'),
    },
    {
      to: '/EditFamily/0',
      label: 'Edit Family',
      icon: HomeIcon,
      show: isAdvocateAdmin.value,
      active: path.includes('/EditFamily'),
    },
    {
      to: '/Families',
      label: 'Families',
      icon: BuildingOffice2Icon,
      show: isAdvocateAdmin.value,
      active: path == '/Families',
    },
    {
      to: '/',
      label: 'Profile',
      icon: UserIcon,
      active: path == '/',
    },
    {
      to: '/Donations',
      label: 'Donations',
      icon: CurrencyDollarIcon,
      active: path == '/Donations',
    },
    {
      to: '/FamilyReports',
      label: 'Family Reports',
      icon: ChartBarIcon,
      show: isAdvocateAdmin.value,
      active: path == '/FamilyReports',
    },
  ].filter((item) => item.show !== false)
})
</script>

<template>
  <!-- Flow spacer: full page height, collapsed width only -->
  <aside class="relative hidden w-14 shrink-0 self-stretch lg:block">
    <!-- Expand panel overlays content; height matches page column -->
    <div
      class="absolute inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-in-out"
      :class="expanded ? 'w-52 shadow-[4px_0_16px_rgba(0,0,0,0.08)]' : 'w-14'"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <nav class="flex w-52 min-w-52 flex-col gap-1 pt-3 pb-4">
        <NuxtLink
          v-for="item in items"
          :key="item.to + item.label"
          :to="item.to"
          class="group relative mx-1.5 flex items-center gap-3 rounded-md px-2.5 py-2 text-gray-999 no-underline transition-colors duration-200 hover:bg-gray-100 hover:text-black"
          :class="{ 'bg-gray-100 text-black': item.active }"
        >
          <span
            class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-sm bg-green-999 opacity-0 transition-opacity group-hover:opacity-100"
            :class="{ 'opacity-100': item.active }"
          />
          <component
            :is="item.icon"
            class="h-[1.35rem] w-[1.35rem] shrink-0"
            aria-hidden="true"
          />
          <span
            class="whitespace-nowrap text-[0.8rem] font-semibold uppercase transition-opacity duration-150"
            :class="expanded ? 'opacity-100' : 'opacity-0'"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>
    </div>
  </aside>
</template>
