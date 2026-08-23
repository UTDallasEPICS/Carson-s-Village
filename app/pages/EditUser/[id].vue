<script lang="ts" setup>

/*
*   Ethan Emmanuel, Rishab Medhi and Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditUser.vue 
*	Denotes functions specific to user insertion  
*	Located under "/EditUser/"
*/
definePageMeta({
  middleware: ['family-guard']
})

import CVPhoneInput from '@/components/CVPhoneInput.vue';
import type { User, Family } from '@/types.d.ts'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)


const data_all_families = ref<Family[]>([])
const router = useRoute()
const isAuthorized = computed(() => user.value?.role === "advocate" || user.value?.role === "admin")
const isAdmin = computed(() => user.value?.role === "admin")
const id = computed(() => router.params.id as string);
const errorInPage = ref(false);
const errorToUser = ref("")

const data_user = ref<User>({
    id: id.value,
    name: "",
    email: "",
    role: "family",
    isActive: true,
    phone: "",
    address: "",
    familyId: "",
    Pages: [],
    AdvocateFamily: []
})

const disableCriteria = computed(() => !data_user.value?.email || !data_user.value?.name || (addingFamily.value && !data_user.value?.familyId))

const advocateFamilies = computed(() => data_user.value.AdvocateFamily || [])
const unassignedFamilies = computed(() => {
  return data_all_families.value.filter((family: Family) => {
    return !family.advocateCuid || family.advocateCuid !== data_user.value.id
  })
})

const selectedFamilyForAssignment = ref<string | null>(null)

// Method that creates a new user on the database on the backend
const formRef = ref<InstanceType<typeof CVForm> | null>(null);
function submitForm() {
  formRef.value?.submit();
}
async function save() {
  if(isAuthorized.value){
    // --- Create User ------------------------
    if ((id.value as string) === "0") {
      try {
        const data = await $fetch('/api/user', {
          method: 'POST',
          body: ({ ...data_user.value })
        })

        if(data?.success){
          errorInPage.value = false;
          errorToUser.value = ""
          await navigateTo('/Users')
        }
      } catch (error: any) {
        errorInPage.value = true 
        errorToUser.value = error?.data?.message ?? 'Failed to create user';
      }
    }

    // --- Update User ------------------------
    else {
      try {
        const data = await $fetch('/api/user', {
          method: 'PUT',
          body: ({ ...data_user.value })
        })

        if(data?.success){
            errorInPage.value = false;
            errorToUser.value = ""
            await navigateTo('/Users')
        }
      } catch (error: any) {
        errorInPage.value = true 
        errorToUser.value = error?.data?.message ?? 'Failed to update user';
      }
    }
  }
}

const currentFamily = computed(() => data_all_families.value?.find((f: Family) => getFamilyId(f) == data_user.value?.familyId) || {});

const getFamilyId = (family: Family) => (family as Family & { id?: string }).id ?? family.cuid

// Method to populate the form when editing a pre-existing user
const { data: _user, refresh: _refreshUser } = await useFetch<User>(() => `/api/user?cuid=${id.value}`, { immediate: false })
const getData = async () => {
  await _refreshUser()
  if (_user.value) {
    data_user.value = _user.value
  }
}

// boolean indicating that we need the family selection listbox
const addingFamily = computed(() => data_user.value.role == "family")

const { data: _families, refresh: getUsers } = await useFetch<Family[]>('/api/family')

watch(_families, (families) => {
  if (families) {
    data_all_families.value = families
  }
}, { immediate: true })

if ((id.value as string) !== "0") {
  await getData();
}

const updateFamilyAdvocate = async (familyId: string, advocateId: string | null, familyName?: string) => {
  if (!isAdmin.value) {
    return
  }
  const confirmChange = window.confirm(
    advocateId
      ? 'Are you sure you want to assign this family to this advocate?'
      : 'Are you sure you want to remove this family from this advocate?'
  )
  if (!confirmChange) {
    return
  }

  const family = data_all_families.value.find((f: Family) => getFamilyId(f) === familyId)
  const resolvedFamilyName = familyName ?? family?.family_name

  try {
    await $fetch('/api/family', {
      method: 'PUT',
      body: {
        ...(resolvedFamilyName ? { family_name: resolvedFamilyName } : {}),
        familyCuid: familyId,
        advocateCuid: advocateId
      }
    })

    errorInPage.value = false
    errorToUser.value = ""

    await getUsers()
    if ((id.value as string) !== "0") {
      await getData();
    }
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.message || 'Failed to update family'
    console.error(error)
  }
}

const assignSelectedFamily = async () => {
  if (!selectedFamilyForAssignment.value || !data_user.value.id) {
    return
  }
  await updateFamilyAdvocate(selectedFamilyForAssignment.value, data_user.value.id)
  selectedFamilyForAssignment.value = null
}

const deactivateUser = async () => {
  if (!confirm('Deactivate this user? They will be unable to sign in.')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch('/api/user/deactivate', {
      method: 'PUT',
      body: { id: id.value },
    })
    getData()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message ?? 'Failed to deactivate user'
  }
}

const reactivateUser = async () => {
  if (!confirm('Reactivate this user? They will be able to sign in again.')) return
  errorInPage.value = false
  errorToUser.value = ''

  try {
    await $fetch('/api/user/reactivate', {
      method: 'PUT',
      body: { id: id.value },
    })
    getData()
  } catch (error: any) {
    errorInPage.value = true
    errorToUser.value = error?.data?.message || 'Failed to reactivate user'
  }
}

</script>

