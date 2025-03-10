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
import type { Family } from "@prisma/client" 
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'



const users = ref<User[]>([])
const cvuser = useCookie<User>('cvuser')
const currentPage  = ref(0)
const totalLength = ref(0)
const familyCuid = ref("")
const tableToggle = ref(true)

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

const isAuthorized = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin")
const isAdmin = computed(() => cvuser.value?.user_role == 'admin')
const currentFamily = computed(() => all_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});

const { data: all_families } = await useFetch('/api/family', {
      method: 'GET',
      transform: (data) =>  [{family_name: "None", cuid: ""} ,...data],
      default() {
        return [] as any
      }
})

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
        query: { page_number: currentPage, sortedColumn: OrderField.value, order: order.value, familyCuid: familyCuid.value }, 
        watch: [currentPage]
    })
    if(OrderField.value && familyCuid.value) {
        users.value = usersData.value?.filtered_user_data as unknown as User[];
        totalLength.value = usersData.value?.Pagination.total_family as unknown as number
    } else if(OrderField.value && !familyCuid.value) {
        users.value = usersData.value?.all_sorted_data as unknown as User[];
        totalLength.value = usersData.value?.Pagination.total as unknown as number
    } else if(!OrderField.value && familyCuid.value) {
        users.value = usersData.value?.filtered_unsorted_user_data as unknown as User[];
        totalLength.value = usersData.value?.Pagination.total_family as unknown as number
    } else {
        users.value = usersData.value?.unsorted_data as unknown as User[];
        totalLength.value = usersData.value?.Pagination.total as unknown as number
    }
}

watch(familyCuid, () => {
  currentPage.value = 0
  getDataUsers()
})

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

const ArchiveUser = async (user: User) => {
      if(isAuthorized.value) {
        let booleanChanged = false 
        if(user.isActive) {
          const confirmDeactivate = confirm('Are you sure you want to deactivate this user?')
            if(confirmDeactivate) {
              user.isActive = false
              booleanChanged = true
            } else if(!confirmDeactivate){
              return ""
            }
        } else if(!user.isActive && !booleanChanged) {
          const confirmReactivate = confirm('Are you sure you want to reactivate this user?')
          if(confirmReactivate) {
            user.isActive = true

            booleanChanged = true
          } else if(!confirmReactivate){
            return ""
          }
      } else if(!user.isActive && !booleanChanged) {
        const confirmReactivate = confirm('Are you sure you want to reactivate this user?')
        if(confirmReactivate) {
          user.isActive = true
          booleanChanged = true
        } else if(!confirmReactivate) {
        return ""
        }
       }
          booleanChanged = false  
          if(!user.isActive) {       
            const deleteUser = await $fetch(`api/user/${user.cuid}`, {
                method: 'DELETE',
                body: { ...user}
            })
        } else {
            const reactivateUser = await $fetch(`/api/user/reactivate/${user.cuid}`, {
                method: 'PUT',
                body: { ...user}
            })
        }

    }

  }

if( (isAuthorized.value as boolean) == true )
  await getDataUsers()
</script>

<template lang = "pug">
.flex.w-full.justify-center  
    button(type="button" class="ml-4 my-4 text-white px-4 py-2 rounded-full w-32 transition duration-300 bg-orange-999 hover:bg-green-600" @click="tableToggle = !tableToggle") {{ tableToggle ? "All Users" : "Archive"}}
    .py-4.grid(class="sm:grid-cols-3" v-if="(isAuthorized)")
        CVLabel Current Family
        .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
            Listbox.shadow-sm.border.border-1.rounded-lg(v-if="isAuthorized" as='div' v-model="familyCuid")
                .relative
                    Transition(
                            leave-active-class='transition ease-in duration-100'
                            leave-from-class='opacity-100'
                            leave-to-class='opacity-0'
                            )
                    ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                        ListboxOption(as='div' v-for="family in all_families" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to view users from' }} 
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1500px]" )
    table(style="table-layout: auto;")
        thead
            tr.text-white
                th.font-poppins.font-bold.cursor-pointer.p-2(style="color: white;background-color: #5aadc2; border-radius: 60px 0px 0px 0px; width:25%; overflow: hidden" @click="SortCV(users, 'last_name')")
                    label User Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='last_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='last_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 25%; background-color: #5aadc2;" @click="SortCV(users, 'family_name')")
                    label Family Name &nbsp;
                    span(v-if="order === 'asc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 15%; background-color: #5aadc2;" @click="SortCV(users, 'user_role')")
                    label User Role &nbsp;
                    span(v-if="order === 'asc' && OrderField==='user_role'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='user_role'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 15%; background-color: #5aadc2;" @click="SortCV(users, '_count')")
                    label Pages Created &nbsp;
                    span(v-if="order === 'asc' && OrderField==='_count'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='_count'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 12%; background-color: #5aadc2;" @click="SortCV(users, 'email')")
                    label User Email &nbsp;
                    span(v-if="order === 'asc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 10%; background-color: #5aadc2; color: white;" v-if="isAdmin" @click="SortCV(users, 'isActive')")
                    label User Status &nbsp;
                    span(v-if="order === 'asc' && OrderField==='isActive'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    span(v-else-if="order === 'desc' && OrderField==='isActive'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="width: 25%; background-color: #5aadc2; color: white;") {{  "User Editor" }}
                th.font-poppins.font-bold(style="width: 25%; border-radius: 0px 60px 0px 0px; background-color: #5aadc2; color: white;") {{  "Pages" }}
            tr(v-for="(item, i) in (tableToggle ? users.filter(item => item.isActive) : users)" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.first_name + " " + item.last_name }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Family?.family_name }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.user_role }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Pages.length }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.email }}
                td
                    button.text-white.font-poppins.font-bold.rounded-full(class="sm:my-2 transition" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px; background-color: red;" @click="ArchiveUser(item)" v-if="isAdmin") {{ item.isActive ? "Archive" : "Reactivate" }}
                td
                    LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditUser/${item.cuid}`") Edit
                    
                td
                    LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/pageList/${item.cuid}?fromUsers=1`") View
    .container.mx-auto(class="w-auto sm:w-[1500px]" style="background-color: #5aadc2; height: 50px; border-radius: 0px 0px 60px 60px;")
.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentPage + 1 }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
</template>
