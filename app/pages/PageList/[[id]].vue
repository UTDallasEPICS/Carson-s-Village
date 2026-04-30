/*
 *  Ofek Shaltiel
 *	ECS 3200
 *      Carson's Village: Automated Family Page
 *	PageList.vue 
 *	      Shows a list of pages for a specific user based on their cuid
 *	      Located under "/PageList/"
 */

<script lang = "ts" setup>
definePageMeta({
  middleware: ['family-guard']
})

import { dateFormat, donationFormat } from '@/utils'
import type { Page, User, Image, PageDonation, Reply } from '@/types.d.ts'
import type { Family } from '~~/prisma/generated/models'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const tableToggle = ref(false)

const route = useRoute()
const id = computed(() => route.params.id || null);
const pageFetchQuery = computed(() => route.query.fetch);
const isAdmin = computed(() => user.value?.role == "admin")
const isAdvocate = computed(() => user.value?.role == "advocate");
const currentPage = ref(0)
const familyCuid = ref("")
const data_families = ref<Family[]>([])

// Method to populate the page list with data based on the cuid of the user in the url
const getDataAdminAdvocate = async () => {
  if(isAdmin.value) {
    const { data: all_families } = await useFetch('/api/family', {
      method: 'GET',
      default() {
        return [] as any
      }
    })
    data_families.value = all_families.value as unknown as Family[]
  } 
  else if(isAdvocate.value){
    // extracting the families that the advocate is responsible for
    const { data: advocateFamilies } = await useFetch('/api/user', {
      method: 'GET',
      query: { cuid: user.value?.id},
      default() {
        return [] as any
      }
    })
    data_families.value = advocateFamilies.value?.AdvocateFamily as unknown as Family[] || [] as Family[];
  }
}

/*
 *  Dynamically fetches pages based on optional route parameter and query
 *    - If no route parameter, fetches all pages according to authenticated user and role
 *        - Admin: all pages, Advocate: all managed pages, Family: all family pages
 *
 *    - If route parameter and query set to 'user' fetch all pages for user based on route id and authenticated role
 *        - Admin: Get all pages for user, for family users grab family pages, other users grab managed pages
 *        - Advocate: Get all pages for user if user is a family user managed by authenticated advocate
 *        - Family: Get all pages for user if user is the same as the authenticated user (same result as GET api/page)
 *
 *    - If route parameter and query set to 'family' fetch all pages for family based on route id and authenticated role
 *        - Admin: Get all pages for family
 *        - Advocate: Get all pages for family if managed by authenticated advocate
 *        - Family: Get all pages for family if authenticate user is part of that family
 */
const headers = useRequestHeaders(['cookie'])
const { data: pageData, error: pageError } = await useAsyncData(
  // Unique key to prevent cache collisions
  `content-${pageFetchQuery.value || "noQuery"}-${user.value?.role || "noUser"}-pg-${id.value || "noPageId"}-${currentPage.value}`,

  async () => {
    let endpoint = '';

    // if no route parameter fetch according to user
    if (!id.value) {
      endpoint = '/api/page';
    }

    // if route parameter provided but no query to distinguish fetch, then throw error to useAsyncData
    else if (!pageFetchQuery.value) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No query provided to distinguish page fetching',
        fatal: false
      })
    }
    
    // fetch all pages managed by advocate if admin
    else if (!!isAdmin.value && pageFetchQuery.value === 'user') {
      endpoint = `/api/page/user/${id.value}`;
    }

    // fetch all pages for a family
    else if (pageFetchQuery.value === 'family') {
      endpoint = `/api/page/family/${id.value}`
    }

    else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Something went wrong with fetching pages',
        fatal: false
      })
    }

    return await $fetch(endpoint, {
      query: { page_number: currentPage.value },
      method: 'GET',
      headers
    });
  },
  { watch: [id, pageFetchQuery, user, currentPage] }
)
if (pageError.value) {
  console.error(pageError.value.statusMessage)  
}

const pages = computed<Page[]>(() => pageError.value ? [] : pageData.value.pages);
const pagesLength = computed(() => pageError.value ? 0 : pageData.value.pageCount)

watch(familyCuid, () => {
  currentPage.value = 0
})

const nextPage = () => { 
    if(currentPage.value < Math.max(((pagesLength.value / 12) - 1), 0)) {
        currentPage.value++
    }
}

const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
    } 
}

const goToPage = (pageNum: number) => {
  if(pageNum >= 0 &&  pageNum < ((pagesLength.value / 12))) {
        currentPage.value = pageNum 
    } 

}

const currentFamily = computed(() => data_families.value?.find(({ id }: Family) => id == familyCuid.value) || {});

