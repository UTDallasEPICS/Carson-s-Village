<script lang="ts" setup>

/*
*   Ethan Emmanuel, Rishab Medhi and Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditUser.vue 
*	Denotes functions specific to user insertion  
*	Located under "/EditUser/"
*/

import type { User, Family } from '@/types.d.ts'
//import { Family } from '@prisma/client';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

const cvuser = useCookie<User>('cvuser')
const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "family",
    phone: "",
    address: "",
    Pages: [],
    familyCuid: "",
    AdvocateFamily: []
    //PageDonations: [],
    //DonationPayouts: []
})

const familyCuid = ref("") 
const data_family = ref<Family>({
cuid: "",
stripe_account_id: "",
created_at: "null",
updated_at: new Date(),
family_name: "",
advocateCuid: cvuser.value.cuid,
Pages: [],
FamilyMembers: [],
AdvocateResponsible: {
cuid: '',
first_name: '',
last_name: '',
user_role: '',
email: '',
middle_name: '',
phone: '',
Pages: [],
familyCuid: '',
address: '',
AdvocateFamily: []
},
FamilyDonations: [],
FamilyDonationPayouts: []
})

const data_all_families = ref<Family[]>([])
const router = useRoute()
const isAuthorized = computed(() => { cvuser.value?.user_role as string == "advocate" || cvuser.value?.user_role == "admin"})
const isAdmin = computed(() => cvuser.value?.user_role as string == "admin")
const cuid = computed(() => router.params.id as string);
const disableCriteria = computed(() => !data_user.value?.email || !data_user.value?.first_name ||!data_user.value?.last_name)
const errorInPage = ref(false);
const errorToUser = ref("")

// Method that creates a new user on the database on the backend
const save = async () => {
  if(isAuthorized){
    const data = await $fetch('/api/user', {
      method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
      body: ({ ...data_user.value, familyCuid: familyCuid.value, cuid: cuid.value as string })

    }).catch((error) => {
        errorInPage.value = true 
        console.log(error.data.message);
        errorToUser.value = error.data.message
    });
    console.log(data)
    if(data?.success){
        errorInPage.value = false;
        errorToUser.value = ""
        await navigateTo('/Users')
    }
  }

}

const currentFamily = computed(() => data_all_families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});

// Method to populate the form when editing a pre-existing user
const getData = async (cuid: string) => {
  const { data: userData } = await useFetch('/api/user', {
      method: 'GET',
      query: { cuid: cuid }
  })
  data_user.value = userData.value as unknown as User;
  familyCuid.value = data_user.value.familyCuid as unknown as string
}

// boolean indicating that we need the family selection listbox 
const addingFamily = computed(() => data_user.value.user_role == "family")
const getUsers = async () => {
  const { data: FamilyData } = await useFetch('/api/family', {
      method: 'GET',
  })
  data_all_families.value = FamilyData.value as unknown as Family[];
  console.log(data_all_families.value);
}
if ((cuid.value as string) !== "0") {
  await getData(cuid.value as string);
}

await getUsers()

</script>

<template lang="pug">
CVContainer
    form.well.well-sm
        TitleComp User Account Entry 
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="email") Email
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="email" type="email" v-model='data_user.email' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="user_role") User Role
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(id="user_role" style="border: 1px solid #c4c4c4;" v-model='data_user.user_role') Select User Role
                    option family
                    option advocate
                    option(v-if="isAdmin") admin
        .py-4.grid(class="sm:grid-cols-3" v-if="addingFamily")
            CVLabel(for="Family") Family
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.shadow-sm.border.border-1.rounded-lg(id="Family" as='div' v-model="familyCuid")
                    .relative
                        Transition(
                    leave-active-class='transition ease-in duration-100'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                )
                            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                                ListboxOption(as='div' v-for="family in data_all_families" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to add the user to' }}
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="first_name") First Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" type="text" v-model='data_user.first_name' placeholder="(user-defined" required="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="middle_name") Middle Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="middle_name" type="text" v-model='data_user.middle_name' placeholder="(user defined, optional)")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="last_name") Last Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="last_name" type="text" v-model='data_user.last_name' placeholder="(user-defined)" required="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="phone") Phone
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="phone" type="tel" v-model='data_user.phone' placeholder="(user defined, optional)")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="address") Address
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="address" type="text" v-model='data_user.address' placeholder="(user defined, optional)")
            .col-md-10.py-2
                ActionButton(@click="save" :disabled="disableCriteria" class="transition duration-300 bg-orange-999 hover:bg-green-600 disabled:bg-orange-800 disabled:cursor-not-allowed") Save    
        .text-red-500(v-if="errorInPage")    
            CVLabel(for="error_label") Error in Creating User in the system. 
            br
            CVLabel(for="dynamic_error") {{ errorToUser }}
</template>

<style scoped></style>
