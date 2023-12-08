<script lang = "ts" setup>
/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	Users.vue 
*	Lists all the users in the website
*	Located under "/Users"
*/

import type { User, Page } from "@/types.d.ts"
import { Family } from "@prisma/client" 
type User2 = {
    cuid: string;
    first_name: string;
    last_name: string;
    user_role: Object;
    email: string;
    middle_name: string;
    phone: string;
    Pages: Page[];
    Family: Family;
}

const users = ref<User2[]>([])
const cvuser = useCookie<User>('cvuser')
const isAuthorized = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin")
const currentPage  = ref(0)
const totalLength = ref(0)

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
        query: { page_number: currentPage}
    })
    users.value = usersData.value?.userData as unknown as User2[];
    totalLength.value = usersData.value?.Pagination.total as unknown as number
}

const nextPage = () => { 
    console.log((totalLength.value / 12) -1 )
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
        if(isAuthorized.value) {
            getDataUsers()
        }
    } 
}

const prevPage= () => {
    if(currentPage.value != 0){
        currentPage.value--
        if(isAuthorized.value) {
            getDataUsers()
        }
    } 
}

if( (isAuthorized.value as boolean) == true )
  await getDataUsers()
</script>

<template lang = "pug">
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1200px]" )
    table(style="table-layout: auto;")
        thead
            tr
                th.font-poppins.font-bold.font-bold.p-2(style="color: white;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:20%; overflow: hidden") User Names
                th.font-poppins.font-bold(style="color: white; width: 20%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User ID
                th.font-poppins.font-bold(style="color: white; width: 20%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Family Name
                th.font-poppins.font-bold(style="color: white; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User Role
                th.font-poppins.font-bold(style="color: white; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User Email
                th.font-poppins.font-bold(style="width:20%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); color: rgb(110 171 191 / var(--tw-bg-opacity));") {{  "__________" }}
            tr(v-for="(item, i) in users" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.first_name + " " + item.last_name }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.cuid }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.Family?.family_name }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.user_role }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.email }}
                LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/pageList/${item.cuid}?fromUsers=1`") View
    .container.mx-auto(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); height: 50px; border-radius: 0px 0px 60px 60px;")
.ml-9.mb-9.py-7.flex.flex-wrap.gap-2
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentPage }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
</template>