<script lang="ts" setup>
import type { Page, PageDonation } from '@/types.d.ts'
import { dateFormat, donationFormat } from '@/utils'
const emit = defineEmits(["Exit"])
const props = defineProps({
    pageCuid: {
        type: String,
        default: ""
    }, 
    userCuid: {
        type: String,
        default: ""
    }, 
    familyCuid: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: false
    },
    donation_goal_provided: {
        type: Boolean,
        default: false
    },
    donated_percentage:  {
        type: Number,
        default: 0.00
    },
    amount_raised: {
        type: Number,
        default: 0.00
    },
    donation_goal: {
        type: Number,
        default: 0.00
    }
})

const feeRecovery = ref(false)
const anonymous = ref(false)

const donationData = ref<PageDonation>({
    amount: 5,
    success: false,
    cuid: "",
    pageCuid: props.pageCuid,
    familyCuid: props.familyCuid,
    transaction_id: "",
    donorFirstName: "",
    donorLastName: "",
    donorEmail: "",
    comments: "",
    donationDate: null,
    Page: ref<Page[]>([]).value[0],
    userCuid: '',
    isAnonymous: false
});

const stripeLink_ref = ref("")
const create_checkout_session = async () => {
    console.log(feeRecovery.value)
    if(feeRecovery.value) {
      donationData.value.amount = donationData.value.amount * 100 // converting to cents for better accuracy 
      donationData.value.amount = 1.029 * donationData.value.amount + 0.30
      donationData.value.amount = donationData.value.amount / 100 
    } 
    if(anonymous.value) {
        donationData.value.donorFirstName = "anonymous"
        donationData.value.donorLastName = ""
    }
    console.log(anonymous.value)
    // todo: depreciate
    const donorData = {
        first_name: donationData.value.donorFirstName,
        last_name: donationData.value.donorLastName,
        isAnonymous: donationData.value.isAnonymous,
        comments: donationData.value.comments
    };
    const sessionInfo = await $fetch('/api/integrations/stripe/create_session', {

        method: 'POST',
        body: { ...donationData.value, cuid: props.pageCuid, family_cuid: props.familyCuid, amount_raised: Math.trunc(parseFloat(donationData.value.amount as unknown as string) * 100) as number}
    });
    stripeLink_ref.value = sessionInfo as string
    await navigateTo(stripeLink_ref.value as string,  { external: true } )
};

const exitDoationPoppup = () => {
    emit("Exit", true)
}
</script>

<template lang="pug">
.container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
    .div.relative
        .div(style='position: absolute; top: 10px; right: 10px;')
            button(style="align-items: center;justify-content: center;line-height: 2;text-align: center ; color: rgba(0, 0, 0, 0.7) ; font-weight: 300;font-size: 24px; positon: absolute; top:0px; left: 0px; width: 60px; height: 60px; border-radius: 50%; padding-bottom: 4px;" @click = "exitDoationPoppup") x
    .text-md.text-center.ml-4.my-3(v-if="props.donation_goal_provided" class="sm:text-xl sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{ donationFormat(props.amount_raised)  + " raised of " +  donationFormat(props.donation_goal) + " goal" }}
    .py-4
    .progress-bar.overflow-hidden.ml-4.h-7.rounded-full(v-if="props.donation_goal_provided" style="30px; background-color:#b5b5b5;")
        //CVProgress(v-if="donated_percentage >= 100" modelBarWidth="100") {{ donated_percentage  + "%" }}
        CVProgress(:modelBarWidth="donated_percentage" style="font-size: 20px;") {{ donated_percentage  + "%" }}
        //CVProgress(v-else style="text-align:center;" modelBarWidth="0")  {{ donated_percentage   + "%" }}
    .well.well-sm
        h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donor Information
    DonationEntry(v-if="isActive" :isActive="isActive" :donationData="donationData" :pageCuid="pageCuid" :familyCuid="familyCuid")
    img(v-else src="/InActiveDonationForm.png")
    
    
</template>

<style scoped></style>
