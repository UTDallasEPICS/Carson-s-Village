<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditFamily.vue 
*	Denotes functions specific to family creation  
*	Located under "/EditFamily/"
*/

import type { User } from '@/types.d.ts'
import { Family } from '@prisma/client';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

const cvuser = useCookie('cvuser');
const cvuser2 = useCookie<User>('cvuser')

const data_family = ref<Family>({
    cuid: "",
    stripe_account_id: "",
    created_at: Date.toString(),
    updated_at: "",
    family_name: "",
    advocateCuid: cvuser2.value.cuid 
})

const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "family",
    phone: "",
    Pages: [],
    familyCuid: ""
    //PageDonations: [],
    //DonationPayouts: []
})
const data_all_users = ref<Family[]>([])

const router = useRoute()
const isAuthorized = computed(() => { cvuser2.value?.user_role as string == "advocate" || cvuser2.value?.user_role == "admin"})
const errorInPage = ref(false);

// Method that creates a new family on the backend and adds the first user
const createFamily = async () => {
    if(isAuthorized){
        const { data: result } = await useFetch('/api/family', {
        method: 'POST',
        body: ({family_name: data_family.value.family_name, ...data_user.value})
    })
    data_family.value = result.value as unknown as Family
    console.log(result.value)
    if( result.value ){
        errorInPage.value = false;
        await navigateTo('/Users')
    } else {
        errorInPage.value = true;
    }
} 
}
</script>

<template lang="pug">
CVContainer
    .well.well-sm
        TitleComp Family Creation
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Family Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_family.family_name' placeholder="(user defined)" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Email
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_user.email' type="email" placeholder="(user defined)" required)
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
                ActionButton(@click="createFamily()") Save    
        .py-4.grid(class="sm:grid-cols-3" Style="color:red" v-if="errorInPage")
            CVLabel Error Creating Family and First Family Member in the System.
</template>

<style scoped></style>
