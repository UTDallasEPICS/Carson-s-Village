<script lang="ts" setup>

/*  Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Allows the website administrator to see incoming and outgoing donations
*	Located under "/FamilyTransactionList/"
*/

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import type { User, Page, PageDonation, donation_payout, Family } from "@/types.d.ts"
import { donationFormat } from "@/utils"
//import { Family } from "@prisma/client"
const currentFamilyPageNumber = ref(0)
//const familyPagesLength = ref(0)
const cvuser = useCookie<User>('cvuser');
const isAdmin = computed(() => cvuser.value?.user_role == "admin")
const isAdvocate = computed(() => cvuser.value?.user_role == "advocate")
//if(isAdmin  ) {
  const { data: Families } = await useFetch<Family[]>('/api/families', {
    method: 'GET',
    default() {
      return [] as any
    }, 
  });

  const currentFamilyCuid = ref<string>("")
  const currentFamily = computed(() => Families.value?.find(({ cuid }: Family) => cuid == currentFamilyCuid.value) || {})
  
  //console.log(currentFamily.value)
  //const currentUser = computed(() => currentFamily.value?.FamilyMembers![0] as User)
  currentFamilyCuid.value = Families.value![0]?.cuid || ""
  
  const { data: familyData } = await useFetch('/api/family_pages', {
    method: 'GET',
    query: { family_cuid: currentFamilyCuid, page_number: currentFamilyPageNumber},
    watch: [currentFamilyCuid, currentFamilyPageNumber],
    default() {
      return [] as any;
    },
  });
  
  const familyPagesLength = computed(() => familyData.value.Pagination.total)
  const currentPageCuid = ref<string>("");
  const currentPage = computed(() => familyData.value?.raw_data.find(({ cuid }: Page) => cuid == currentPageCuid.value) || {});
  watchEffect(() => currentPageCuid.value = familyData.value.raw_data![0]?.cuid || "");
  
  const { data: donations } = await useFetch<PageDonation[]>('/api/family_donation', {
    method: 'GET',
    query: { family_cuid: currentFamilyCuid },
    watch: [currentFamilyCuid],
    default() {
      return [] as any;
    },
  });
  
  const nextPage = () => { 
  console.log(familyPagesLength.value / 12)
    if(currentFamilyPageNumber.value < ((familyPagesLength.value / 12) - 1)){
        currentFamilyPageNumber.value++
    } 
  }
  const prevPage= () => {
    if(currentFamilyPageNumber.value != 0){
        currentFamilyPageNumber.value--
    } 
  }

  const totalPageDonations = computed(() => donations.value?.reduce((acc: number, curr: PageDonation) => acc + curr.amount, 0) || 0);
  const totalDistributed = computed(() => familyData.value?.raw_data.reduce((acc: number, curr: Page) => acc + (curr.amount_distributed as number), 0) || 0);
  const totalRemaining = computed(() => totalPageDonations.value - totalDistributed.value);
</script>

<template lang="pug">
.px-10(v-if="isAdmin" )   
  TitleComp.border-1.border-black Family Transaction List
  .flex.flex-wrap.w-full.justify-center.gap-5.mt-10
    // these two list boxes can be a distinct reusable component
    .flex.gap-5
      p.self-center Family
      Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="currentFamilyCuid")
        .relative
          Transition(
            leave-active-class='transition ease-in duration-100'
            leave-from-class='opacity-100'
            leave-to-class='opacity-0'
          )
            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
              ListboxOption(as='div' v-for="Family in Families" :key="Family.cuid" :value="Family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ Family.family_name }}
        ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ currentFamilyCuid ? currentFamily.family_name : 'Select Family' }}
    
    .flex.gap-5
      p.self-center Page
      Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="currentPageCuid")
        .relative
          Transition(
            leave-active-class='transition ease-in duration-100'
            leave-from-class='opacity-100'
            leave-to-class='opacity-0'
          )
            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
              ListboxOption(as='div' v-for="page in familyData.raw_data" :key="page.cuid" :value="page.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ page.page_first_name + " "  + page.page_last_name }} | {{ donationFormat(page?.amount_raised - page?.amount_distributed) }}
        ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ currentPageCuid ? (currentPage.page_first_name || currentPage.last_name) : 'Select Page' }}
  
  .flex.gap-5.justify-around
    //these next two divs could theoretically be their own component with props
    div
      p.text-center.mt-10 Family 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center Total Donations 
          p.text-center.mt-2 {{ donationFormat(totalPageDonations) }}
        .border.border-grey-500.p-5
          p.self-center.text-center All Funds Distributed
          p.text-center.mt-2 {{ donationFormat(totalDistributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining Amount to Distribute
          p.text-center.mt-2 {{ donationFormat(totalRemaining) }}
    div
      p.text-center.mt-10 Page 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center All Page Donations
          p.text-center.mt-2 {{ donationFormat(currentPage?.amount_raised) }}
        .border.border-grey-500.p-5
          p.self-center.text-center All Page Funds Distributed
          p.text-center.mt-2 {{ donationFormat(currentPage?.amount_distributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining Amount to Distribute
          p.text-center.mt-2 {{ donationFormat(currentPage?.amount_raised - currentPage?.amount_distributed) }}
    div(class="basis-1/3")
      PayoutRecord(:currentPage="currentPage" :currentFamily="currentFamily")

  CVLegend.mt-10 Family Pages
  table.mt-5.table.table-striped.w-full
      thead
          tr(style="color: white;")
              th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:33.33%; overflow: hidden") Page Name
              th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Raised
              th.font-poppins.font-bold(style="--tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); width:33.33%") Remaining
          tr(v-for="(item, i) in familyData.data" 
              :key="i" 
              :class="{'bg-gray-200': (i+1) % 2}"
          )
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item?.page_first_name + " " + item?.last_name }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised) }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised-item.amount_distributed) }}
  .ml-9.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentFamilyPageNumber }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
  CVLegend.mt-10 Family Donations
  table.mt-5.table.table-striped(style="width:100%;")
      thead
          tr(style="color: white;")
              th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:33.33%; overflow: hidden") Transaction id
              th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Name
              th.px-8(style="width:33.33%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amount
          tr(v-for="(item, i) in donations" 
              :key="i" 
              :class="{'bg-gray-200': (i+1) % 2}"
          )
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.transaction_id }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}

              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.Page.page_first_name + " " + item.Page.page_first_name }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount) }}
</template>

<style scoped></style>
