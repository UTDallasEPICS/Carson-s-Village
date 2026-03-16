<script lang="ts" setup>
import type { Page, PageDonation } from '@/types.d.ts'

const props = defineProps({
    displayDonationPopup: {
        type: Boolean,
        default: false
    },
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
defineEmits(['update:displayDonationPopup']);

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

// When popup is open stop background from scrolling
watch(() => props.displayDonationPopup, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template lang="pug">
div(
  v-if="props.displayDonationPopup"
  @click.self="$emit('update:displayDonationPopup', false)"
  class="flex z-10 items-center justify-center fixed inset-0 bg-black/70 p-4"
)
  div(class="container m-4 place-content-center font-poppins w-1/2 sm:m-auto sm:py-3 bg-white rounded-lg shadow-lg max-h-full overflow-y-auto")
      div(class="relative")
        button(class="absolute top-2.5 right-2.5 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 font-light text-2xl w-[60px] h-[60px] rounded-full" @click="$emit('update:displayDonationPopup', false)") x
      div(v-if="props.donation_goal_provided" class="text-md text-center ml-4 my-3 sm:text-xl sm:my-6 tracking-[0.35px] font-semibold text-[#646464]") {{ donationFormat(props.amount_raised)  + " raised of " +  donationFormat(props.donation_goal) + " goal" }}
      div(class="py-4")
      div(v-if="props.donation_goal_provided" class="progress-bar overflow-hidden ml-4 h-7 rounded-full bg-[#b5b5b5]")
          //CVProgress(v-if="donated_percentage >= 100" modelBarWidth="100") {{ donated_percentage  + "%" }}
          CVProgress(:modelBarWidth="donated_percentage" class="text-xl") {{ donated_percentage  + "%" }}
          //CVProgress(v-else style="text-align:center;" modelBarWidth="0")  {{ donated_percentage   + "%" }}
      div(class="p-3 rounded bg-gray-50")
          h1(class="ml-4 pt-9 text-2xl text-gray-dark sm:text-3xl font-semibold tracking-[0.35px]") Donor Information
      DonationEntry(
        v-if="isActive"
        :isActive="isActive"
        :donationData="donationData"
        :pageCuid="pageCuid"
        :familyCuid="familyCuid"
      )
      img(v-else src="/InActiveDonationForm.png")   
</template>
