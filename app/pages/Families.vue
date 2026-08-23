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
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

definePageMeta({
  middleware: ["advocate-guard"]
})

const isAdmin = computed(() => user.value?.role === "admin")
const showDeactivated = ref(false)
const actionError = ref('')


const data_family = <Family>({
      id: '',
      family_name: '-',
      stripe_account_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      advocateCuid: '',
})
const Families = ref<Family[]>([])
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
}
const isAuthorized = computed(() => user.value?.role == "advocate" || user.value?.role == "admin")
const currentFamily = computed(() => all_families.value?.find(({ id }: Family) => id == familyCuid.value) || {});
const { data: all_families, refresh: refreshFamilies } = await useFetch('/api/family', {
      method: 'GET',
      default() {
        return [] as any
      }
})

const familiesToDisplay = computed(() => {
    if (!all_families.value) return []
    const filtered = all_families.value.filter((family: Family) => {
        if (showDeactivated.value) return !family.isActive
        return family.isActive === undefined || family.isActive
    })
    return filtered
})

const toggleDeactivatedFilter = () => {
  showDeactivated.value = !showDeactivated.value
  currentPage.value = 0
}

const deactivateFamily = async (familyId: string) => {
  actionError.value = ''
  if (!confirm('Deactivate this family? All family members will be unable to sign in.')) return

  try {
    await $fetch(`/api/family/${familyId}`, { method: 'DELETE' })
    await refreshFamilies()
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to deactivate family'
  }
}

const reactivateFamily = async (familyId: string) => {
  actionError.value = ''
  if (!confirm('Reactivate this family?')) return

  try {
    await $fetch(`/api/family/reactivate/${familyId}`, { method: 'PUT' })
    await refreshFamilies()
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to reactivate family'
  }
}

watch(familyCuid, () => {
  currentPage.value = 0
})

const nextPage = () => { 
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
    } 
}
const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
    } 
}

</script>

<template>
  <div class="container bg-white mx-auto mt-1 w-11/12 sm:w-[1400px]">
    <div class="flex items-center gap-4 px-2 py-3">
      <button
        type="button"
        class="text-white px-4 py-2 rounded-full transition duration-300 bg-orange-999 hover:bg-green-600"
        @click="toggleDeactivatedFilter"
      >
        {{ showDeactivated ? "Show active families" : "Show deactivated families" }}
      </button>
      <p
        v-if="actionError"
        class="text-red-600 text-sm"
      >
        {{ actionError }}
      </p>
    </div>
    <table class="table-auto">
      <thead>
        <tr class="text-white">
          <th
            class="font-poppins font-bold cursor-pointer p-2 bg-[#5aadc2] rounded-tl-3xl w-1/4 overflow-hidden"
            @click="SortCV(all_families, 'family_name')"
          >
            <label>Family Name &nbsp;</label>
          </th>
          <th
            class="font-poppins font-bold cursor-pointer w-[27.5%] bg-[#5aadc2]"
            @click="SortCV(all_families, 'advocate_responsible')"
          >
            <label>Advocate Responsible &nbsp;</label>
          </th>
          <th
            class="font-poppins font-bold cursor-pointer w-[15%] bg-[#5aadc2]"
            @click="SortCV(all_families, '_count_family_members')"
          >
            <label>Family Members &nbsp;</label>
          </th>
          <th
            class="font-poppins font-bold cursor-pointer w-[15%] bg-[#5aadc2]"
            @click="SortCV(all_families, '_count_pages')"
          >
            <label>Pages &nbsp;</label>
          </th>
          <th
            class="font-poppins font-bold cursor-pointer w-[12%] bg-[#5aadc2]"
            @click="SortCV(all_families, 'stripe_account_id')"
          >
            <label>Onboarded &nbsp;</label>
          </th>
          <th class="font-poppins font-bold w-1/4 bg-[#5aadc2]" :class="{'rounded-tr-3xl': !isAdmin}">
            {{ "Editor" }}
          </th>
          <th v-if="isAdmin" class="font-poppins font-bold w-1/4 bg-[#5aadc2] rounded-tr-3xl">
            Status
          </th>
        </tr>
        <tr
          v-for="(item, i) in familiesToDisplay"
          :key="i"
          :class="{'bg-gray-200': (i+1) % 2, 'opacity-60': !item.isActive}"
        >
          <td class="font-poppins text-gray-dark font-bold text-center">
            {{ item.family_name }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center">
            {{ item?.AdvocateResponsible ? item?.AdvocateResponsible?.first_name + " " + item?.AdvocateResponsible?.last_name : "Not assigned" }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center">
            {{ item.FamilyMembers.length }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center">
            {{ item.Pages.length }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center">
            {{ item.stripe_account_id ? 'Yes' : 'No' }}
          </td>
          <td>
            <LinkButton
              class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px]"
              :to="`/EditFamily/${item.id}`"
            >
              Edit
            </LinkButton>
          </td>
          <td v-if="isAdmin">
            <button
              v-if="item.isActive === undefined || item.isActive"
              type="button"
              class="sm:my-2 transition duration-300 bg-red-600 hover:bg-red-700 text-white whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px] rounded-full"
              @click="deactivateFamily(item.id)"
            >
              Deactivate
            </button>
            <button
              v-else
              type="button"
              class="sm:my-2 transition duration-300 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap flex flex-row py-[14px] px-[24px] gap-[10px] rounded-full"
              @click="reactivateFamily(item.id)"
            >
              Reactivate
            </button>
          </td>
        </tr>
      </thead>
    </table>
    <div class="container mx-auto w-auto sm:w-[1400px] bg-[#5aadc2] h-[50px] rounded-b-3xl" />
  </div>
  <div class="mb-9 py-7 flex flex-wrap gap-2 place-content-center">
    <div class="px-2 mt-2">
      <button @click="prevPage">
        &lt;
      </button>
    </div>
    <div class="px-2 mt-2">
      <p>{{ currentPage + 1 }}</p>
    </div>
    <div class="px-2 mt-2">
      <button @click="nextPage">
        >
      </button>
    </div>
  </div>
</template>
