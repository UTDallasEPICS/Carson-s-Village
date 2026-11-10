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
type FamiliesTab = 'active' | 'deactivated' | 'pending'
const activeTab = ref<FamiliesTab>('active')
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

type PendingReferral = {
  id: string
  inviteeName: string
  inviteeEmail: string
  note: string
  status: string
  createdAt: string
  Requester?: { id: string; name: string; email: string }
}

const { data: pendingReferrals, refresh: refreshPending } = await useFetch<PendingReferral[]>(
  '/api/family-referral',
  {
    query: { status: 'pending' },
    default: () => [],
  }
)

const familiesToDisplay = computed(() => {
    if (!all_families.value) return []
    if (activeTab.value === 'active') {
      return all_families.value.filter((family: Family) => family.isActive === undefined || family.isActive)
    }
    if (activeTab.value === 'deactivated') {
      return all_families.value.filter((family: Family) => !family.isActive)
    }
    return []
})

const setTab = (tab: FamiliesTab) => {
  activeTab.value = tab
  currentPage.value = 0
  actionError.value = ''
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

const selectedReferral = ref<PendingReferral | null>(null)
const referralActionBusy = ref(false)

const openReferralPopup = (referral: PendingReferral) => {
  actionError.value = ''
  selectedReferral.value = referral
}

const closeReferralPopup = () => {
  if (referralActionBusy.value) return
  selectedReferral.value = null
}

const approveReferral = async () => {
  if (!selectedReferral.value || referralActionBusy.value) return
  actionError.value = ''
  referralActionBusy.value = true

  try {
    await $fetch(`/api/family-referral/${selectedReferral.value.id}/approve`, { method: 'POST' })
    selectedReferral.value = null
    await Promise.all([refreshPending(), refreshFamilies()])
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to approve referral'
  } finally {
    referralActionBusy.value = false
  }
}

const rejectReferral = async () => {
  if (!selectedReferral.value || referralActionBusy.value) return
  actionError.value = ''
  referralActionBusy.value = true

  try {
    await $fetch(`/api/family-referral/${selectedReferral.value.id}/reject`, { method: 'POST' })
    selectedReferral.value = null
    await refreshPending()
  } catch (error: any) {
    actionError.value = error?.data?.statusMessage || error?.data?.message || 'Failed to reject referral'
  } finally {
    referralActionBusy.value = false
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
    <div class="flex flex-wrap items-center gap-2 px-2 py-3">
      <button
        type="button"
        class="text-white px-4 py-2 rounded-full transition duration-300"
        :class="activeTab === 'active' ? 'bg-green-600' : 'bg-orange-999 hover:bg-green-600'"
        @click="setTab('active')"
      >
        Active families
      </button>
      <button
        type="button"
        class="text-white px-4 py-2 rounded-full transition duration-300"
        :class="activeTab === 'deactivated' ? 'bg-green-600' : 'bg-orange-999 hover:bg-green-600'"
        @click="setTab('deactivated')"
      >
        Deactivated families
      </button>
      <button
        type="button"
        class="text-white px-4 py-2 rounded-full transition duration-300"
        :class="activeTab === 'pending' ? 'bg-green-600' : 'bg-orange-999 hover:bg-green-600'"
        @click="setTab('pending')"
      >
        Pending families
      </button>
      <p
        v-if="actionError"
        class="text-red-600 text-sm"
      >
        {{ actionError }}
      </p>
    </div>

    <table
      v-if="activeTab !== 'pending'"
      class="table-auto"
    >
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
            <label>Stripe &nbsp;</label>
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
            <AdvocateName
              :name="item?.AdvocateResponsible?.name"
              :is-active="item?.AdvocateResponsible?.isActive"
            />
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

    <table
      v-else
      class="table-auto w-full"
    >
      <thead>
        <tr class="text-white">
          <th class="font-poppins font-bold p-2 bg-[#5aadc2] rounded-tl-3xl">
            Invitee
          </th>
          <th class="font-poppins font-bold p-2 bg-[#5aadc2]">
            Requester
          </th>
          <th class="font-poppins font-bold p-2 bg-[#5aadc2]">
            Submitted
          </th>
          <th class="font-poppins font-bold p-2 bg-[#5aadc2] rounded-tr-3xl"></th>
        </tr>
        <tr
          v-for="(item, i) in pendingReferrals"
          :key="item.id"
          :class="{'bg-gray-200': (i+1) % 2}"
        >
          <td class="font-poppins text-gray-dark font-bold text-center p-2">
            {{ item.inviteeName }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center p-2">
            {{ item.Requester?.name || '—' }}
          </td>
          <td class="font-poppins text-gray-dark font-bold text-center p-2">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </td>
          <td>
            <button
              type="button"
              class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 text-white whitespace-nowrap flex flex-row mx-auto py-[14px] px-[24px] gap-[10px] rounded-full font-bold"
              @click="openReferralPopup(item)"
            >
              Review
            </button>
          </td>
        </tr>
      </thead>
    </table>
    <p
      v-if="activeTab === 'pending' && !pendingReferrals?.length"
      class="px-4 py-6 text-gray-700"
    >
      No pending family referrals.
    </p>
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

  <div
    v-if="selectedReferral"
    class="flex z-50 items-center justify-center fixed inset-0 bg-black/70 p-4"
    @click.self="closeReferralPopup"
  >
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-xl max-h-full overflow-y-auto p-6 font-poppins">
      <button
        type="button"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl w-10 h-10"
        @click="closeReferralPopup"
      >
        x
      </button>
      <h2 class="text-xl font-bold mb-4 pr-8">
        Review family referral
      </h2>
      <dl class="space-y-3 text-gray-dark">
        <div>
          <dt class="text-md font-semibold text-gray-600">
            Invitee
          </dt>
          <dd class="pl-2 text-sm">
            <b>Name: </b>{{ selectedReferral.inviteeName }}
          </dd>
          <dd class="pl-2 text-sm">
            <b>Email: </b>{{ selectedReferral.inviteeEmail }}
          </dd>
        </div>
        <div>
          <dt class="text-md font-semibold text-gray-600">
            Requester
          </dt>
          <dd class="pl-2 text-sm">
            <b>Name: </b>{{ selectedReferral.Requester?.name || '—' }}
          </dd>
          <dd class="pl-2 text-sm">
            <b>Email: </b>{{ selectedReferral.Requester?.email || '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-md font-semibold text-gray-600">
            Submitted
          </dt>
          <dd class="pl-2 text-sm">
            {{ new Date(selectedReferral.createdAt).toLocaleString("en-US", {timeStyle: 'short', dateStyle: 'short'}) }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-semibold text-gray-600">
            Note
          </dt>
          <dd class="whitespace-pre-wrap break-words mt-1 rounded border border-gray-200 bg-gray-50 p-3 min-h-[6rem]">
            {{ selectedReferral.note || 'No note provided.' }}
          </dd>
        </div>
      </dl>
      <p
        v-if="actionError"
        class="text-red-600 text-sm mt-4"
      >
        {{ actionError }}
      </p>
      <div class="flex flex-wrap gap-3 justify-end mt-6">
        <button
          type="button"
          class="transition duration-300 bg-red-600 hover:bg-red-700 text-white py-[10px] px-[18px] rounded-full disabled:opacity-60"
          :disabled="referralActionBusy"
          @click="rejectReferral"
        >
          Reject
        </button>
        <button
          type="button"
          class="transition duration-300 bg-green-600 hover:bg-green-700 text-white py-[10px] px-[18px] rounded-full disabled:opacity-60"
          :disabled="referralActionBusy"
          @click="approveReferral"
        >
          Approve
        </button>
      </div>
    </div>
  </div>
</template>
