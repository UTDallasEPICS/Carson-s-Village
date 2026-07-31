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
const errorInPage = ref(false);

const advocates = ref<User[]>([])
const selectedAdvocateId = ref<string | null>(null)

const { data: data_family } = await useFetch(
  `/api/family/${id.value}`,
  {
    default: () => ({} as any)
  }
)

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
      const result = await $fetch('/api/family', {
        method: 'PUT',
        body: {
          family_name: data_family.value.family_name,
          familyCuid: id.value,
          advocateCuid: selectedAdvocateId.value
        }
      })

      if (result) {
        errorInPage.value = false;
        await navigateTo('/Families')
      } else {
        errorInPage.value = true;
      }
    } else {
      const result = await $fetch('/api/family', {
        method: 'POST',
        body: ({
          family_name: data_family.value.family_name,
          name: data_user.value.name,
          email: data_user.value.email,
          phone: data_user.value.phone,
          address: data_user.value.address
        })
      })

      if (result) {
          errorInPage.value = false;
          await navigateTo('/Users')
      } else {
          errorInPage.value = true;
      }
    }
  } 
}

</script>

<template lang="pug">
CVContainer
    form(class="p-3 rounded bg-gray-50")
        TitleComp Family Creation
        br
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Family Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="family_name") Family Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="family_name" v-model='data_family.family_name' placeholder="(user defined)" required="required")
        div(v-if="id !== '0'" class="py-4 grid sm:grid-cols-3")
            CVLabel(for="advocate") Advocate Responsible
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                p(class="mb-2 text-sm text-gray-700") Current advocate: {{ currentAdvocateName }}
                Listbox(id="advocate" as='div' v-model="selectedAdvocateId" class="shadow-sm border border-1 rounded-lg")
                    div(class="relative")
                        Transition(
                          leave-active-class='transition ease-in duration-100'
                          leave-from-class='opacity-100'
                          leave-to-class='opacity-0'
                        )
                            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm')
                                ListboxOption(
                                  key="no-advocate"
                                  :value="null"
                                  class="px-2 border border-grey-500 py-1 my-1"
                                ) {{ !selectedAdvocateId ? "None" : "Remove Advocate" }}
                                ListboxOption(
                                  v-for="advocate in advocates"
                                  :key="advocate.id"
                                  :value="advocate.id"
                                  class="px-2 border border-grey-500 py-1 my-1"
                                ) {{ advocate.name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ selectedAdvocateLabel }}
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
             CVLegend New User Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="email") Email
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="email" v-model='data_user.email' type="email" placeholder="(user defined)" required="required")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="first_name") Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" v-model='data_user.name' placeholder="(user-defined)" required="required")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="phone") Phone
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVPhoneInput(id="phone" v-model='data_user.phone' placeholder="(user defined, optional)")
            div(class="py-2")
                ActionButton(@click="createFamily()" class="transition duration-300 bg-orange-999 hover:bg-green-600") Save    
        div(v-if="errorInPage" class="py-4 grid sm:grid-cols-3 text-red-500")
            CVLabel(for="error_label") Error Creating Family and First Family Member in the System.
</template>

<style scoped></style>
