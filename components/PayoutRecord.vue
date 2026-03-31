<script lang="ts" setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import type { Family, User, Page, PageDonation, donation_payout } from "@/types.d.ts"
const props = defineProps<{
  currentPage: Page
  currentFamily: Family
  familyAvailable: number
}>()
const transaction_id = ref("")
const error = ref("")
const distributionDate = ref(new Date())
const amount = ref("0.00")

const cvuser = useCookie<User>('cvuser')

// Method that records donation payouts and increases the amount distributed for each page.
const save = async () => {
  const result = await $fetch('/api/family_transaction_payout', {
    method: 'POST',
    body: {
      transaction_id: transaction_id.value,
      distributionDate: distributionDate.value,
      amount: Math.floor(parseFloat(amount.value) * 100),
      familyCuid: props.currentFamily.cuid,
      pageCuid: props.currentPage.cuid
    }
  })
  if(result == true) {
    window.location.reload()
  } else {
    console.log(result)
    error.value = result as string
  }
};
const setWholeAmountPage = function() {
  amount.value = (props.currentPage.amount_available / 100.0) + "";
}

const setWholeAmountFamily = function() {
  amount.value = (props.familyAvailable / 100.0) + "";
}

</script>

<template lang="pug">
p(class="text-center mt-10") Record Payout 
div(class="flex flex-col w-full justify-center gap-5 mt-5")
  div(class="flex gap-5 justify-between")
    p(class="self-center") Date
    CVDatepicker(v-model='distributionDate')
  div(class="flex gap-5 justify-between")
    p(class="self-center") Amount
    span(class="whitespace-nowrap")
      span(class="rounded-l-md bg-gray-200 text-lg p-2 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-[#c4c4c4]") $
      input(class="outline-0 rounded-r-md border-box p-2 border border-[#c4c4c4]" v-model='amount')
      div(class="max-w-min mx-auto flex gap-2")
  div(class="mx-auto flex gap-2 justify-between") 
    button(class="p-3 px-6 pt-2 rounded-lg text-white transition duration-300 bg-orange-999 hover:bg-green-600" @click="setWholeAmountFamily") Distribute All Remaining Family Funds
    button(class="p-3 px-6 pt-2 rounded-lg text-white transition duration-300 bg-orange-999 hover:bg-green-600" @click="setWholeAmountPage") Distribute All Remaining Page Funds
  button(class="p-3 px-6 pt-2 rounded-lg text-white transition duration-300 bg-orange-999 hover:bg-green-600" @click="save") Perform Distribution
p(v-if="error.length != 0" class="text-red-500") {{ error }}
</template>

<style scoped></style>
