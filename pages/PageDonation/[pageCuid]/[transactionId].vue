<script setup lang="ts">
//temporary page to display family page data and to call Complete_session.get.ts in order to complete donation handling
//import type { Page } from '@/types.d.ts'
import type { User } from '@/types.d.ts'
import { dateFormat } from '@/utils'
type Page = {
    cuid: string,
    page_name: string,
    day_of_birth: Date,
    day_of_passing: Date,
    visitation_date: Date,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date,
    funeral_description: string,
    funeral_location: string,
    obituary: string,
    deadline: Date,
    donation_goal: number,
    amount_raised: number
};

type Donation = {
    amount_raised: number,
    first_name: string,
    last_name: string,
    comments: string
    transaction_id: string
};

const pageData = ref<Page>({
    cuid: "",
    page_name: "",
    day_of_birth: new Date(),
    day_of_passing: new Date(),
    visitation_date: new Date(),
    visitation_location: "",
    visitation_description: "",
    funeral_date: new Date(),
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    deadline: new Date(),
    donation_goal: 0,
    amount_raised: 0
});

const donationData = ref<Donation>({
    amount_raised: 0,
    first_name: "",
    last_name: "",
    comments: "",
    transaction_id : ""
});

const router = useRoute();
const pageCuid_ref = computed(() =>  router.params.pageCuid);
const transaction_id_ref = computed(() =>  router.params.transactionId);
const transaction_id = transaction_id_ref.value as string;
const cuid = pageCuid_ref.value as string;
const cvuser = useCookie<Page>('cvuser')
const family_cuid_data = computed(() => cvuser.value?.cuid)
const family_cuid = family_cuid_data.value as string;

const complete_session = async () => {
    const { data : sessionInfo } = await useFetch('/api/complete_session', {
        method: 'GET',
        query: { transaction_id }
    })
    pageData.value = sessionInfo.value as unknown as Page;
    await navigateTo('/page/'+ cuid)
};

onMounted(() => { 
                complete_session()    
                } )

</script>

<template lang="pug">

</template>

<style scoped></style>