<script lang="ts" setup>

/*
*   Ethan Emmanuel, Rishab Medhi and Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditUser.vue 
*	Denotes functions specific to user insertion  
*	Located under "/EditUser/"
*/

import type { User } from '@/types.d.ts'
import { Family } from '@prisma/client';
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
    user_role: "",
    phone: "",
    Pages: [],
    familyCuid: ""
    //PageDonations: [],
    //DonationPayouts: []
})

const familyCuid = ref("") 
const data_family = ref<Family>({
    cuid: "",
    stripe_account_id: "",
    created_at: "",
    updated_at: Date.toString(),
    family_name: "",
    advocateCuid: cvuser.value.cuid 

})

const data_all_families = ref<Family[]>([])
const router = useRoute()
const isAuthorized = computed(() => { cvuser.value?.user_role as string == "advocate" || cvuser.value?.user_role == "admin"})
const cuid = computed(() => router.params.id as string);
const errorInPage = ref(false);

// Method that creates a new user on the database on the backend
const save = async () => {
    if(isAuthorized){
        // todo: change to $fetch
        const { data: result } = await useFetch('/api/user', {
        method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
        body: ({ ...data_user.value, familyCuid: familyCuid.value, cuid: cuid.value as string })
    })
    if(result.value == true){
        errorInPage.value = false;
        await navigateTo('/Users')
    } else {
        errorInPage.value = true;
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
}

// boolean indicating that we need the family selection listbox 
const addingFamily = computed(() => data_user.value.user_role == "family")
const getUsers = async () => {
    const { data: FamilyData } = await useFetch('/api/families', {
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
    .well.well-sm
        TitleComp User Account Entry 
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Email
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.email' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel User Role
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='data_user.user_role') Select User Role
                    option family
                    option advocate
        .py-4.grid(class="sm:grid-cols-3" v-if="addingFamily")
            CVLabel Family
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="familyCuid")
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
            CVLabel First Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.first_name' placeholder="(user-defined" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Middle Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.middle_name' placeholder="(user defined, optional)")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Last Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.last_name' placeholder="(user-defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Phone
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.phone' placeholder="(user defined, optional)")
            .col-md-10.py-2
                ActionButton(@click="save") Save    
        .py-4.grid(class="sm:grid-cols-3" Style="color:red" v-if="errorInPage")
            CVLabel Error in Creating User in the system.
</template>

<style scoped></style>
