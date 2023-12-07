<script lang = "ts" setup>
import type { Page, User } from '@/types.d.ts'
import { dateFormat, donationFormat} from '@/utils'
import { RoutingRuleFilterSensitiveLog } from '@aws-sdk/client-s3'
import { Family } from '@prisma/client'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

/*
*   Ofek Shaltiel
*	  ECS 3200
*	  Carson's Village: Automated Family Page
*	  PageList.vue 
*		Shows a list of pages for a specific user based on their cuid
*		Located under "/PageList/"
*/

const family_cuid = ref("")
const router = useRoute()
const family_cuid_data = computed(() => router.params.id)
family_cuid.value = family_cuid_data.value as string;
const user_cuid_data = computed(() => router.params.id)
const user_cuid = user_cuid_data.value as string
const pages = ref<Page[]>([])
const cvuser = useCookie<User>('cvuser')
const isAdmin = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin")
const isAdvocate = computed(() => cvuser.value?.user_role == "advocate");
const data = ref<User>({
  cuid: "",
  first_name: "",
  last_name: "",
  user_role: "{}",
  email: "",
  middle_name: "",
  phone: "",
  Pages: [],
  familyCuid: ""
  //PageDonations: [],
  //DonationPayouts: []
})
const isFamily = ref(false)
const familyCuid = ref("")
const data_families = ref<Family[]>([])
const fromUser = computed(() => router.query.fromUsers as string == '1')
console.log(router.query.fromUsers)
// Method to populate the page list with databased on the cuid of the user in the url
const getDataPageList = async () => {
  if(cvuser.value.user_role == "advocate" || cvuser.value.user_role == "admin"){
  /*const { data: pagesData } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { family_cuid }
  })*/
  // extracting the families that the advocate is responsible for
  const { data: advocateFamilies } = await useFetch('/api/user', {
    method: 'GET',
    query: { cuid: user_cuid },
    default() {
      return [] as any
    }
  })

 data_families.value = advocateFamilies.value?.AdvocateFamily as unknown as Family[]
  console.log(fromUser.value)
  if(fromUser.value) {
    const { data: family_pages } = await useFetch('/api/family_pages', {
    method: 'GET',
    query: { family_cuid },
    default() {
      return [] as any
    }
  }) 
  pages.value = family_pages.value as unknown as Page[]

  } 
} else if(cvuser.value.familyCuid === family_cuid.value ){
  const { data: family_pages } = await useFetch('/api/family_pages', {
    method: 'GET',
    query: { family_cuid },
    default() {
      return [] as any
    }
  }) 

  pages.value = (family_pages.value) as unknown as Page[]
}
  const isEmpty = computed(() => pages.value.length == 0)
  
  if(fromUser.value && (cvuser.value.user_role == "advocate" || cvuser.value.user_role == "admin")) {
    const { data: familyData } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { user_cuid },
    default() {
      return [] as any
    }
  })
  pages.value = (familyData.value) as unknown as Page[]
  }
}

const { data: family_pages } = await useFetch('/api/family_pages', {
    method: 'GET',
    query: { family_cuid: familyCuid, excuse: cvuser.value.user_role == 'family' },
    watch: [ familyCuid ],
    default() {
      return [] as any
    }
    
  })

  
  /*
    // For winter clean up
    prisma.page.FindMany({
      where: { 
        Family: {
          User: { cuid: body.cuid}
        }
      }
    })
  */
  //pages.value = family_pages.value as unknown as Page[]
//watchEffect(() => familyCuid.value = data_families.value![0]?.cuid || "");
  //pages.value = familyData.value?.Pages as unknown as Page[]
const currentFamily = computed(() => data_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});

await getDataPageList()
</script>

<template lang ="pug">
.py-4.grid(class="sm:grid-cols-3" v-if="isAdmin && !fromUser")
    CVLabel Family
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
      Listbox.shadow-sm.border.border-1.rounded-lg(v-if="isAdmin" as='div' v-model="familyCuid")
        .relative
          Transition(
                    leave-active-class='transition ease-in duration-100'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                    )
            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                ListboxOption(as='div' v-for="family in data_families" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
          ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to view pages from' }}  
.mx-auto.mt-1(class="w-11/12 sm:w-[1200px]" v-if="!isAdmin || fromUser")
  table(style="table-layout: auto;")
    thead
      tr
        th.font-poppins.font-bold.p-2(style="color:white;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); overflow: hidden; border-radius: 60px 0px 0px 0px; width:30%; ")  Page Name
        th.font-poppins.font-bold.overflow-hidden(v-if="isAdmin" style="color: white; width:15%;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User ID
        th.font-poppins.font-bold(style="color:white; width:35%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation Deadline
        th.font-poppins.font-bold(style="width:10%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); color: rgb(110 171 191 / var(--tw-bg-opacity));")  {{ "_______________________" }}
        th.font-poppins.font-bold(style="border-radius: 0px 60px 0px 0px; width:20%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));color:rgb(110 171 191 / var(--tw-bg-opacity));") {{ "_____________" }}
      tr(v-for="(item, i) in pages" 
      :key="i" 
      :class="{'bg-gray-200': (i+1) % 2}"
      )
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ item.page_name }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;" v-if="isAdmin") {{ item.userCuid }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ dateFormat(item.deadline) }}
        td
          LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
        td
          LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
  .container.bg-blue-300.mx-auto(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); height: 50px; border-radius: 0px 0px 60px 60px;")


.mx-auto.mt-1(class="w-11/12 sm:w-[1200px]" v-if="!fromUser && isAdmin")
  table(style="table-layout: auto;")
    thead
      tr
        th.font-poppins.font-bold.p-2(style="color:white;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); overflow: hidden; border-radius: 60px 0px 0px 0px; width:30%; ")  Page Name
        th.font-poppins.font-bold.overflow-hidden(v-if="isAdmin" style="color: white; width:15%;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User ID
        th.font-poppins.font-bold(style="color:white; width:35%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation Deadline
        th.font-poppins.font-bold(style="width:10%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); color: rgb(110 171 191 / var(--tw-bg-opacity));")  {{ "_______________________" }}
        th.font-poppins.font-bold(style="border-radius: 0px 60px 0px 0px; width:20%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));color:rgb(110 171 191 / var(--tw-bg-opacity));") {{ "_____________" }}
      tr(v-for="(item, i) in family_pages" 
      :key="i" 
      :class="{'bg-gray-200': (i+1) % 2}"
      )
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ item.page_name }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;" v-if="isAdmin") {{ item.userCuid }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ dateFormat(item.deadline) }}
        td
          LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
        td
          LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
  .container.bg-blue-300.mx-auto(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>		