await getDataAdminAdvocate()
</script>

<template lang ="pug">
  
button(type="button" class="ml-4 my-4 text-white px-4 py-2 rounded-full w-32 transition duration-300 bg-orange-999 hover:bg-green-600" @click="tableToggle = !tableToggle") {{ tableToggle ? "all pages" : "archive"}}
div(v-if="(isAdmin || isAdvocate) && pageFetchQuery === 'family'" class="py-4 grid sm:grid-cols-3")
    CVLabel Current Family
    div(class="mx-9 sm:col-span-2 sm:mr-11")
      Listbox(as='div' v-model="familyCuid" class="shadow-sm border border-1 rounded-lg")
        div(class="relative")
          Transition(
                    leave-active-class='transition ease-in duration-100'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                    )
            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                ListboxOption(as='div' v-for="family in data_families" :key="family.id" :value="family.id" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
          ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to view pages from' }}      
div(class="mx-auto mt-1 sm:w-[1200px]")
  table(class="table-auto")
    thead
      tr
        th(class="font-poppins font-bold p-2 bg-blue-999 text-white overflow-hidden rounded-tl-3xl w-[20%]")  Page Name
        th(class="font-poppins font-bold bg-blue-999 text-white w-[10%]") Creating User
        th(class="font-poppins font-bold bg-blue-999 text-white w-[10%]") Advocate 
        th(class="font-poppins font-bold bg-blue-999 text-white w-[10%]") Family 
        th(class="font-poppins font-bold bg-blue-999 text-white w-[10%]") Total Donated
        th(class="font-poppins font-bold bg-blue-999 text-white w-[20%]") Creation Date
        th(class="font-poppins font-bold bg-blue-999 text-white w-[20%]") Donation Deadline
        th(class="font-poppins font-bold bg-blue-999 text-white") Donation Goal
        th(class="font-poppins font-bold bg-blue-999 text-white w-[15%]")  {{ "Page Editor" }}
        th(class="font-poppins font-bold bg-blue-999 text-white rounded-tr-3xl w-[25%]") {{ "Family Page" }}

    tbody 
      tr(v-for="(item, i) in ( tableToggle ? pages.filter(item => item.status == 'active') : pages)" :class="{'bg-gray-200': (i + 1) % 2}")
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.page_first_name + " " + item.page_last_name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.User?.name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Family?.AdvocateResponsible ? (item.Family?.AdvocateResponsible?.first_name + " " + item.Family?.AdvocateResponsible?.last_name) : 'No Advocate assigned'}}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Family?.family_name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ donationFormat(item.amount_raised) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ dateFormat(item.start_date) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ dateFormat(item.deadline) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ donationFormat(item.donation_goal) }}
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]" :to="`/EditPage/${item.id}`") Edit
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]" :to="`/Page/${item.id}`") View
  div(class="w-full max-w-[1200px] h-[50px] rounded-b-3xl bg-blue-999")
div(class="mb-9 py-7 flex flex-wrap gap-2 place-content-center")
  div(class="px-2 mt-2")
    CVChevronLeft(class="text-gray-200 size-4 h-2" :class="{'cursor-pointer size-4 h-2': currentPage !== 0 }" @click="prevPage" :isEnd="currentPage == 0")
  div(class="px-2 mt-2")
    div(class="flex")
      p(v-if="currentPage > 1" @click="goToPage(0)" class="cursor-pointer text-gray-900") {{  1 + "..." }} &nbsp;
      p(v-if="currentPage > 0" @click="goToPage(currentPage - 1)" class="cursor-pointer text-gray-900") {{  currentPage }} &nbsp;
      p(class="cursor-pointer text-gray-900 font-bold") {{  currentPage + 1 }} &nbsp;
      p(v-if="(pagesLength / 12 - currentPage) > 1" @click="goToPage(currentPage + 1 )" class="cursor-pointer text-gray-900") {{  currentPage + 2 }} &nbsp;
      p(v-if="(pagesLength / 12 - currentPage) > 2" @click="goToPage(currentPage + 2)" class="cursor-pointer text-gray-900") {{  currentPage + 3 }} &nbsp;
      p(v-if="(pagesLength / 12 - currentPage) > 3" @click="goToPage(Math.floor(pagesLength / 12))" class="cursor-pointer text-gray-900") {{  "..." + Math.ceil(pageLength / 12) }}
  div(class="px-2 mt-2")
      CVChevronRight(:isEnd="currentPage == Math.floor(pagesLength / 12)" :class="{'cursor-pointer': currentPage + 1 !== Math.ceil(pagesLength / 12)}" @click="nextPage" class="text-gray-900 size-4 h-2")
</template>
