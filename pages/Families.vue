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


const data_family = <Family>({
      cuid: '',
      family_name: '-',
      stripe_account_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      advocateCuid: '',
})
const Families = ref<Family[]>([])
const cvuser = useCookie<User>('cvuser')
const currentPage  = ref(0)
const totalLength = ref(0)
const familyCuid = ref("")

//page sorting
const order = ref('')
const OrderField = ref('')

function SortCV(families: Family[], OrderFields:string){
  OrderField.value = OrderFields as string
  if (order.value === ''){
    order.value = 'desc'
   } else if (order.value === 'desc') {
    order.value = 'asc'
   } else if (order.value === 'asc') {
    OrderField.value = ''
    order.value = ''
   }
   //getDataUsers()
}

const isAuthorized = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin")
const currentFamily = computed(() => all_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});

const { data: all_families } = await useFetch('/api/family', {
      method: 'GET',
      default() {
        return [] as any
      }
})

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUsers = async () => {
    /*const { data: usersData } = await useFetch('/api/users', {
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
    }*/
}

watch(familyCuid, () => {
  currentPage.value = 0
  //getDataUsers()
})

const nextPage = () => { 
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
        if(isAuthorized.value) {
            //getDataUsers()
        }
    } 
}

const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
        if(isAuthorized.value) {
            //getDataUsers()
        }
    } 
}

//if( (isAuthorized.value as boolean) == true )
  //await getDataUsers()
</script>

<template lang = "pug">
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1400px]" )
    table(style="table-layout: auto;")
        thead
            tr.text-white
                th.font-poppins.font-bold.cursor-pointer.p-2(style="background-color: #5aadc2; border-radius: 80px 0px 0px 0px; width:25%; overflow: hidden;" @click="SortCV(all_families, 'family_name')")
                    label Family Name &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    //span(v-else-if="order === 'desc' && OrderField==='family_name'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    //span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 27.5%; background-color: #5aadc2;" @click="SortCV(all_families, 'advocate_responsible')")
                    label Advocate Responsible &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='advocate_responsible'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    //span(v-else-if="order === 'desc' && OrderField==='advocate_responsible'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    //span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 15%; background-color: #5aadc2;" @click="SortCV(all_families, '_count_family_members')")
                    label Family Members &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='_count_family_members'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    //span(v-else-if="order === 'desc' && OrderField==='_count_family_members'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    //span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 15%; background-color: #5aadc2;" @click="SortCV(all_families, '_count_pages')")
                    label Pages &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='_count_pages'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    //span(v-else-if="order === 'desc' && OrderField==='_count_pages'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    //span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold.cursor-pointer(style="width: 12%; background-color: #5aadc2;" @click="SortCV(all_families, 'stripe_account_id')")
                    label Onboarded &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronUpIcon.h-6.inline-flex
                    //span(v-else-if="order === 'desc' && OrderField==='email'" style="padding-right:3px; padding-top: 3px;")
                        ChevronDownIcon.h-6.inline-flex
                    //span(v-else style="padding-right:3px; padding-top: 3px;")
                        ChevronUpDownIcon.h-6.inline-flex
                th.font-poppins.font-bold(style="width:25%; background-color: #5aadc2; border-radius: 0px 80px 0px 0px;") {{  "Editor" }}
            tr(v-for="(item, i) in all_families" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.family_name }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item?.AdvocateResponsible ? item?.AdvocateResponsible?.first_name + " " + item?.AdvocateResponsible?.last_name : "Not assigned"}}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.FamilyMembers.length }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.Pages.length }}
                td.font-poppins.text-gray-dark.font-bold.text-center {{ item.stripe_account_id ? 'Yes' : 'No' }}
                td
                    LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditFamily/${item.cuid}`") Edit
    .container.mx-auto(class="w-auto sm:w-[1400px]" style="background-color: #5aadc2; height: 50px; border-radius: 0px 0px 60px 60px;")
.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentPage + 1 }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
</template>
