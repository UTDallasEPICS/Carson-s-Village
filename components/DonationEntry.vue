<script lang="ts" setup>
import type { Page, PageDonation, User } from '@/types.d.ts'

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
    }
})

const cvuser = useCookie<User>('cvuser');

const feeRecovery = ref(false)
const anonymous = ref(false)
const subscribing = ref(true)
const displayAmount = ref(5)

const donationData = ref<PageDonation>({
    amount: 500,
    success: false,
    cuid: "",
    pageCuid: props.pageCuid,
    familyCuid: props.familyCuid,
    transaction_id: "",
    donorFirstName: "",
    donorLastName: "",
    donorEmail: cvuser.value?.email ?? "",
    comments: "",
    donationDate: null,
    Page: ref<Page[]>([]).value[0],
    userCuid: props.userCuid,
    isAnonymous: false
});

// convert displayAmount in dollars to real amount in cents (done for integration with stripe)
watch(
  displayAmount,
  (amount) => {
    donationData.value.amount = amount * 100;
  }
);

const create_checkout_session = async () => {
    if(feeRecovery.value) {
      // Calculate stripe fee
      donationData.value.amount += Math.ceil(((donationData.value.amount * 0.029 + 0.3) / 0.971) * 100);
    } 
    if(anonymous.value) {
        donationData.value.donorFirstName = "anonymous"
        donationData.value.donorLastName = ""
    }

    // Create stripe checkout and redirect user to checkout
    const sessionUrl = await $fetch('/api/integrations/stripe/create_session', {
        method: 'POST',
        body: {
          ...donationData.value, 
          subscribed: subscribing.value
        }
    });
    await navigateTo(sessionUrl as string,  { external: true } )
};

//todo: fix form
</script>

<template lang="pug">
form
    div(class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2")
        CVInput(id="first_name" name='first_name' type='text' v-model="donationData.donorFirstName" placeholder='First Name*' required="required")
    div(class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2")
        CVInput(id="last_name" name='last_name' type='text' v-model="donationData.donorLastName" placeholder='Last Name*' required="required")
    div(class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2")
        CVInput(id="email" name='email' type='email' v-model="donationData.donorEmail" placeholder='Email')
    div(class="col-md-8 ml-4 pt-4 pr-5 flex")
        input#subscribing(type='checkbox' class="sm:ml-1" name='subscribing' v-model="subscribing")
        label.mt-4.ml-4.text-md(for='subscribing' class="sm:mt-0 tracking-[0.35px]")  Subscribe to our email list
    div(class="col-md-8 ml-4 pt-4 pr-5 flex")
        input#anonymous(type='checkbox' class="sm:ml-1" name='anonymous' v-model="anonymous")
        label.mt-4.ml-4.text-md(for='anonymous' class="sm:mt-0 tracking-[0.35px]")  Make this an anonymous donation
    div(class="col-md-8 ml-4 pt-4 pr-5 flex sm:mx-4 sm:w-full sm:py-2")
        textarea#comments(class="rounded-md outline-0 border-box w-full p-2 border border-[#c4c4c4]" name='comments' rows="3" v-model="donationData.comments" placeholder='Comments')
    div(class="col-md-8 ml-4 pt-4 pr-5 grid grid-cols-3 sm:mx-4 sm:w-full sm:py-2")
        span.rounded-l-md.p-3.col-span-2(class="drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-[#c4c4c4]") Donation Amount
        div(class="flex")
            span(class="bg-gray-light py-2 px-1 text-lg drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-r-0 border-[#c4c4c4]") $
            input#donation_amount(class="bg-gray-light outline-0 rounded-r-md border-box w-full p-2 border border-l-0 border-[#c4c4c4]" name='donation_amount' type="number" min="0.00" step="0.01" v-model="displayAmount" required)
            br
    img(v-if="displayAmount < 5" src="/tooLowDonations.png" class="h-[115px] w-[600px]")
    input(id="fee_recovery" type='checkbox' class="sm:ml-1" v-model='feeRecovery')
    label.mt-4.ml-4.text-md(for='fee_recovery' class="sm:mt-0 tracking-[0.35px]") I'd like to help cover the transaction fees of ${{ props.isActive ? ((0.029 * displayAmount + 0.30)/0.971).toFixed(2) : 0}} for my donation. 
    div(class="col-md-8 ml-4 pt-6 pr-5 flex items-center justify-center")
        ActionButton(class="mx-auto text-md" @click="create_checkout_session" :disabled="displayAmount < 5" :class="{'transition duration-300 bg-orange-999 hover:bg-green-600': true, 'cursor-not-allowed': displayAmount < 5 }") DONATE NOW
</template>

<style scoped></style>
