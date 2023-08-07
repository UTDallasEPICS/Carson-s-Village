<script lang="ts" setup>
// TODO: Taz look at this
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import type { User, Page, PageDonation, donation_payout } from "@/types.d.ts"
import { donationFormat } from "@/utils"

const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "{}",
    phone: "",
    Pages: [],
    //PageDonations: [],
    //DonationPayouts: []
})

const data_donation = ref<PageDonation>({
    cuid: "",
    familyCuid: "",
    pageCuid: "",
    success: false,
    transaction_id: "",
    amount: 0
})

const data_payout = ref<donation_payout>({
    cuid: "",
    transaction_id: "",
    familyCuid: "",
    amount_to_record: 0,
    transaction_recording_date: new Date().toString()
})

const recordWholeAmount = ref(false)
const totalUserDonations = ref(0);
const users = ref<User[]>([])
const pages = ref<Page[]>([])


const thePage = ref<Page>({
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
    Images: []
})

const emits = defineEmits(['dataLoaded']);
const pagesPayout = ref<Page[]>([])
const donations = ref<PageDonation[]>([])
const cvuser = useCookie<User>('cvuser')
const amount_distributed = ref(0);
const amount_remaining = ref(0);
// Family cuid of the admin to ensure permissions to view the family transaction list
const family_cuid_data = computed(() => cvuser.value?.cuid)
// Current family cuid that is used for selecting a family
const viewed_family_cuid = ref(family_cuid_data.value as string)
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")
const amount_remaining_page = ref(0)
// Method to populate transaction list of each family and display total donations to each family.
const getDataUserDonations = async (cuid: string) => {
    data_payout.value.familyCuid = cuid; 
    totalUserDonations.value = 0;
    amount_distributed.value = 0;
    const { data: userDonationData } = await useFetch('/api/family_donation', {
        method: 'GET',
        query: { familyCuid: cuid }
    })

    const { data: userData } = await useFetch('/api/user', {
        method: 'GET',
        query: { cuid: cuid }
    })


    const { data: pageData } = await useFetch('/api/page_list', {
        method: 'GET',
        query: { family_cuid: cuid }
    })
    
   
    pages.value = pageData.value as unknown as Page[];
    donations.value = userDonationData.value as unknown as PageDonation[];
    data_user.value = userData.value as unknown as User;
    donations.value.forEach(element => {
        if(element.success === true){
            totalUserDonations.value += parseFloat((element.amount) as unknown as string);
        }
    });
   
    pages.value.forEach(element => {
            amount_distributed.value += parseFloat(element.amount_distributed as unknown as string)
        } 
    );
    emits('dataLoaded', pages.value, donations.value)
    amount_remaining.value = (totalUserDonations.value-parseFloat(amount_distributed.value as unknown as string))
    //console.log(amount_distributed.value);
    //console.log(amount_remaining.value);
};
// Method that retrives data for getting donation data for each page individually for the second select
const getDataPageDonations = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch('/api/page', {
    method: 'GET',
    query: { cuid: id }
})
recordWholeAmount.value = false
data_payout.value.cuid = id
thePage.value= pageDataDB.value as unknown as Page;
//console.log(thePage.value);
}

// Method to populate the drop down of families to chose donations to view from.
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
    })
    users.value = usersData.value as unknown as User[];
}

// Method that records donation payouts and increases the amount distributed for each page.
const save = async () => {
    if(isAdmin){
    await useFetch('/api/family_transaction_payout', {
        method: 'POST',
        body: ({ ...data_payout.value })
    })
    getDataPageDonations(data_payout.value.cuid as string)
    getDataUserDonations(data_payout.value.familyCuid as string)
    }
}

const setWholeAmount = function(){
    data_payout.value.amount_to_record = ((thePage.value.amount_raised as number) - (thePage.value.amount_distributed as number)) / 100.0
}

if ((isAdmin.value as boolean)) {
    getDataUsers()
}
</script>

<template lang="pug">
.py-4.grid(class="sm:grid-cols-7")
    CVLabel Select the Family to View
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        Listbox.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model="data_user.cuid")
            ListboxButton {{ data_user.first_name + " " + data_user.last_name }}
                ListboxOptions(v-for="item in users" :key="item.cuid" @click="getDataUserDonations(item.cuid)") {{ item.first_name + " " + item.last_name }}
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
    CVLabel Transaction Recording Date    
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        CVDatepicker(v-model='data_payout.transaction_recording_date')
.py-4.grid(class="sm:grid-cols-7")
    CVLabel Total Donations
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(totalUserDonations) }}
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
    CVLabel Enter Amount to Record 
    .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
        span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
        input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" min="0.00" step="0.01" v-model='data_payout.amount_to_record' onblur="(this.type='number')" onfocus="(this.type='number')" required)
.py-4.grid(class="sm:grid-cols-7")
    CVLabel Amount left to distribute to family
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(amount_remaining) }}
    .col-md-8.ml-4.pt-4.pr-5.flex(class="sm:col-span-1 sm:mr-11")
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        input(type='checkbox' class="sm:ml-1" name='allFunds' value='Bike' v-model="recordWholeAmount" @click="setWholeAmount")
        label.mt-4.ml-4.text-md(for='allFunds' class="sm:mt-0" style="letter-spacing: 0.35px;") Record all of amount left to distribute
.py-4.grid(class="sm:grid-cols-7")
    CVLabel Select Family Page
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        Listbox.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model="data_payout.cuid")
            ListboxButton  {{ thePage.page_name }}
                ListboxOptions(v-for="page in pages" :key="page.cuid" @click="getDataPageDonations(page.cuid)" ) {{ page.page_name }}
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
    CVLabel Enter transaction id from Stripe
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        CVInput(v-model='data_payout.transaction_id')
.py-4.grid(class="sm:grid-cols-7")
    CVLabel Amount left to distribute to family page
    .col-md-8.mx-9(class="sm:col-span-3 sm:mr-11")
        .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(thePage.amount_raised-thePage.amount_distributed) }}
    .col-md-10.py-2(class="sm:col-span-3 sm:mr-11")
        button.p-3.px-6.pt-2.bg-orange-500(@click="save" style="color: white; font-weight: 700; border-radius: 32px;") Record Transaction
</template>

<style scoped></style>
