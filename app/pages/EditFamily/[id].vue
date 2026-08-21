<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditFamily.vue 
*	Denotes functions specific to family creation  
*	Located under "/EditFamily/"
*/
definePageMeta({
  middleware: ["family-guard"]
})

import CVPhoneInput from '@/components/CVPhoneInput.vue';
import type { User } from '@/types.d.ts'
import type { Family } from '~~/prisma/generated/models';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { vElementSize } from '@vueuse/components'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)


const data_user = ref<User>({
    id: "",
    name: "",
    email: "",
    role: "family",
    phone: "",
    address: "",
    Pages: [],
    familyId: "",
    AdvocateFamily: []
})
const userCuid = ref("")

const router = useRoute()
const id = computed(() => router.params.id as string);
const isAuthorized = computed(() => user.value?.role == "advocate" || user.value?.role == "admin")
const canManageFamily = computed(() => user.value && data_family.value && (user.value.role === 'admin' || (user.value.role === 'advocate' && user.value.id === data_family.value.advocateCuid)))
const errorInPage = ref(false);
const errorToUser = ref('');

const advocates = ref<User[]>([])
const selectedAdvocateId = ref<string | null>(null)

const { data: data_family, refresh: refreshFamily } = await useFetch(
  `/api/family/${id.value}`,
  {
    default: () => ({} as any)
  }
)

const deactivateMember = async (member: User) => {
  if (!confirm('Deactivate this user? They will be unable to sign in.')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch('/api/user/deactivate', {
      method: 'PUT',
      body: { id: member.id },
    })
    await refreshFamily()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message ?? 'Failed to deactivate user'
  }
}

const reactivateMember = async (member: User) => {
  if (!confirm('Reactivate this user? They will be able to sign in again.')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch('/api/user/reactivate', {
      method: 'PUT',
      body: { id: member.id },
    })
    await refreshFamily()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message || 'Failed to reactivate user'
  }
}

if (data_family.value && data_family.value.advocateCuid) {
  selectedAdvocateId.value = data_family.value.advocateCuid as string
}

const { data: advocatesData } = await useFetch<User[]>('/api/advocates')
if (advocatesData.value) {
  advocates.value = advocatesData.value
}

const currentAdvocateName = computed(() => {
  if (data_family.value?.AdvocateResponsible) {
    const adv = data_family.value.AdvocateResponsible as any
    return `${adv.name ?? `${adv.first_name ?? ''} ${adv.last_name ?? ''}`}`.trim()
  }
  return 'Not assigned'
})

const selectedAdvocateLabel = computed(() => {
  if (!selectedAdvocateId.value) {
    return 'None'
  }
  const adv = advocates.value.find(a => a.id === selectedAdvocateId.value)
  return adv?.name || 'None'
})

// Method creates a new family on the backend and adds the first user
const createFamily = async () => {
  if (isAuthorized.value) {
    if (id.value !== '0') {
      const confirmChange = window.confirm('Are you sure you want to save changes to this family, including any advocate changes?')
      if (!confirmChange) {
        return
      }
      try {
        const body: {
          family_name: string
          familyCuid: string
          advocateCuid: string | null
          acceptingDonations: boolean
          name?: string
          email?: string
          phone?: string
          address?: string
        } = {
          family_name: data_family.value.family_name,
          familyCuid: id.value,
          advocateCuid: selectedAdvocateId.value,
          acceptingDonations: data_family.value.acceptingDonations
        }

        if (data_user.value.email && data_user.value.name) {
          body.name = data_user.value.name
          body.email = data_user.value.email
          body.phone = data_user.value.phone
          body.address = data_user.value.address
        }
        const result = await $fetch('/api/family', {
          method: 'PUT',
          body
        })

        if (result) {
          errorInPage.value = false;
          await navigateTo('/Families')
        } else {
          errorInPage.value = true;
          errorToUser.value = 'Failed to update family';
        }
      } catch (error: any) {
        errorInPage.value = true;
        errorToUser.value = error?.data?.message ?? 'Failed to update family';
      }
    } else {
      try {
        const result = await $fetch('/api/family', {
          method: 'POST',
          body: ({
            family_name: data_family.value.family_name,
            name: data_user.value.name,
            email: data_user.value.email,
            phone: data_user.value.phone,
            address: data_user.value.address,
            acceptingDonations: !!data_family.value.acceptingDonations
          })
        })

        if (result) {
            errorInPage.value = false;
            await navigateTo('/Users')
        } else {
          errorInPage.value = true;
          errorToUser.value = 'Failed to create family'; 
        }
      } catch (error: any) {
        errorInPage.value = true;
        errorToUser.value = error?.data?.message ?? 'Failed to create family';
      }
    }
  } 
}

const deactivateFamily = async () => {
  if (!confirm('Deactivate this family? All associated users will be unable to sign in.')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch(`/api/family/${id.value}`, {
      method: 'DELETE',
    })
    await refreshFamily()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message ?? 'Failed to deactivate family'
  }
}

const reactivateFamily = async () => {
  if (!confirm('Reactivate this family?')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch(`/api/family/reactivate/${id.value}`, {
      method: 'PUT',
    })
    await refreshFamily()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message || 'Failed to reactivate family'
  }
}

