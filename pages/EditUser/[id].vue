<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditUser.vue 
*	Denotes functions specific to user insertion  
*	Located under "/EditUser/"
*/

import type { User } from '@/types.d.ts'
import { Family } from '@prisma/client';

const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "{}",
    phone: "",
    Pages: [],
    //PageDonations: [],
    //DonationPayouts: []
})
const data_all_users = ref<Family[]>([])

const cvuser = useCookie('cvuser');
const cvuser2 = useCookie<User>('cvuser')
const router = useRoute()
const isAuthorized = computed(() => { cvuser2.value?.user_role as string == "advocate" || cvuser2.value?.user_role == "admin"})
const cuid = computed(() => router.params.id as string);
const errorInPage = ref(false); 
// Method that creates a new user on the database on the backend
const save = async () => {
    if(isAuthorized){
        const { data: result } = await useFetch('/api/user', {
        method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
        body: ({ ...data_user.value, cuid: cuid.value as string })
    })
    if(result.value == true){
        errorInPage.value = false;
        await navigateTo('/Users')
    } else {
        errorInPage.value = true;
    }
}

}

// Method to populate the form when editing a pre-existing user
const getData = async (cuid: string) => {
    const { data: userData } = await useFetch('/api/user', {
        method: 'GET',
        query: { cuid: cuid }
    })
    data_user.value = userData.value as unknown as User;
}


const getUsers = async () => {
    const { data: userData } = await useFetch('/api/families', {
        method: 'GET',
    })
    data_all_users.value = userData.value as unknown as Family[];
    console.log(data_all_users.value);
}
if ((cuid.value as string) !== "0") {
    await getData(cuid.value as string);
}
    await getUsers()
//add to template when family Backend done
/*.flex.gap-5
p.self-center Family
Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="familyMemberCuid")
.relative
Transition(
leave-active-class='transition ease-in duration-100'
leave-from-class='opacity-100'
leave-to-class='opacity-0'
)
ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
ListboxOption(as='div' v-for="family in familyData" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.users[0]?.last_name }}
    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyMember ? familyMember.user.first_name + familyMember.user.last_name : 'Select family to add the user to' }} */
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

        //add list box here
        
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
