<script lang="ts" setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import type { Family, User, Page, PageDonation, donation_payout } from "@/types.d.ts"
const props = defineProps<{
  currentPage: Page
  currentFamily: Family
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
const setWholeAmountPage = function(){
  amount.value = (((props.currentPage.amount_raised as number) - (props.currentPage.amount_distributed as number)) / 100.0) + ""
}

const setWholeAmountFamily = function(){
  amount.value = (((props.currentFamily.Pages.reduce((acc: number, curr: Page) => acc + (curr.amount_raised as number), 0) || 0)) - (props.currentFamily.Pages.reduce((acc: number, curr: Page) => acc + (curr.amount_distributed as number), 0) || 0)) /100.0 + ""
}

</script>

<template lang="pug">
p.text-center.mt-10 Record Payout 
.flex.flex-col.w-full.justify-center.gap-5.mt-5
  .flex.gap-5.justify-between
    p.self-center Date
    CVDatepicker(v-model='distributionDate')
  .flex.gap-5.justify-between
    p.self-center Amount
    span.whitespace-nowrap
      span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
      input.outline-0.rounded-r-md.border-box.p-2(style="border: 1px solid #c4c4c4;" v-model='amount')
      max-w-min.mx-auto.flex.gap-2
  div.mx-auto.flex.gap-2.justify-between() 
    button.p-3.px-6.pt-2.rounded-lg.text-white(@click="setWholeAmountFamily" class="transition duration-300 bg-orange-999 hover:bg-green-600") Distribute All Remaining Family Funds
    button.p-3.px-6.pt-2.rounded-lg.text-white(@click="setWholeAmountPage" class="transition duration-300 bg-orange-999 hover:bg-green-600") Distribute All Remaining Page Funds
  button.p-3.px-6.pt-2.rounded-lg.text-white(@click="save" class="transition duration-300 bg-orange-999 hover:bg-green-600") Perform Distribution
p(v-if="error.length != 0" Style="color:red;") {{ error }}
</template>

<style scoped></style>
