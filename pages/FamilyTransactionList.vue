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
import type { User, Page, PageDonation, donation_payout } from "@/types.d.ts"
import { donationFormat } from "@/utils"

const { data: users } = await useFetch<User[]>('/api/users', {
  method: 'GET',
  default() {
    return [] as any
  }, 
});

const cvuser = useCookie<User>('cvuser');
const currentUserCuid = ref<string>("")
const currentUser = computed(() => users.value?.find(({ cuid }: User) => cuid == currentUserCuid.value) || {})

currentUserCuid.value = users.value![0]?.cuid || ""

const { data: pages } = await useFetch<Page[]>('/api/page_list', {
  method: 'GET',
  query: { family_cuid: currentUserCuid },
  watch: [currentUserCuid],
  default() {
    return [] as any;
  },
});

const currentPageCuid = ref<string>("");
const currentPage = computed(() => pages.value?.find(({ cuid }: Page) => cuid == currentPageCuid.value) || {});
watchEffect(() => currentPageCuid.value = pages.value![0]?.cuid || "");
const { data: donations } = await useFetch<PageDonation[]>('/api/family_donation', {
  method: 'GET',
  query: { family_cuid: currentUserCuid },
  watch: [currentUserCuid],
  default() {
    return [] as any;
  },
});

const totalPageDonations = computed(() => donations.value?.reduce((acc: number, curr: PageDonation) => acc + curr.amount, 0) || 0);
const totalDistributed = computed(() => pages.value?.reduce((acc: number, curr: Page) => acc + (curr.amount_distributed as number), 0) || 0);
const totalRemaining = computed(() => totalPageDonations.value - totalDistributed.value);

</script>

<template lang="pug">
.px-10   
  TitleComp.border-1.border-black Family Transaction List
  .flex.flex-wrap.w-full.justify-center.gap-5.mt-10
    // these two list boxes can be a distinct reusable component
    .flex.gap-5
      p.self-center Family
      Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="currentUserCuid")
        .relative
          Transition(
            leave-active-class='transition ease-in duration-100'
            leave-from-class='opacity-100'
            leave-to-class='opacity-0'
          )
            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
              ListboxOption(as='div' v-for="user in users" :key="user.cuid" :value="user.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ user.first_name + " " + user.last_name }}
        ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ currentUserCuid ? currentUser.first_name + " " + currentUser.last_name : 'Select User' }}
    
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
              ListboxOption(as='div' v-for="page in pages" :key="page.cuid" :value="page.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ page.page_name }} | {{ donationFormat(page.amount_raised - page.amount_distributed) }}
        ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ currentPageCuid ? currentPage.page_name : 'Select Page' }}
  
  .flex.gap-5.justify-around
    // these next two divs could theoretically be their own component with props
    div
      p.text-center.mt-10 Family 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center Donations
          p.text-center.mt-2 {{ donationFormat(totalPageDonations) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Distributed
          p.text-center.mt-2 {{ donationFormat(totalDistributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining
          p.text-center.mt-2 {{ donationFormat(totalRemaining) }}
    div
      p.text-center.mt-10 Page 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center Donations
          p.text-center.mt-2 {{ donationFormat(currentPage.amount_raised) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Distributed
          p.text-center.mt-2 {{ donationFormat(currentPage.amount_distributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining
          p.text-center.mt-2 {{ donationFormat(currentPage?.amount_raised - currentPage?.amount_distributed) }}
    div(class="basis-1/3")
      PayoutRecord(:currentPage="currentPage" :currentUser="currentUser")

  CVLegend.mt-10 Family Pages
  table.mt-5.table.table-striped.w-full
      thead
          tr
              th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden") Page Name
              th.px-8(style="width:25%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Raised
              th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Remaining
              th.px-8(style="width:25%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Cuid
          tr(v-for="(item, i) in pages" 
              :key="i" 
          )
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item?.page_name }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised) }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised-item.amount_distributed) }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}
  
  CVLegend.mt-10 Family Donations
  table.mt-5.table.table-striped(style="width:100%;")
      thead
          tr
              th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden") Transaction id
              th.px-8(style="width:25%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation cuid
              th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Name
              th.px-8(style="width:25%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amount
          tr(v-for="(item, i) in donations" 
              :key="i" 
          )
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.transaction_id }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.Page.page_name }}
              td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount) }}
</template>

<style scoped></style>
