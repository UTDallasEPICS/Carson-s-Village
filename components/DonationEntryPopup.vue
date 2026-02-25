<script lang="ts" setup>
import type { Page, PageDonation } from '@/types.d.ts'

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
        donationData.value.amount = Math.round((1.029 * donationData.value.amount + 0.30) * 100 ) / 100
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

const exitDonationPoppup = () => {
    emit("Exit")
}
</script>

<template lang="pug">
div(class="container m-4 place-content-center font-poppins w-5/6 sm:m-auto sm:py-3")
    div(class="relative")
        div(class="absolute top-2.5 right-2.5")
            button(class="items-center justify-center leading-loose text-center text-black/70 font-light text-2xl absolute top-0 left-0 w-[60px] h-[60px] rounded-full pb-1" @click = "exitDonationPoppup") x
    div(v-if="props.donation_goal_provided" class="text-md text-center ml-4 my-3 sm:text-xl sm:my-6 tracking-[0.35px] font-semibold text-[#646464]") {{ donationFormat(props.amount_raised)  + " raised of " +  donationFormat(props.donation_goal) + " goal" }}
    div(class="py-4")
    div(v-if="props.donation_goal_provided" class="progress-bar overflow-hidden ml-4 h-7 rounded-full bg-[#b5b5b5]")
        //CVProgress(v-if="donated_percentage >= 100" modelBarWidth="100") {{ donated_percentage  + "%" }}
        CVProgress(:modelBarWidth="donated_percentage" class="text-xl") {{ donated_percentage  + "%" }}
        //CVProgress(v-else style="text-align:center;" modelBarWidth="0")  {{ donated_percentage   + "%" }}
    div(class="p-3 rounded bg-gray-50")
        h1(class="ml-4 pt-9 text-2xl text-gray-dark sm:text-3xl font-semibold tracking-[0.35px]") Donor Information
    DonationEntry(v-if="isActive" :isActive="isActive" :donationData="donationData" :pageCuid="pageCuid" :familyCuid="familyCuid")
    img(v-else src="/InActiveDonationForm.png")
    
    
</template>

<style scoped></style>
