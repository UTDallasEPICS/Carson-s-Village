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
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

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

//page sorting
const order = ref('')
const OrderField = ref('')

function SortCV(users:any, OrderFields:string){
  OrderField.value = OrderFields as string
  if (order.value === ''){
    order.value = 'desc'
   } else if (order.value === 'desc') {
    order.value = 'asc'
   } else if (order.value === 'asc') {
    OrderField.value = ''
    order.value = ''
   }
   getDataUsers()
}

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
        query: { page_number: currentPage, sortedColumn:OrderField.value, order:order.value }, 
        watch: [currentPage]
    })
    if(OrderField.value) {
        users.value = usersData.value?.userData as unknown as User2[];
    } else {
        users.value = usersData.value?.unsorted_data as unknown as User2[];
    }
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
                th.font-poppins.font-bold.font-bold.p-2(style="color: white;--tw-bg-opacity: 1; background-color: #5aadc2;border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden")
                    button(@click="SortCV(users, 'last_name')") User Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='last_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='last_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="color: white; width: 25%; --tw-bg-opacity: 1; background-color: #5aadc2;")
                    button(@click="SortCV(users, 'family_name')") Family Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="color: white; width: 12.5%; --tw-bg-opacity: 1; background-color: #5aadc2;")
                    button(@click="SortCV(users, 'user_role')") User Role &nbsp;
                    span(v-if="order === 'asc' && OrderField==='user_role'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='user_role'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="color: white; --tw-bg-opacity: 1; background-color: #5aadc2;")
                    button(@click="SortCV(users, 'email')") User Email &nbsp;
                    span(v-if="order === 'asc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="width:25%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: #5aadc2; color: #5aadc2;") {{  "__________" }}
            tr(v-for="(item, i) in users" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.first_name + " " + item.last_name }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.Family?.family_name }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.user_role }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.email }}
                LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="--tw-bg-opacity: 1; white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/pageList/${item.cuid}?fromUsers=1`") View
    .container.mx-auto(class="w-auto sm:w-[1200px]" style="--tw-bg-opacity: 1; background-color: #5aadc2; height: 50px; border-radius: 0px 0px 60px 60px;")
.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentPage + 1 }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
</template>