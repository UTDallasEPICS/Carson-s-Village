<script lang="ts" setup>
import type { Page, PageDonation, Image } from '@/types.d.ts'
import {  dateFormat, donationFormat } from '@/utils'

const pageData = ref<Page>({
    cuid: "",
    familyCuid: "",
    page_name: "",
    day_of_birth: "",
    day_of_passing: "",
    visitation_date: "",
    visitation_location: "",
    visitation_description: "",
    funeral_date: "",
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    deadline: "",
    donation_goal: 0,
    amount_raised: 0,
    amount_distributed: 0,
    profileImageCuid: "",
    Images: [],
    familiesCuid: ""
});

type donor = {
    first_name: string,
    last_name: string,
    isAnonnomous: boolean,
    comments: string 
}
const donorInfo = ref<donor>({
    first_name: "",
    last_name: "",
    isAnonnomous: false,
    comments: "",
})

const donationData = ref<PageDonation>({
    amount: 0,
    success: false,
    cuid: "",
    pageCuid: "",
    familyCuid: "",
    familiesCuid: "",
    transaction_id : ""
});

const props = defineProps({
    pageCuid: {
        type: String,
        default: ""
    }, 
    familyCuid: {
        type: String,
        default: ""
    }, 
    familiesCuid: {
        type: String,
        default: ""
    }
})
console.log(props.familiesCuid)
const stripeLink_ref = ref("")
const create_checkout_session = async () => {
    const { data : sessionInfo } = await useFetch('/api/create_session', {
        method: 'POST',
        body: {cuid: props.pageCuid, family_cuid: props.familyCuid, familiesCuid: props.familiesCuid, amount_raised: Math.trunc(parseFloat(donationData.value.amount as unknown as string) * 100) as number}
    });
    stripeLink_ref.value = sessionInfo.value as string
    await navigateTo(stripeLink_ref.value as string,  { external: true } )
};


</script>

<template lang="pug">
.col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
    CVInput(name='first_name' type='text' v-model="donorInfo.first_name" placeholder='First Name' required)
.col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
    CVInput(name='last_name' type='text' v-model="donorInfo.last_name" placeholder='Last Name' required)
.col-md-8.ml-4.pt-4.pr-5.flex
    input#anonymous(type='checkbox' class="sm:ml-1" name='anonymous' value='Bike')
    label.mt-4.ml-4.text-md(for='anonymous' class="sm:mt-0" style="letter-spacing: 0.35px;")  Make this an anonymous donation
.col-md-8.ml-4.pt-4.pr-5.flex(class="sm:mx-4 sm:w-full sm:py-2")
    textarea#comments.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" name='comments' rows='3' v-model="donorInfo.comments" placeholder='Comments' required)
.col-md-8.ml-4.pt-4.pr-5.grid.grid-cols-3(class="sm:mx-4 sm:w-full sm:py-2")
    span.rounded-l-md.p-3.col-span-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") Donation Amount
    .flex
        span.bg-gray-light.py-2.px-1.text-lg(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4; border-right:none;") $
        input#donation_amount.bg-gray-light.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4; border-left:none;" name='donation_amount' type="number" min="0.00" step="0.01" v-model="donationData.amount" required)
.col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center
    ActionButton.mx-auto.text-md(name='submit' @click="create_checkout_session") DONATE NOW
</template>

<style scoped></style>
