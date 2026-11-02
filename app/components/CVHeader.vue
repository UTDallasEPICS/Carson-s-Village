<script lang="ts" setup>
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user)

const searchQuery = ref('');
const route = useRoute()
const isNotSearch = computed(() => route.path !== "/Search/")
const showSearch = ref(false)
const searchRoot = ref<HTMLElement | null>(null)

function onDocClick(event: MouseEvent) {
  if (!showSearch.value) return
  const target = event.target as Node | null
  if (searchRoot.value && target && !searchRoot.value.contains(target)) {
    showSearch.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const resourceSubmenus = [
  { title: 'Timeline of Important Events', to: 'https://carsonsvillage.org/timeline-of-events/' },
  { title: 'Resource Library', to: 'https://carsonsvillage.org/resource-library' },
  { title: 'Group Support', to: 'https://carsonsvillage.org/grief-group-support/' },
  { title: 'Find Support', to: 'https://carsonsvillage.org/support/' },
]

const getInvolvedSubmenus = [
  { title: 'Donate Funds', to: 'https://carsonsvillage.org/get-involved/donate-money/' },
  { title: 'Volunteer', to: 'https://carsonsvillage.org/get-involved/donate-time/' },
  { title: "Shop Carson's Village", to: 'https://www.teepublic.com/user/carson-s-village' },
  { title: 'Golf Tournament', to: 'https://carsonsvillage.org/carsons-village-golf-tournament/' },
  { title: 'MSW Internship', to: 'https://carsonsvillage.org/msw-internship/' },
]

const aboutUsSubmenus = [
  { title: 'Our Story', to: 'https://carsonsvillage.org/about-us/our-family/' },
  { title: 'Our Testimonies', to: 'https://carsonsvillage.org/our-testimonials/' },
  { title: 'In The News', to: 'https://carsonsvillage.org/about-us/in-the-news/' },
  { title: 'Newsletter Archive', to: 'https://carsonsvillage.org/about-us/newsletter-archive/' },
  {
    title: 'Our Team',
    submenus: [
      { title: 'Advocates', to: 'https://carsonsvillage.org/about-us/advocates/' },
      { title: 'Clinical Consultants', to: 'https://carsonsvillage.org/about-us/clinical-consultants/' },
      { title: 'Support Team', to: 'https://carsonsvillage.org/about-us/meet-our-team/' },
    ],
  },
  { title: 'Board of Directors', to: 'https://carsonsvillage.org/about-us/board-of-directors/' },
]

const onEnter = async () => {
  await navigateTo(`/Search/?search=${searchQuery.value}&isPageList=0`);
}

async function handleLogout() {
  await authClient.signOut()
  if (isNotSearch.value) await navigateTo('/Search/?search=')
}
</script>

<template>
  <ClientOnly>
    <header class="cv-header w-full bg-white">
      <!-- Compact top bar (live site ~58px; we use ~36px) -->
      <div class="cv-top-bar flex items-center justify-between gap-3 px-4 sm:px-6 bg-blue-999 text-white h-9">
        <div class="flex items-center gap-3 shrink-0">
          <a
            href="https://www.facebook.com/carsonsvillage/"
            target="_blank"
            rel="noopener noreferrer"
            title="facebook"
            class="opacity-90 hover:opacity-100"
            aria-label="Facebook"
          >
            <svg
              class="w-3.5 h-3.5 fill-white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            ><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H17l-.4 3h-2.3v7A10 10 0 0 0 22 12z" /></svg>
          </a>
          <a
            href="https://www.instagram.com/carsonsvillage/"
            target="_blank"
            rel="noopener noreferrer"
            title="instagram"
            class="opacity-90 hover:opacity-100"
            aria-label="Instagram"
          >
            <svg
              class="w-3.5 h-3.5 fill-white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            ><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>
          </a>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <a
            class="cv-top-btn"
            href="https://carsonsvillage.org/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CONTACT US
          </a>
          <button
            v-if="user"
            type="button"
            class="cv-top-btn"
            @click.prevent="handleLogout"
          >
            LOGOUT
          </button>
          <a
            v-else
            class="cv-top-btn"
            href="/login"
          >
            LOGIN
          </a>
        </div>
      </div>

      <!-- Main nav (live site ~140px; we use ~64px) -->
      <div class="cv-main-bar flex items-center gap-2 sm:gap-4 px-3 sm:px-6 h-16 border-b border-gray-100">
        <NuxtLink
          class="shrink-0 flex items-center"
          to="/"
        >
          <img
            class="h-12 w-auto object-contain"
            src="/CVLogo.png"
            alt="Carson's Village"
          >
        </NuxtLink>

        <nav class="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1 min-w-0">
          <NavLinkButton to="/">
            HOME
          </NavLinkButton>
          <DropdownMenu
            :has-submenus="true"
            :submenus="resourceSubmenus"
            :dropdown-min-width="200"
          >
            RESOURCES
          </DropdownMenu>
          <DropdownMenu
            :has-submenus="true"
            :submenus="getInvolvedSubmenus"
            :dropdown-min-width="160"
            :nested-dropdown-min-width="150"
          >
            GET INVOLVED
          </DropdownMenu>
          <DropdownMenu
            :has-submenus="true"
            :submenus="aboutUsSubmenus"
            :dropdown-min-width="160"
            :nested-dropdown-min-width="150"
          >
            ABOUT&nbsp;US
          </DropdownMenu>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
          <div
            v-if="isNotSearch"
            ref="searchRoot"
            class="relative flex items-center"
          >
            <button
              type="button"
              class="p-1"
              aria-label="Search"
              @click.stop="showSearch = !showSearch"
            >
              <img
                class="h-9 w-9 object-contain"
                src="/CVSearchIcon.png"
                alt=""
              >
            </button>
            <div
              v-if="showSearch"
              class="absolute right-0 top-full mt-1 flex items-center bg-white shadow border border-gray-200 z-20"
            >
              <input
                v-model="searchQuery"
                class="border-0 py-1.5 px-3 text-sm focus:outline-none w-40 sm:w-52"
                type="search"
                placeholder="Search"
                autofocus
                @keyup.enter="onEnter"
              >
              <NuxtLink
                class="inline-flex items-center px-2"
                :to="`/Search/?search=${searchQuery}&isPageList=0`"
              >
                <img
                  class="h-9"
                  src="/CVSearchIcon.png"
                  alt="Go"
                >
              </NuxtLink>
            </div>
          </div>

          <a
            class="cv-donate-btn"
            href="https://carsonsvillage.org/get-involved/donate/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DONATE TO CARSON'S VILLAGE
          </a>
        </div>
      </div>

      <!-- Mobile nav -->
      <nav class="md:hidden flex items-center justify-center gap-4 px-2 py-2 border-b border-gray-100 overflow-x-auto">
        <NavLinkButton to="/">
          HOME
        </NavLinkButton>
        <DropdownMenu
          :has-submenus="true"
          :submenus="resourceSubmenus"
          :dropdown-min-width="200"
        >
          RESOURCES
        </DropdownMenu>
        <DropdownMenu
          :has-submenus="true"
          :submenus="getInvolvedSubmenus"
          :dropdown-min-width="160"
        >
          GET INVOLVED
        </DropdownMenu>
        <DropdownMenu
          :has-submenus="true"
          :submenus="aboutUsSubmenus"
          :dropdown-min-width="160"
          :nested-dropdown-min-width="150"
        >
          ABOUT&nbsp;US
        </DropdownMenu>
      </nav>
    </header>
  </ClientOnly>
</template>

<style scoped>
.cv-top-btn {
  display: inline-block;
  background: #fff;
  color: #cd6636;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 7px 16px;
  border-radius: 3px;
  line-height: 1.2;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.cv-top-btn:hover {
  opacity: 0.92;
}

.cv-donate-btn {
  display: inline-block;
  background: #cd6636;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 9px 16px;
  border-radius: 3px;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
}

.cv-donate-btn:hover {
  background: #b8572c;
}
</style>
