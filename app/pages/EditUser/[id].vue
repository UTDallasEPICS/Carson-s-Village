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
const isAuthorized = computed(() => { user.value?.role === "advocate" || user.value?.role === "admin"})
const isAdmin = computed(() => user.value?.role === "admin")
const id = computed(() => router.params.id as string);
const errorInPage = ref(false);
const errorToUser = ref("")

const data_user = ref<User>({
    id: id.value,
    name: "",
    email: "",
    role: "family",
    phone: "",
    address: "",
    familyId: "",
    Pages: [],
    AdvocateFamily: []
})

const disableCriteria = computed(() => !data_user.value?.email || !data_user.value?.name || (addingFamily.value && !data_user.value?.familyId))

// Method that creates a new user on the database on the backend
const save = async () => {
  if(isAuthorized){
    const data = await $fetch('/api/user', {
      method: (id.value as string) !== "0" ? 'PUT' : 'POST',
      body: ({ ...data_user.value })
    }).catch((error) => {
        errorInPage.value = true 
        console.error(error.data.message);
        errorToUser.value = error.data.message
    });

    if(data?.success){
        errorInPage.value = false;
        errorToUser.value = ""
        await navigateTo('/Users')
    }
  }

}

const currentFamily = computed(() => data_all_families.value?.find(({ id }: Family) => id == data_user.value?.familyId) || {});

// Method to populate the form when editing a pre-existing user
const getData = async (cuid: string) => {
  const { data: userData } = await useFetch('/api/user', {
      method: 'GET',
      query: { cuid: cuid }
  })
  data_user.value = userData.value as unknown as User;
}

// boolean indicating that we need the family selection listbox 
const addingFamily = computed(() => data_user.value.role == "family")

const getUsers = async () => {
  const { data: FamilyData } = await useFetch('/api/family', {
      method: 'GET',
  })
  data_all_families.value = FamilyData.value as unknown as Family[];
}
if ((id.value as string) !== "0") {
  await getData(id.value as string);
}

await getUsers()

</script>

<template lang="pug">
CVContainer
    form(class="p-3 rounded bg-gray-50")
        TitleComp User Account Entry 
        br
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Family Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="user_role") User Role
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                select(id="user_role" v-model='data_user.role' class="rounded-md outline-0 border-box w-full p-2 bg-white border border-[#c4c4c4]") Select User Role
                    option family
                    option advocate
                    option(v-if="isAdmin") admin
        div(v-if="addingFamily" class="py-4 grid sm:grid-cols-3")
            CVLabel(for="Family") Family
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                Listbox(id="Family" as='div' v-model="data_user.familyId" class="shadow-sm border border-1 rounded-lg")
                    div(class="relative")
                        Transition(
                    leave-active-class='transition ease-in duration-100'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                )
                            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                                ListboxOption(as='div' v-for="family in data_all_families" :key="family.id" :value="family.id" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ data_user.familyId ? currentFamily.family_name : 'Select family to add the user to' }}
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend User Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="email") Email
            div(id="email" class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="email" v-model='data_user.email' placeholder="(user defined)" required)
        
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="first_name") Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" type="text" v-model='data_user.name' placeholder="(user-defined" required="required")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="phone") Phone
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="phone" type="tel" v-model='data_user.phone' placeholder="(user defined, optional)")
            div(class="py-2")
                ActionButton(@click="save" :disabled="disableCriteria" class="transition duration-300 bg-orange-999 hover:bg-green-600 disabled:bg-orange-800 disabled:cursor-not-allowed") Save    
        div(v-if="errorInPage" class="text-red-500")    
            CVLabel(for="error_label") Error in Creating User in the system. 
            br
            CVLabel(for="dynamic_error") {{ errorToUser }}
</template>

<style scoped></style>
