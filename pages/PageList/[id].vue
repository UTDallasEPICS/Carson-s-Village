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


// todo: clean up and finish advocate managment system functionality to page list
const family_cuid = ref("")
const router = useRoute()
const family_cuid_data = computed(() => router.params.id)
family_cuid.value = family_cuid_data.value as string;
const user_cuid_data = computed(() => router.params.id)
const user_cuid = user_cuid_data.value as string
const pages = ref<Page[]>([])
const cvuser = useCookie<User>('cvuser')
const user_cuid2 = cvuser.value.cuid
const isAdmin = computed(() => cvuser.value?.user_role == "admin")
const isAdvocate = computed(() => cvuser.value?.user_role == "advocate");
const currentPage = ref(0)
const totalLength = ref(0)

const data = ref<User>({
  cuid: "",
  first_name: "",
  last_name: "",
  user_role: "",
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

// Method to populate the page list with data based on the cuid of the user in the url
const getDataPageList = async () => {
  if(cvuser.value.user_role == "admin") {
    const { data: pagesData } = await useFetch('/api/pages', {
      method: 'GET',
      query: { searchQuery: ref(""), page_number: currentPage, isPageList: 1 }
    })
    pages.value = pagesData.value?.data as unknown as Page[]
    totalLength.value = pagesData.value?.Pagination.total as unknown as number
  }

  if(cvuser.value.user_role == "advocate"){
    // extracting the families that the advocate is responsible for
    const { data: advocateFamilies } = await useFetch('/api/user', {
      method: 'GET',
      query: { cuid: user_cuid },
      default() {
        return [] as any
      }
    })
    data_families.value = advocateFamilies.value?.AdvocateFamily as unknown as Family[]
    
    // handles request to show the family pages created by a user. 
    if(fromUser.value) {
      const { data: family_pages } = await useFetch('/api/family_pages', {
      method: 'GET',
      query: { family_cuid, page_number: currentPage },
      default() {
        return [] as any
      }
    }) 
      pages.value = family_pages.value.data as unknown as Page[]
      totalLength.value = family_pages.value.Pagination.total as unknown as number
    } 
  // handles the family pages of a family member
  } else if(cvuser.value.familyCuid === family_cuid.value ){
    const { data: family_pages } = await useFetch('/api/family_pages', {
      method: 'GET',
      query: { family_cuid, page_number: currentPage },
      default() {
        return [] as any
      }
    }) 
    pages.value = (family_pages.value.data) as unknown as Page[]
    totalLength.value = family_pages.value.Pagination.total as unknown as number
  }
    const isEmpty = computed(() => pages.value.length == 0)
    const entityCuid = computed(() => fromUser.value ? user_cuid : family_cuid)
    //  handles the family pages an advocate made themselves, do not admin back into if statement, it will crash
    if(cvuser.value.user_role == "advocate" ) {
        const { data: familyData } = await useFetch('/api/page_list', {
        method: 'GET',
        query: { cuid: entityCuid, page_number: currentPage },
        default() {
          return [] as any
        }
      })
        pages.value = (familyData.value.data) as unknown as Page[]
        totalLength.value = familyData.value.Pagination.total as unknown as number
  }
}

// handles changes of family selected for advocates or admins
const { data: family_pages } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { cuid: familyCuid, page_number: currentPage },
    watch: [ familyCuid ],
    default() {
      return [] as any
    }
  })
const totalLength2 = computed(() => family_pages.value?.Pagination.total as unknown as number)
  

  // Todo: Talk to Taz about this
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

const nextPage = () => { 
    if(currentPage.value < Math.max(((totalLength.value / 12) - 1), ((totalLength2.value / 12) - 1))){
        currentPage.value++
        if(fromUser.value || cvuser.value.user_role == "family" || isAdmin)
          getDataPageList()
    } 
}

const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
        if(fromUser.value || cvuser.value.user_role == "family" || isAdmin)
          getDataPageList()
    } 
}
const currentFamily = computed(() => data_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});


await getDataPageList()
</script>

