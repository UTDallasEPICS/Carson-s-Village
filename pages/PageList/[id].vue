<script lang = "ts" setup>
import type { Page, User, Image, PageDonation, Reply } from '@/types.d.ts'
import { ref } from "vue";
import type { Family } from '@prisma/client'
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
export type Page2 = {
    page_name: string,
    cuid: string,
    userCuid: string,
    familyCuid: string,
    day_of_birth: Date | string | null,
    day_of_passing: Date | string | null,
    visitation_date: Date | string | null,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date | string | null,
    funeral_description: string,
    funeral_location: string,
    obituary: string,
    deadline: Date | string,
    donation_goal: number | string
    amount_raised: number | string
    amount_distributed: number | string
    profileImageCuid: string
    Images: Image[],
    Family: Family,
    status: string,
    donation_status: string,
    duration: string, 
    start_date: Date | string | null,
    goal_met_date: Date | string | null,
    PageDonations: PageDonation[]
    Reply: Reply[]
    User: User, 
    last_donation_date: Date | string | null
}

const tableToggle = ref(false)

const family_cuid = ref("")
const router = useRoute()
const family_cuid_data = computed(() => router.params.id)
family_cuid.value = family_cuid_data.value as string;
const user_cuid_data = computed(() => router.params.id)
const user_cuid = user_cuid_data.value as string
//const pages = ref<Page2[]>([])
//const pages2 = ref<Page[]>([])
const cvuser = useCookie<User>('cvuser')
const user_cuid2 = cvuser.value.cuid
const isAdmin = computed(() => cvuser.value?.user_role == "admin")
const isAdvocate = computed(() => cvuser.value?.user_role == "advocate");
const currentPage = ref(0)
//const totalLength = ref(0)

const data = ref<User>({
  cuid: "",
  first_name: "",
  last_name: "",
  user_role: "",
  email: "",
  middle_name: "",
  phone: "",
  address: "",
  Pages: [],
  familyCuid: "", 
  AdvocateFamily: []
})

const isFamily = ref(false)
const familyCuid = ref("")
if(cvuser.value?.user_role == 'family') {
  familyCuid.value = router.params.id as string
}
const data_families = ref<Family[]>([])
const fromUser = computed(() => router.query.fromUsers as string == '1')
const entityCuid = computed(() => fromUser.value ? user_cuid : familyCuid.value)

// Method to populate the page list with data based on the cuid of the user in the url
const getDataAdminAdvocate = async () => {
  if(cvuser.value.user_role == "admin") {
    const { data: all_families } = await useFetch('/api/family', {
      method: 'GET',
      default() {
        return [] as any
      }
    })
    data_families.value = all_families.value as unknown as Family[]
  } else if(cvuser.value.user_role == "advocate"){
    // extracting the families that the advocate is responsible for
    const { data: advocateFamilies } = await useFetch('/api/user', {
      method: 'GET',
      query: { cuid: user_cuid },
      default() {
        return [] as any
      }
    })
    data_families.value = advocateFamilies.value?.AdvocateFamily as unknown as Family[]
    
  }
}

// handles changes of family selected for advocates or admins
// handles retrieving all of a family's pages for families
// handles retrieving all of a user's pages if coming from the user list
const { data: pages } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { cuid: entityCuid, page_number: currentPage },
    watch: [ familyCuid, currentPage ],
    default() {
      return [] as any
    }
  })
const totalLength = computed(() => pages.value?.Pagination?.total as unknown as number)

watch(familyCuid, () => {
  currentPage.value = 0
})
/*if(cvuser.value?.user_role == 'family' || fromUser.value) {
  pages.value = (family_pages.value.data) as unknown as Page2[]
}
watch(family_pages, () => {
  console.log("here", entityCuid)
  pages.value = (family_pages.value.data) as unknown as Page2[]
  totalLength.value = totalLength2.value
})*/
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
// one main endpoint for maintainability

const nextPage = () => { 
    if(currentPage.value < Math.max(((totalLength.value / 12) - 1), 0)) {//, ((totalLength2.value / 12) - 1))){
        currentPage.value++
        //if(fromUser.value || cvuser.value.user_role == "family" || isAdmin)
        //getDataPageList()
    }
}

