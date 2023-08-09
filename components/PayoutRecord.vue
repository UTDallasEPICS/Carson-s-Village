<script lang="ts" setup>
// TODO: Taz look at this
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import type { User, Page, PageDonation, donation_payout } from "@/types.d.ts"
import { donationFormat } from "@/utils"

const props = defineProps<{
  currentPage: Page
  currentUser: User
}>()
const transaction_id = ref("")
const distributionDate = ref(new Date())
const amount = ref("0.00")

const cvuser = useCookie<User>('cvuser')

// Method that records donation payouts and increases the amount distributed for each page.
const save = async () => {
  await useFetch('/api/family_transaction_payout', {
    method: 'POST',
    body: {
      transaction_id: transaction_id.value,
      distributionDate: distributionDate.value,
      amount: Math.floor(parseFloat(amount.value) * 100),
      familyCuid: props.currentUser.cuid,
      pageCuid: props.currentPage.cuid,
    }
  })
  window.location.reload()
};
const setWholeAmount = function(){
  amount.value = (((props.currentPage.amount_raised as number) - (props.currentPage.amount_distributed as number)) / 100.0) + ""
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

  button.p-3.px-6.pt-2.bg-orange-500.rounded-lg.text-white(@click="setWholeAmount") Distribute All Remaining

  .flex.gap-5.justify-between
    p.self-center Stripe Transaction ID
    CVInput(v-model='transaction_id')

  button.p-3.px-6.pt-2.bg-orange-500.rounded-lg.text-white(@click="save") Record Transaction
</template>

<style scoped></style>
