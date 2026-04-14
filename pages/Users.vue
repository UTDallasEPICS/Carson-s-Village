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
import type { Family } from "~~/prisma/generated/models" 
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  middleware: ["advocate-guard"]
})

type User2 = {
    cuid: string;
    first_name: string;
    last_name: string;
    user_role: Object;
    email: string;
    address: string;
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
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
        if(isAuthorized.value) {
            getDataUsers()
        }
    } 
}

const prevPage = () => {
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
div(class="container bg-white mx-auto mt-1 max-w-[1100px]")
    table(class="table-auto border-separate border-spacing-0 rounded-t-xl border border-[#5aadc2] overflow-hidden")
        thead
            tr
                th(class="font-poppins font-bold font-bold p-2 text-white bg-[#5aadc2] w-[25%]")
                    button(@click="SortCV(users, 'last_name')") User Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='last_name'" class="pr-[3px] pt-[3px]")
                        ChevronUpIcon(class="h-6 inline-flex")
                    span(v-else-if="order === 'desc' && OrderField==='last_name'" class="pr-[3px] pt-[3px]")
                        ChevronDownIcon(class="h-6 inline-flex")
                    span(v-else class="pr-[3px] pt-[3px]")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(class="font-poppins font-bold text-white w-[25%] bg-[#5aadc2]")
                    button(@click="SortCV(users, 'family_name')") Family Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='family_name'" class="pr-[3px] pt-[3px]")
                        ChevronUpIcon(class="h-6 inline-flex")
                    span(v-else-if="order === 'desc' && OrderField==='family_name'" class="pr-[3px] pt-[3px]")
                        ChevronDownIcon(class="h-6 inline-flex")
                    span(v-else class="pr-[3px] pt-[3px]")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(class="font-poppins font-bold text-white w-[12.5%] bg-[#5aadc2]")
                    button(@click="SortCV(users, 'user_role')") User Role &nbsp;
                    span(v-if="order === 'asc' && OrderField==='user_role'" class="pr-[3px] pt-[3px]")
                        ChevronUpIcon(class="h-6 inline-flex")
                    span(v-else-if="order === 'desc' && OrderField==='user_role'" class="pr-[3px] pt-[3px]")
                        ChevronDownIcon(class="h-6 inline-flex")
                    span(v-else class="pr-[3px] pt-[3px]")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(class="font-poppins font-bold text-white bg-[#5aadc2]")
                    button(@click="SortCV(users, 'email')") User Email &nbsp;
                    span(v-if="order === 'asc' && OrderField==='email'" class="pr-[3px] pt-[3px]")
                        ChevronUpIcon(class="h-6 inline-flex")
                    span(v-else-if="order === 'desc' && OrderField==='email'" class="pr-[3px] pt-[3px]")
                        ChevronDownIcon(class="h-6 inline-flex")
                    span(v-else class="pr-[3px] pt-[3px]")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(class="font-poppins font-bold w-[25%] bg-[#5aadc2] text-white") User Editor
                th(class="font-poppins font-bold w-[25%] bg-[#5aadc2] text-white") User Pages
        tbody
            tr(v-for="(item, i) in users" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.first_name + " " + item.last_name }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.Family?.family_name }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.user_role }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.email }}
                td
                    LinkButton(
                      class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]"  
                      :to="`/EditUser/${item.cuid}`"
                    ) Edit
                    
                td
                    LinkButton(
                      class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]"  
                      :to="`/pageList/${item.cuid}?fromUsers=1`"
                    ) View
    div(class="border rounded-b-xl border-[#5aadc2] container mx-auto w-full max-w-[1100px] bg-[#5aadc2] h-[50px]")
div(class="mb-9 py-7 flex flex-wrap gap-2 place-content-center")
    div(class="px-2 mt-2")
        button(@click="prevPage") &lt
    div(class="px-2 mt-2")
        p {{  currentPage + 1 }}
    div(class="px-2 mt-2")
        button(@click="nextPage") >
</template>)
