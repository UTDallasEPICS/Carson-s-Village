<template lang="pug">
.flex.gap-5.justify-around
    div
      p.text-center.mt-10 Family 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center Total Donations 
          p.text-center.mt-2 {{ donationFormat(props.totalPageDonations) }}
        .border.border-grey-500.p-5
          p.self-center.text-center All Funds Distributed
          p.text-center.mt-2 {{ donationFormat(props.totalDistributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining Amount to Distribute
          p.text-center.mt-2 {{ donationFormat(props.totalRemaining) }} 
    div
      p.text-center.mt-10 Page 
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center All Page Donations
          p.text-center.mt-2 {{ donationFormat(props.amount_raised) }}
        .border.border-grey-500.p-5
          p.self-center.text-center All Page Funds Distributed
          p.text-center.mt-2 {{ donationFormat(props.amount_distributed) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Remaining Amount to Distribute
          p.text-center.mt-2 {{ donationFormat(props.amount_raised - props.amount_distributed) }}
    div
      p.text-center.mt-10 Page Additonal
      .flex.flex-col.w-full.justify-center.gap-5.mt-5
        .border.border-grey-500.p-5
          p.self-center.text-center Donation Status
          p.text-center.mt-2 {{ props.donationStatus }}
        .border.border-grey-500.p-5
          p.self-center.text-center Start Date
          p.text-center.mt-2 {{ dateFormat(props.startDate) }}
        .border.border-grey-500.p-5
          p.self-center.text-center Last Donation Date
          p.text-center.mt-2 {{ props.lastDonationDate ? dateFormat(props.lastDonationDate) : "No Donations" }}
</template>
    
<script setup lang="ts">
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