const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
        //if(fromUser.value || cvuser.value.user_role == "family" || isAdmin)
        //  getDataPageList()
    } 
}

const goToPage = (pageNum: number) => {
  console.log(pageNum)
  if(pageNum >= 0 &&  pageNum < ((totalLength.value / 12))) {
        currentPage.value = pageNum 
    } 

}

const currentFamily = computed(() => data_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});

await getDataAdminAdvocate()
</script>

<template lang ="pug">
  
button(type="button" class="ml-4 my-4 text-white px-4 py-2 rounded-full w-32 transition duration-300 bg-orange-999 hover:bg-green-600" @click="tableToggle = !tableToggle") {{ tableToggle ? "all pages" : "archive"}}
.py-4.grid(class="sm:grid-cols-3" v-if="(isAdmin || isAdvocate) && !fromUser")
    CVLabel Current Family
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
.mx-auto.mt-1(class="sm:w-[1200px]")
  table(style="table-layout: auto;")
    thead
      tr
        th.font-poppins.font-bold.p-2.bg-blue-999.text-white.overflow-hidden(style="border-radius: 60px 0px 0px 0px; width:20%;")  Page Name
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 10%;") Creating User
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 10%;") Advocate 
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 10%;") Family 
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 10%;") Total Donated
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 20%;") Creation Date
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width: 20%;") Donation Deadline
        th.font-poppins.font-bold.bg-blue-999.text-white(style="") Donation Goal
        th.font-poppins.font-bold.bg-blue-999.text-white(style="width:15%;")  {{ "Page Editor" }}
        th.font-poppins.font-bold.bg-blue-999.text-white(style="border-radius: 0px 60px 0px 0px; width:25%;") {{ "Family Page" }}

    tbody 
      tr(v-for="(item, i) in ( tableToggle ? pages.data.filter(item => item.status == 'active') : pages.data)" :class="{'bg-gray-200': (i + 1) % 2}")
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.page_first_name + " " + item.page_last_name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.User?.first_name + " " + item.User?.last_name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Family?.AdvocateResponsible ? (item.Family?.AdvocateResponsible?.first_name + " " + item.Family?.AdvocateResponsible?.last_name) : 'No Advocate assigned'}}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Family?.family_name }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ donationFormat(item.amount_raised) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ dateFormat(item.start_date) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ dateFormat(item.deadline) }}
        td.font-poppins.text-gray-dark.font-bold.text-center {{ donationFormat(item.donation_goal) }}
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
        td
          LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
  .container.bg-blue-999(class="w-full max-w-[1200px]" style="height: 50px; border-radius: 0px 0px 60px 60px;")
.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
  .col-md-10.px-2.mt-2
    CVChevronLeft.text-gray-200.size-4.h-2(:class="{'cursor-pointer size-4 h-2': currentPage !== 0 }" @click="prevPage" :isEnd="currentPage == 0")
  .col-md-10.px-2.mt-2
    .flex
      p.cursor-pointer.text-gray-900(v-if="currentPage > 1" @click="goToPage(0)") {{  1 + "..." }} &nbsp;
      p.cursor-pointer.text-gray-900(v-if="currentPage > 0" @click="goToPage(currentPage - 1)") {{  currentPage }} &nbsp;
      p.cursor-pointer.text-gray-900.font-bold {{  currentPage + 1 }} &nbsp;
      p.cursor-pointer.text-gray-900(v-if="(totalLength / 12 - currentPage) > 1" @click="goToPage(currentPage + 1 )") {{  currentPage + 2 }} &nbsp;
      p.cursor-pointer.text-gray-900(v-if="(totalLength / 12 - currentPage) > 2" @click="goToPage(currentPage + 2)") {{  currentPage + 3 }} &nbsp;
      p.cursor-pointer.text-gray-900(v-if="(totalLength / 12 - currentPage) > 3" @click="goToPage(Math.floor(totalLength / 12))") {{  "..." + Math.ceil(totalLength / 12) }}
  .col-md-10.px-2.mt-2
      CVChevronRight.text-gray-900.size-4.h-2(:isEnd="currentPage == Math.floor(totalLength / 12)" :class="{'cursor-pointer': currentPage + 1 !== Math.ceil(totalLength / 12)}" @click="nextPage")
</template>

<style scoped></style>		
