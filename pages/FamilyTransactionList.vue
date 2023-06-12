<script lang="ts" setup>

/*  Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Allows the website administrator to see incoming and outgoing donations
*	Located under "/FamilyTransactionList/"
*/

import type { User, PageDonation } from "@/types.d.ts"
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

let totalUserDonations = 0;
const users = ref<User[]>([])
const donations = ref<PageDonation[]>([])
const cvuser = useCookie<User>('cvuser')
const family_cuid_data = computed(() => cvuser.value?.cuid)
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUser = async (cuid: string) => {
    const { data: userData } = await useFetch('/api/user', {
        method: 'GET',
        query: { familyCuid: cuid }
    })
    data_user.value = userData.value as unknown as User;
}

// Method to populate transaction list of each family and display total donations to each family.
const getDataUserDonations = async (cuid: string) => {
    const { data: userData } = await useFetch('/api/family_donation', {
        method: 'GET',
        query: { familyCuid: cuid }
    })

    donations.value = userData.value as unknown as PageDonation[];
    donations.value.forEach(element => {
        totalUserDonations += parseFloat((element.amount) as unknown as string);
    });
    console.log(totalUserDonations);
}

// Method to populate the drop down of families to chose donations to view from.
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
    })
    users.value = usersData.value as unknown as User[];
}

onMounted(() => {
    if ((isAdmin.value as boolean)) {
        getDataUsers()
    }
})

</script>

<template lang="pug">
div This is where you will put the list of transactions that have occurred for a family, including donations, payouts, and displaying the total balance to be paid out (incoming donations - outgoing payouts)
LinkButton(to='/') Back
//.container.overflow-hidden.mt-4.mx-auto.place-content-center.font-sans.well.well-sm(class="w-5/6 sm:max-w-xl sm:p-6" style="box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
.container.mx-auto    
    .well.well-sm
        h1.text-center.pt-9.text-xl(class="sm:text-3xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); font-weight: 700;") Family Transaction List
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Select Family
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='data_user.cuid') Select the Family to view
                    option(v-for="(item, i) in users" :key="i" @click="getDataUserDonations(item.cuid)") {{ item.first_name + " " + item.last_name }}
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Total Donations
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11") 
                px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ donationFormat(totalUserDonations) }}
        table.table.table-striped(style="width:100%;")
            thead
                tr
                    th.px-8(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:33%; overflow: hidden") Transaction id
                    th.px-8(style="width:34%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation cuid
                    //th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));")
                    th.px-8(style="width:33%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Amounts
                tr(v-for="(item, i) in donations" 
                    :key="i" 
                )
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.transaction_id }}
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ item.cuid }}
                    //td
                    td.font-poppins.text-gray-dark.font-bold(style="text-align: center")  {{ donationFormat(item.amount) }}
        //.container(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>
