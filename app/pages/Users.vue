<script lang = "ts" setup>
/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	Users.vue 
*	Lists all the users in the website
*	Located under "/Users"
*/
definePageMeta({
  middleware: ["admin-guard"]
})

import type { User, Page } from "@/types.d.ts"
import type { Family } from "~~/prisma/generated/models" 
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

type User2 = {
    id: string;
    name: string;
    role: string;
    email: string;
    address: string;
    phone: string;
    isActive: boolean;
    Pages: Page[];
    Family: Family;
}

const users = ref<User2[]>([])
const isAuthorized = computed(() => user.value?.role == "advocate" || user.value?.role == "admin")
const isAdmin = computed(() => user.value?.role === "admin")
const currentPage  = ref(0)
const totalLength = ref(0)
const showDeactivated = ref(false)
const actionError = ref('')
const headers = useRequestHeaders(['cookie'])

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
    if (!isAuthorized.value) return

    const usersData = await $fetch('/api/users', {
        method: 'GET',
        query: {
          page_number: currentPage.value,
          sortedColumn: OrderField.value,
          order: order.value,
          status: showDeactivated.value ? 'inactive' : 'active',
        },
        headers,
    })
    if(OrderField.value) {
        users.value = usersData?.userData as unknown as User2[];
    } else {
        users.value = usersData?.unsorted_data as unknown as User2[];
    }
    totalLength.value = usersData?.Pagination.total as unknown as number
}

const toggleDeactivatedFilter = () => {
  showDeactivated.value = !showDeactivated.value
  currentPage.value = 0
  getDataUsers()
}

const deactivateUser = async (userId: string) => {
  actionError.value = ''
  if (!confirm('Deactivate this user? They will be unable to sign in.')) return

  try {
    await $fetch('/api/user/deactivate', {
      method: 'PUT',
      body: { id: userId },
    })
    await getDataUsers()
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to deactivate user'
  }
}

const reactivateUser = async (userId: string) => {
  actionError.value = ''
  if (!confirm('Reactivate this user? They will be able to sign in again.')) return

  try {
    await $fetch('/api/user/reactivate', {
      method: 'PUT',
      body: { id: userId },
    })
    await getDataUsers()
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to reactivate user'
  }
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
    div(class="flex items-center gap-4 px-2 py-3")
        button(
          type="button"
          class="text-white px-4 py-2 rounded-full transition duration-300 bg-orange-999 hover:bg-green-600"
          @click="toggleDeactivatedFilter"
        ) {{ showDeactivated ? "Show active users" : "Show deactivated users" }}
        p(v-if="actionError" class="text-red-600 text-sm") {{ actionError }}
    table(class="table-auto border-separate border-spacing-0 rounded-t-xl border border-[#5aadc2] overflow-hidden")
        thead
            tr
                th(class="font-poppins font-bold font-bold p-2 text-white bg-[#5aadc2] w-[25%]")
                    button(@click="SortCV(users, 'name')") User Name &nbsp;
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
                    button(@click="SortCV(users, 'role')") User Role &nbsp;
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
                th(v-if="isAdmin" class="font-poppins font-bold w-[25%] bg-[#5aadc2] text-white") Status
        tbody
            tr(v-for="(item, i) in users" 
                :key="item.id"
                :class="{'bg-gray-200': (i+1) % 2, 'opacity-60': !item.isActive}" 
            )
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.name }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.Family?.family_name }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.role }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.email }}
                td
                    LinkButton(
                      class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]"  
                      :to="`/EditUser/${item.id}`"
                    ) Edit
                    
                td
                    LinkButton(
                      class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]"  
                      :to="`/PageList/${item.id}?fetch=user`"
                    ) View
                td(v-if="isAdmin")
                    button(
                      v-if="item.isActive"
                      type="button"
                      class="sm:my-2 transition duration-300 bg-red-600 hover:bg-red-700 text-white whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px] rounded-full"
                      @click="deactivateUser(item.id)"
                    ) Deactivate
                    button(
                      v-else
                      type="button"
                      class="sm:my-2 transition duration-300 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px] rounded-full"
                      @click="reactivateUser(item.id)"
                    ) Reactivate
    div(class="border rounded-b-xl border-[#5aadc2] container mx-auto w-full max-w-[1100px] bg-[#5aadc2] h-[50px]")
div(class="mb-9 py-7 flex flex-wrap gap-2 place-content-center")
    div(class="px-2 mt-2")
        button(@click="prevPage") &lt
    div(class="px-2 mt-2")
        p {{  currentPage + 1 }}
    div(class="px-2 mt-2")
        button(@click="nextPage") >
</template>)
