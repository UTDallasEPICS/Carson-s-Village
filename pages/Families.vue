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
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
 
definePageMeta({
  middleware: ["advocate-guard"]
})

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
div(class="container bg-white mx-auto mt-1 w-11/12 sm:w-[1400px]")
    table(class="table-auto")
        thead
            tr(class="text-white")
                th(@click="SortCV(all_families, 'family_name')" class="font-poppins font-bold cursor-pointer p-2 bg-[#5aadc2] rounded-tl-3xl w-1/4 overflow-hidden")
                    label Family Name &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='family_name'" class="pr-1 pt-1")
                        ChevronUpIcon(class="h-6 inline-flex")
                    //span(v-else-if="order === 'desc' && OrderField==='family_name'" class="pr-1 pt-1")
                        ChevronDownIcon(class="h-6 inline-flex")
                    //span(v-else class="pr-1 pt-1")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(@click="SortCV(all_families, 'advocate_responsible')" class="font-poppins font-bold cursor-pointer w-[27.5%] bg-[#5aadc2]")
                    label Advocate Responsible &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='advocate_responsible'" class="pr-1 pt-1")
                        ChevronUpIcon(class="h-6 inline-flex")
                    //span(v-else-if="order === 'desc' && OrderField==='advocate_responsible'" class="pr-1 pt-1")
                        ChevronDownIcon(class="h-6 inline-flex")
                    //span(v-else class="pr-1 pt-1")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(@click="SortCV(all_families, '_count_family_members')" class="font-poppins font-bold cursor-pointer w-[15%] bg-[#5aadc2]")
                    label Family Members &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='_count_family_members'" class="pr-1 pt-1")
                        ChevronUpIcon(class="h-6 inline-flex")
                    //span(v-else-if="order === 'desc' && OrderField==='_count_family_members'" class="pr-1 pt-1")
                        ChevronDownIcon(class="h-6 inline-flex")
                    //span(v-else class="pr-1 pt-1")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(@click="SortCV(all_families, '_count_pages')" class="font-poppins font-bold cursor-pointer w-[15%] bg-[#5aadc2]")
                    label Pages &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='_count_pages'" class="pr-1 pt-1")
                        ChevronUpIcon(class="h-6 inline-flex")
                    //span(v-else-if="order === 'desc' && OrderField==='_count_pages'" class="pr-1 pt-1")
                        ChevronDownIcon(class="h-6 inline-flex")
                    //span(v-else class="pr-1 pt-1")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(@click="SortCV(all_families, 'stripe_account_id')" class="font-poppins font-bold cursor-pointer w-[12%] bg-[#5aadc2]")
                    label Onboarded &nbsp;
                    //span(v-if="order === 'asc' && OrderField==='email'" class="pr-1 pt-1")
                        ChevronUpIcon(class="h-6 inline-flex")
                    //span(v-else-if="order === 'desc' && OrderField==='email'" class="pr-1 pt-1")
                        ChevronDownIcon(class="h-6 inline-flex")
                    //span(v-else class="pr-1 pt-1")
                        ChevronUpDownIcon(class="h-6 inline-flex")
                th(class="font-poppins font-bold w-1/4 bg-[#5aadc2] rounded-tr-3xl") {{  "Editor" }}
            tr(v-for="(item, i) in all_families" 
                :key="i"
                :class="{'bg-gray-200': (i+1) % 2}" 
            )
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.family_name }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item?.AdvocateResponsible ? item?.AdvocateResponsible?.first_name + " " + item?.AdvocateResponsible?.last_name : "Not assigned"}}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.FamilyMembers.length }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.Pages.length }}
                td(class="font-poppins text-gray-dark font-bold text-center") {{ item.stripe_account_id ? 'Yes' : 'No' }}
                td
                    LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]" :to="`/EditFamily/${item.cuid}`") Edit
    div(class="container mx-auto w-auto sm:w-[1400px] bg-[#5aadc2] h-[50px] rounded-b-3xl")
div(class="mb-9 py-7 flex flex-wrap gap-2 place-content-center")
    div(class="px-2 mt-2")
        button(@click="prevPage") &lt
    div(class="px-2 mt-2")
        p {{  currentPage + 1 }}
    div(class="px-2 mt-2")
        button(@click="nextPage") >
</template>