</script>

<template>
  <CVContainer>
    <form class="p-3 rounded bg-gray-50">
      <TitleComp>Family Creation</TitleComp>
      <br>
      <div class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999">
        <CVLegend>Family Information</CVLegend>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel for="family_name">
          Family Name
        </CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <CVInput
            id="family_name"
            v-model="data_family.family_name"
            placeholder="(user defined)"
            required="required"
          />
        </div>
      </div>
      <div
        v-if="id !== '0'"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel for="advocate">
          Advocate Responsible
        </CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <p class="mb-2 text-sm text-gray-700">
            Current advocate: {{ currentAdvocateName }}
          </p>
          <Listbox
            id="advocate"
            v-model="selectedAdvocateId"
            as="div"
            class="shadow-sm border border-1 rounded-lg"
          >
            <div class="relative">
              <Transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              />
              <ListboxOptions as="div" class="w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption
                  key="no-advocate"
                  :value="null"
                  class="px-2 border border-grey-500 py-1 my-1"
                >
                  {{ !selectedAdvocateId ? "None" : "Remove Advocate" }}
                </ListboxOption>
                <ListboxOption
                  v-for="advocate in advocates"
                  :key="advocate.id"
                  :value="advocate.id"
                  class="px-2 border border-grey-500 py-1 my-1"
                >
                  {{ advocate.name }}
                </ListboxOption>
              </ListboxOptions>
              <ListboxButton class="text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96">
                {{ selectedAdvocateLabel }}
              </ListboxButton>
            </div>
          </Listbox>
        </div>
      </div>
      <div
        v-if="canManageFamily && id !== '0'"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel>Family Status</CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11 flex items-center gap-4">
          <span
            class="font-poppins mt-6 font-bold"
            :class="data_family.isActive ? 'text-green-700' : 'text-red-600'"
          >
            {{ data_family.isActive ? 'Active' : 'Deactivated' }}
          </span>
        </div>
      </div>

      <!-- Donation Settings -->
      <div class="information rounded-md mx-9 mt-6 text-center sm:text-start text-white bg-blue-999">
        <CVLegend>Donation Settings</CVLegend>
      </div>
      <div class="mt-2 mb-6 grid sm:grid-cols-3">
        <CVLabel for="accepting_donations">
          Accepting Donations
        </CVLabel>
        <div class="mx-9 mt-6 sm:col-span-2 sm:mr-11">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="accepting_donations"
              v-model="data_family.acceptingDonations"
              type="checkbox"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>

      <!-- Family Members Section -->
      <div v-if="id !== '0' && data_family.FamilyMembers && data_family.FamilyMembers.length > 0">
        <div class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999">
          <CVLegend>Family Members</CVLegend>
        </div>
        <div class="mx-9 sm:col-span-2 sm:mr-11 py-4">
          
          <!-- Active Family Member List -->
          <ul v-if="data_family.FamilyMembers.filter((member) => !!member.isActive).length > 0" class="space-y-2">
            <li v-for="member in data_family.FamilyMembers.filter((member) => !!member.isActive)" :key="member.id" class="flex items-center justify-between">
              <div>
                <span :class="{ 'text-red-600': !member.isActive }">{{ member.name }} ({{ member.email }})</span>
              </div>
              <div v-if="isAuthorized">
                <ActionButton
                  v-if="member.isActive"
                  text="Deactivate"
                  class="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  @click="deactivateMember(member)"
                />
              </div>
            </li>
          </ul>

          <!-- Fallback if no active member -->
          <div v-else class="pl-2">
            No Active Family Members
          </div>
        </div>
      </div>

      <div class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999">
        <CVLegend>New User Information</CVLegend>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel for="email">
          Email
        </CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <CVInput
            id="email"
            v-model="data_user.email"
            type="email"
            placeholder="(user defined)"
            required="required"
          />
        </div>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel for="first_name">
          Name
        </CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <CVInput
            id="first_name"
            v-model="data_user.name"
            placeholder="(user-defined)"
            required="required"
          />
        </div>
      </div>
      <div class="pt-4 grid sm:grid-cols-3">
        <CVLabel for="phone">
          Phone
        </CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <CVPhoneInput
            id="phone"
            v-model="data_user.phone"
            placeholder="(user defined, optional)"
          />
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="errorInPage"
        class="grid sm:grid-cols-3 text-red-500"
      >
        <CVLabel for="error_label">
          {{ errorToUser }}
        </CVLabel>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between ml-9 mr-10 mt-6">
        <ActionButton
          text="Save"
          class="transition duration-300 bg-orange-999 hover:bg-green-600"
          @click="createFamily()"
        />
        <template v-if="canManageFamily && id !== '0'">
          <ActionButton
            v-if="data_family.isActive"
            text="Deactivate Family"
            type="button"
            class="transition duration-300 bg-red-600 hover:bg-red-700"
            @click="deactivateFamily"
          />
          <ActionButton
            v-else
            text="Reactivate Family"
            type="button"
            class="transition duration-300 bg-green-600 hover:bg-green-700"
            @click="reactivateFamily"
          />
        </template>
      </div>
    </form>
  </CVContainer>
</template>