<template>
  <CVContainer>
    <div class="p-3 rounded bg-gray-50">
      <TitleComp>
        User Account Entry
      </TitleComp>
      <br>
      <div class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999">
        <CVLegend>Family Information</CVLegend>
      </div>
      <div class="py-4 grid sm:grid-cols-3">
        <CVLabel for="user_role">
          User Role
        </CVLabel>
        <div class="mx-9 mt-6 sm:col-span-2 sm:mr-11">
          <select
            id="user_role"
            v-model="data_user.role"
            class="rounded-md outline-0 border-box w-full p-2 bg-white border border-[#c4c4c4]"
          >
            Select User Role
            <option>family</option>
            <option>advocate</option>
            <option v-if="isAdmin">
              admin
            </option>
          </select>
        </div>
      </div>
      <div
        v-if="addingFamily"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel for="Family">
          Family
        </CVLabel>
        <div class="mx-9 mt-6 sm:col-span-2 sm:mr-11">
          <Listbox
            id="Family"
            v-model="data_user.familyId"
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
                  v-for="family in data_all_families"
                  :key="family.id"
                  :value="family.id"
                  as="div"
                  class="px-2 border border-grey-500 py-1 my-1"
                >
                  {{ family.family_name }}
                </ListboxOption>
              </ListboxOptions>
              <ListboxButton class="text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96">
                {{ data_user.familyId ? currentFamily.family_name : 'Select family to add the user to' }}
              </ListboxButton>
            </div>
          </Listbox>
        </div>
      </div>

      <!-- User Info -->
      <div class="information rounded-md mx-9 mb-2 mt-6 text-center sm:text-start text-white bg-blue-999">
        <CVLegend>User Information</CVLegend>
      </div>
      <CVForm
        ref="formRef"
        @submit="save"
      >
        <div class="py-4 grid sm:grid-cols-3">
          <CVLabel for="email">
            Email
          </CVLabel>
          <div
            id="email"
            class="mx-9 sm:col-span-2 sm:mr-11"
          >
            <CVEmailInput
              id="email"
              v-model="data_user.email"
              placeholder="(user defined)"
              required
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
              type="text"
              placeholder="(user-defined"
              required="required"
            />
          </div>
        </div>
        <div class="py-4 grid sm:grid-cols-3">
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
      </CVForm>
      <div
        v-if="isAdmin && id !== '0'"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel>Account Status</CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11 flex items-center gap-4">
          <span
            class="font-poppins mt-6 font-bold"
            :class="data_user.isActive ? 'text-green-700' : 'text-red-600'"
          >{{ data_user.isActive ? 'Active' : 'Deactivated' }}</span>
        </div>
      </div>

      <!-- Error display -->
      <div
        v-if="errorInPage"
        class="text-red-500 my-2"
      >
        <CVLabel for="dynamic_error">
          {{ errorToUser }}
        </CVLabel>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between mx-10 py-2">
        <ActionButton
          text="Save"
          :disabled="disableCriteria"
          class="transition duration-300 bg-orange-999 hover:bg-green-600 disabled:bg-orange-800 disabled:cursor-not-allowed"
          @click="submitForm"
        />
        <ActionButton
          v-if="data_user.isActive"
          text="Deactivate User"
          type="button"
          class="transition duration-300 bg-red-600 hover:bg-red-700"
          @click="deactivateUser"
        />
        <ActionButton
          v-else
          text="Reactivate User"
          type="button"
          class="transition duration-300 bg-green-600 hover:bg-green-700"
          @click="reactivateUser"
        />
      </div>
      <div
        v-if="data_user.role === 'advocate' && isAdmin"
        class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999"
      >
        <CVLegend>Advocate Families</CVLegend>
      </div>
      <div
        v-if="data_user.role === 'advocate' && isAdmin"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel>Current Families</CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <div
            v-if="advocateFamilies.length === 0"
            class="text-sm text-gray-700"
          >
            This advocate currently has no families assigned.
          </div>
          <ul
            v-else
            class="space-y-2"
          >
            <li
              v-for="family in advocateFamilies"
              :key="getFamilyId(family)"
              class="flex items-center justify-between"
            >
              <span>{{ family.family_name }}</span>
              <ActionButton
                text="Remove"
                class="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                @click="updateFamilyAdvocate(getFamilyId(family), null, family.family_name)"
              />
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="data_user.role === 'advocate' && isAdmin"
        class="py-4 grid sm:grid-cols-3"
      >
        <CVLabel>Assign Family</CVLabel>
        <div class="mx-9 sm:col-span-2 sm:mr-11">
          <Listbox
            id="assign_family"
            v-model="selectedFamilyForAssignment"
            as="div"
            class="shadow-sm border border-1 rounded-lg mb-2"
          >
            <div class="relative">
              <Transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              />
              <ListboxOptions as="div" class="w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption
                  v-for="family in unassignedFamilies"
                  :key="getFamilyId(family)"
                  :value="getFamilyId(family)"
                  class="px-2 border border-grey-500 py-1 my-1"
                >
                  {{ family.family_name }}
                </ListboxOption>
              </ListboxOptions>
              <ListboxButton class="text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96">
                {{ selectedFamilyForAssignment ? (unassignedFamilies.find(f => getFamilyId(f) === selectedFamilyForAssignment)?.family_name || 'Select family') : 'Select family to assign' }}
              </ListboxButton>
            </div>
          </Listbox>
        </div>
        <ActionButton
          text="Assign Family"
          class="mt-2 ml-10 transition duration-300 bg-orange-999 hover:bg-green-600 disabled:bg-orange-800 disabled:cursor-not-allowed"
          :disabled="!selectedFamilyForAssignment"
          @click="assignSelectedFamily"
        />
      </div>
    </div>
  </CVContainer>
</template>

<style scoped></style>
