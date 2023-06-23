<script setup lang="ts">
//page that calls Complete_session.get.ts in order to complete donation handling

const router = useRoute();
const pageCuid_ref = computed(() =>  router.params.pageCuid);
const transaction_id_ref = computed(() =>  router.params.transactionId);
const transaction_id = transaction_id_ref.value as string;
const cuid = pageCuid_ref.value as string;
/*const cvuser = useCookie<Page>('cvuser')
const family_cuid_data = computed(() => cvuser.value?.cuid)
const family_cuid = family_cuid_data.value as string;*/

// Method that calls backend to mark the transaction as complete on the database and increment the amount raised for a page.
const complete_session = async () => {
    await useFetch('/api/complete_session', {
        method: 'GET',
        query: { transaction_id }
    })
    await navigateTo('/page/'+ cuid)
};

complete_session()    
</script>

<template lang="pug">

</template>

<style scoped></style>