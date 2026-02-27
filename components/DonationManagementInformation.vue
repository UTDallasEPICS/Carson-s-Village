<template lang="pug">
div(class="flex gap-5 justify-around")
    div
      p(class="text-center mt-10") Family 
      div(class="flex flex-col w-full justify-center gap-5 mt-5")
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Total Donations 
          p(class="text-center mt-2") {{ donationFormat(props.totalPageDonations) }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") All Funds Distributed
          p(class="text-center mt-2") {{ donationFormat(props.totalDistributed) }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Remaining Amount to Distribute
          p(class="text-center mt-2") {{ donationFormat(props.totalRemaining) }} 
    div
      p(class="text-center mt-10") Page 
      div(class="flex flex-col w-full justify-center gap-5 mt-5")
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") All Page Donations
          p(class="text-center mt-2") {{ donationFormat(props.amount_raised) }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") All Page Funds Distributed
          p(class="text-center mt-2") {{ donationFormat(props.amount_distributed) }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Remaining Amount to Distribute
          p(class="text-center mt-2") {{ donationFormat(props.amount_raised - props.amount_distributed) }}
    div
      p(class="text-center mt-10") Page Additonal
      div(class="flex flex-col w-full justify-center gap-5 mt-5")
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Donation Status
          p(class="text-center mt-2") {{ props.donationStatus }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Start Date
          p(class="text-center mt-2") {{ dateFormat(props.startDate) }}
        div(class="border border-grey-500 p-5")
          p(class="self-center text-center") Last Donation Date
          p(class="text-center mt-2") {{ props.lastDonationDate ? dateFormat(props.lastDonationDate) : "No Donations" }}
</template>
    
<script setup lang="ts">
import { dateFormat, donationFormat } from '@/utils'
const props = defineProps<{
  totalPageDonations: number,
  totalDistributed: number,
  totalRemaining: number,
  amount_raised: number,
  amount_distributed: number,
  donationStatus: string,
  startDate: Date | string | null,
  lastDonationDate: Date | string | null
}>()

</script>