<script lang="ts" setup>
import type { Page, PageDonation, User } from '@/types.d.ts'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const props = defineProps({
    pageCuid: {
        type: String,
        default: ""
    }, 
    familyCuid: {
        type: String,
        default: ""
    }
})


const feeRecovery = ref(false)
const anonymous = ref(false)
const subscribing = ref(true)
const displayAmount = ref(5)

const donationData = ref<PageDonation>({
    amount: 500,
    pageCuid: props.pageCuid,
    familyCuid: props.familyCuid,
    donorFirstName: "",
    donorLastName: "",
    donorEmail: user.value?.email ?? "",
    comments: "",
    donationDate: null,
    Page: ref<Page[]>([]).value[0],
    isAnonymous: false
});

// convert displayAmount in dollars to real amount in cents (done for integration with stripe)
watch(
  displayAmount,
  (amount) => {
    donationData.value.amount = amount ? amount * 100 : 0;
  }
);

const create_checkout_session = async () => {
    if(feeRecovery.value) {
      // Calculate stripe fee and add to amount
      donationData.value.amount += Math.ceil((donationData.value.amount * 0.029 + 30) / 0.971);
    } 
    if(anonymous.value) {
        donationData.value.donorFirstName = "anonymous"
        donationData.value.donorLastName = ""
    }

    // Create stripe checkout and redirect user to checkout
    const sessionUrl = await $fetch('/api/stripe/create_session', {
        method: 'POST',
        body: {
          ...donationData.value, 
          subscribed: subscribing.value
        }
    });
    await navigateTo(sessionUrl as string,  { external: true } )
};
</script>

<template>
  <form>
    <div class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2">
      <CVInput
        id="first_name"
        v-model="donationData.donorFirstName"
        name="first_name"
        type="text"
        placeholder="First Name*"
        required="required"
      />
    </div>
    <div class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2">
      <CVInput
        id="last_name"
        v-model="donationData.donorLastName"
        name="last_name"
        type="text"
        placeholder="Last Name*"
        required="required"
      />
    </div>
    <div class="col-md-8 ml-4 pt-1 pr-5 sm:mx-4 sm:w-full sm:py-2">
      <CVInput
        id="email"
        v-model="donationData.donorEmail"
        name="email"
        type="email"
        placeholder="Email"
      />
    </div>
    <div class="col-md-8 ml-4 pt-4 pr-5 flex">
      <input
        id="subscribing"
        v-model="subscribing"
        type="checkbox"
        class="sm:ml-1"
        name="subscribing"
      >
      <label
        for="subscribing"
        class="sm:mt-0 tracking-[0.35px] mt-4 ml-4 text-md"
      >  Subscribe to our email list</label>
    </div>
    <div class="col-md-8 ml-4 pt-4 pr-5 flex">
      <input
        id="anonymous"
        v-model="anonymous"
        type="checkbox"
        class="sm:ml-1"
        name="anonymous"
      >
      <label
        for="anonymous"
        class="sm:mt-0 tracking-[0.35px] mt-4 ml-4 text-md"
      >  Make this an anonymous donation</label>
    </div>
    <div class="col-md-8 ml-4 pt-4 pr-5 flex sm:mx-4 sm:w-full sm:py-2">
      <textarea
        id="comments"
        v-model="donationData.comments"
        class="rounded-md outline-0 border-box w-full p-2 border border-[#c4c4c4]"
        name="comments"
        rows="3"
        placeholder="Comments"
      />
    </div>
    <div class="col-md-8 ml-4 pt-4 pr-5 grid grid-cols-3 sm:mx-4 sm:w-full sm:py-2">
      <span class="rounded-l-md p-3 col-span-2 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-[#c4c4c4]">Donation Amount</span>
      <div class="flex">
        <span class="bg-gray-light py-2 px-1 text-lg drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-r-0 border-[#c4c4c4]">$</span>
        <input
          id="donation_amount"
          v-model="displayAmount"
          class="bg-gray-light outline-0 rounded-r-md border-box w-full p-2 border border-l-0 border-[#c4c4c4]"
          name="donation_amount"
          type="number"
          min="0.00"
          step="0.01"
          required
        >
        <br>
      </div>
    </div>
    <img
      v-if="displayAmount < 5"
      src="/tooLowDonations.png"
      class="h-[115px] w-[600px]"
    >
    <input
      id="fee_recovery"
      v-model="feeRecovery"
      type="checkbox"
      class="sm:ml-1"
    >
    <label
      for="fee_recovery"
      class="sm:mt-0 tracking-[0.35px] mt-4 ml-4 text-md"
    > I'd like to help cover the transaction fees of ${{ (0.029 * displayAmount + 0.30).toFixed(2) }} for my donation. </label>
    <div class="col-md-8 ml-4 pt-6 pr-5 flex items-center justify-center">
      <ActionButton
        text="DONATE NOW"
        :disabled="displayAmount < 5"
        class="mx-auto text-md transition duration-300 bg-orange-999 hover:bg-green-600"
        :class="{'cursor-not-allowed': displayAmount < 5 }"
        @click="create_checkout_session"
      />
    </div>
  </form>
</template>

<style scoped></style>