<template lang ="pug">
TitleComp.border-1.border-black  Pages
a.mr-2.mt-1.p-1.px-4.pt-2.pb-2.bg-orange-999.float-right.w-24.ml-auto(class="transition duration-300 bg-orange-999 hover:bg-green-600" style="border-radius: 100px; height: 40px; color: white; font-weight: 700;") Archive
.container.flex.justify-between.items-center.mx-auto.my-4
  .py-4.grid(class="sm:grid-cols-3" v-if="isAdvocate && !fromUser")
    CVLabel Family
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
      Listbox.shadow-sm.border.border-1.rounded-lg(v-if="isAdmin || isAdvocate" as='div' v-model="familyCuid")
        .relative
  .py-4.grid(class="sm:grid-cols-3" v-if="isAdvocate && !fromUser")
      CVLabel Family
      .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        Listbox.shadow-sm.border.border-1.rounded-lg(v-if="isAdmin || isAdvocate" as='div' v-model="familyCuid")
          .relative
            Transition(
                    leave-active-class='transition ease-in duration-100'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                    )
              ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                  ListboxOption(as='div' v-for="family in data_families" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
            ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to view pages from' }}  
  //todo: reduce this to one table
  .mx-auto.mt-4(class="w-11/12 sm:w-[1200px]" v-if="!isAdvocate || isAdmin || fromUser")
    table(style="table-layout: auto;")
      thead
        tr
          th.font-poppins.font-bold.p-2(style="color:white;--tw-bg-opacity: 1; background-color: #5aadc2; overflow: hidden; border-radius: 60px 0px 0px 0px; width:30%; ")  Page Name
          th.font-poppins.font-bold(style="color:white; width:35%; --tw-bg-opacity: 1; background-color: #5aadc2;") Donation Deadline
          th.font-poppins.font-bold(style="width:10%; --tw-bg-opacity: 1; background-color: #5aadc2; color: #5aadc2;")  {{ "_______________________" }}
          th.font-poppins.font-bold(style="border-radius: 0px 60px 0px 0px; width:20%; --tw-bg-opacity: 1; background-color: #5aadc2;color:#5aadc2;") {{ "_____________" }}
        tr(v-for="(item, i) in pages" 
        :key="i" 
        :class="{'bg-gray-200': (i+1) % 2}"
        )
          td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ item.page_first_name + " " + item.page_last_name }}
          //- td.font-poppins.text-gray-dark.font-bold(style="text-align: center;" v-if="isAdmin") {{ item.userCuid }}
          td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ dateFormat(item.deadline) }}
          td
            LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="--tw-bg-opacity: 1; white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
          td
            LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="--tw-bg-opacity: 1; white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
    .container.bg-blue-300.mx-auto.mt(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: #5aadc2; height: 50px; border-radius: 0px 0px 60px 60px;")

.mx-auto.mt-1(class="w-11/12 sm:w-[1200px]" v-if="!fromUser && isAdvocate")
  table(style="table-layout: auto;")
    thead
      tr
        th.font-poppins.font-bold.p-2(style="color:white;--tw-bg-opacity: 1; background-color: #5aadc2; overflow: hidden; border-radius: 60px 0px 0px 0px; width:30%; ") 
          button(@click="toggleSort('page_name')") Page Name
        th.font-poppins.font-bold(style="color:white; width:35%; --tw-bg-opacity: 1; background-color: #5aadc2;") 
          button(@click="toggleSort('donation_deadline')") Donation Deadline
        th.font-poppins.font-bold(style="width:10%; --tw-bg-opacity: 1; background-color: #5aadc2; color: #5aadc2;")  {{ "_______________________" }}
        th.font-poppins.font-bold(style="border-radius: 0px 60px 0px 0px; width:20%; --tw-bg-opacity: 1; background-color: #5aadc2;color: #5aadc2;") {{ "_____________" }}
      tr(v-for="(item, i) in family_pages.data" 
      :key="i" 
      :class="{'bg-gray-200': (i+1) % 2}"
      )
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ item.page_first_name + " " + item.page_last_name }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;" v-if="isAdmin") {{ item.userCuid }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center;") {{ dateFormat(item.deadline) }}
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="--tw-bg-opacity: 1; white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="--tw-bg-opacity: 1; white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
          .container.bg-blue-300.mx-auto.mt-4(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: #5aadc2; height: 50px; border-radius: 0px 0px 60px 60px;").mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
  .col-md-10.px-2.mt-2
      button(@click="prevPage") &lt
  .col-md-10.px-2.mt-2
      p {{  currentPage + 1 }}
  .col-md-10.px-2.mt-2
      button(@click="nextPage") >
</template>

<style scoped></style>		