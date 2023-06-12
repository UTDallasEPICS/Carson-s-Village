<script lang="ts" setup>

/*  Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Allows the website administrator to see incoming and outgoing donations
*	Located under "/FamilyTransactionList/"
*/

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import type { User, Page, PageDonation } from "@/types.d.ts"
import { donationFormat } from "@/utils"

const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "{}",
    phone: ""
})

const data_donation = ref<PageDonation>({
    cuid: "",
    familyCuid: "",
    pageCuid: "",
    success: false,
    transaction_id: "",
    amount: 0
})

type donation_payout = {
    transaction_id: string,
    familyCuid: string
    amount_to_record: number,
    transaction_recording_date: Date
}

const data_payout = ref<donation_payout>({
    transaction_id: "",
    familyCuid: "",
    amount_to_record: 0,
    transaction_recording_date: new Date()
})

let totalUserDonations = 0;
const users = ref<User[]>([])
const pages = ref<Page[]>([])
const pagesPayout = ref<Page[]>([])
const donations = ref<PageDonation[]>([])
const cvuser = useCookie<User>('cvuser')
const amount_distributed = ref(0);
const amount_remaining = ref(0);
// Family cuid of the admin to ensure permissions to view the family transaction list
const family_cuid_data = computed(() => cvuser.value?.cuid)
const viewed_family_cuid = ref("")
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")
const amount_remaining_page = ref(0)
const totalPageDonations = ref(0);
// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUser = async (cuid: string) => {
    const { data: userData } = await useFetch('/api/user', {
        method: 'GET',
        query: { familyCuid: cuid }
    })
    viewed_family_cuid.value = cuid
    data_user.value = userData.value as unknown as User;
    await getDataPage(cuid)
}

// Method that retrieves all the pages of a family
const getDataPage = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { cuid: id }
})
console.log("executed")
try {
pagesPayout.value = pageDataDB.value as unknown as Page[];
pagesPayout.value.forEach(element => {
    amount_remaining_page.value = parseFloat((element.amount_raised) as unknown as string) - parseFloat(element.amount_distributed as string);
    });
console.log(pagesPayout);
} catch(e){
    console.log(e)
}
}
// Method to populate transaction list of each family and display total donations to each family.
const getDataUserDonations = async (cuid: string) => {
    data_payout.value.familyCuid = cuid; 
    totalUserDonations = 0
    amount_distributed.value = 0;
    const { data: userData } = await useFetch('/api/family_donation', {
        method: 'GET',
        query: { familyCuid: cuid }
    })

    const { data: pageData } = await useFetch('/api/page_list', {
        method: 'GET',
        query: { family_cuid: cuid }
    })
    
    pages.value = pageData.value as unknown as Page[];
    donations.value = userData.value as unknown as PageDonation[];
    donations.value.forEach(element => {
        totalUserDonations += parseFloat((element.amount) as unknown as string);
    });

    pages.value.forEach(element => {
        if(parseFloat((element.amount_distributed) as unknown as string) > (amount_distributed.value as number) ){
            amount_distributed.value = parseFloat(element.amount_distributed as unknown as string)
        } 
    });
    amount_remaining.value = (totalUserDonations-parseFloat(amount_distributed.value as unknown as string))
    console.log(amount_distributed.value);
    console.log(amount_remaining.value);
};

const getDataPageDonations = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch('/api/page', {
    method: 'GET',
    query: { cuid: id }
})

pagesPayout.value = pageDataDB.value as unknown as Page[];
console.log(pagesPayout);
}

// Method to populate the drop down of families to chose donations to view from.
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
    })
    users.value = usersData.value as unknown as User[];
}

const save = async () => {
    await useFetch('/api/family_transaction_payout', {
        method: 'POST',
        body: ({ ...data_payout.value })
    })

}

if ((isAdmin.value as boolean)) {
    getDataUsers()
}

</script>

<template lang="pug">
div This is where you will put the list of transactions that have occurred for a family, including donations, payouts, and displaying the total balance to be paid out (incoming donations - outgoing payouts)
LinkButton(to='/') Back
.container.mx-auto    
    .well.well-sm
        h1.text-center.pt-9.text-xl(class="sm:text-3xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); font-weight: 700;") Family Transaction List
        //TitleComp Family Transaction List
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Select Family
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='data_user.cuid') Select the Family to view
                    option(v-for="(item, i) in users" :key="i" @click="getDataUserDonations(item.cuid)") {{ item.first_name + " " + item.last_name }}
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Total Donations
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
              px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(totalUserDonations) }}
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Select Family Page
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                //select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='pagesPayout.cuid') Select the Family to view
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" :modelValue="pagesPayout.cuid" @update:modelValue="newValue => pagesPayout.cuid = newValue")
                    option(v-for="(page, i) in pagesPayout" :key="i" @click="getDataPageDonations(page.cuid)") {{ page.page_name }}
        table.table.table-striped(style="width:100%;")
            thead
                tr
                    th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden") Page Name
                    th.px-8(style="width:25%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amount Raised
                    th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amount Remaining to distribute
                    th.px-8(style="width:25%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Cuid
                tr(v-for="(item, i) in pagesPayout" 
                    :key="i" 
                )
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.page_name }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised) }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount_raised-item.amount_distributed) }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}
        //.container(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
        //.py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Total Donations
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
              px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(page.amount_raised) }}
        .py-4.grid(class="sm:grid-cols-3")
            Label Amount left to distribute to family
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Amount left to distribute for page
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(amount_remaining_page) }}
        
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Donation record entry       
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Transaction Recording Date    
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data_payout.transaction_recording_date')
        label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Enter Amount to Record   
            .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
                span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
                input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" type="number" min="0.00" step="0.01" v-model='data_payout.amount_to_record' onblur="(this.type='number')" onfocus="(this.type='number')" required)
        .col-md-8.ml-4.pt-4.pr-5.flex
            input#anonymous(type='checkbox' class="sm:ml-1" name='allFunds' value='Bike')
            label.mt-4.ml-4.text-md(for='allFunds' class="sm:mt-0" style="letter-spacing: 0.35px;") Record all of amount left to distribute
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Enter transaction id from Stripe
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data_payout.transaction_id')
        .ml-9.mb-9.py-7.flex.flex-wrap.gap-2
            .col-md-10.py-2
                button.p-3.px-6.pt-2.bg-orange-500(@click="save" style="color: white; font-weight: 700; border-radius: 32px;") Record Transaction
        table.table.table-striped(style="width:100%;")
            thead
                tr
                    th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden") Transaction id
                    th.px-8(style="width:25%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation cuid
                    th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Name
                    th.px-8(style="width:25%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amounts
                tr(v-for="(item, i) in donations" 
                    :key="i" 
                )
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.transaction_id }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.Page.page_name }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount) }}
        //.container(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>
