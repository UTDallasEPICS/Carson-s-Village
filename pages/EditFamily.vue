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
import type { Family } from '@prisma/client';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

const cvuser = useCookie<User>('cvuser')

const data_family = ref<Family>({
    cuid: "",
    stripe_account_id: "",
    created_at: new Date(),
    updated_at: null,
    family_name: "",
    advocateCuid: cvuser.value.cuid 
})

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
const data_all_users = ref<Family[]>([])

const router = useRoute()
const isAuthorized = computed(() => { cvuser.value?.user_role as string == "advocate" || cvuser.value?.user_role == "admin"})
const errorInPage = ref(false);
// Method that creates a new family on the backend and adds the first user
const createFamily = async () => {
  if(isAuthorized){
    const result = await $fetch('/api/family', {
      method: 'POST',
      body: ({family_name: data_family.value.family_name, ...data_user.value})
    })

    if(result){
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
    form.well.well-sm
        TitleComp Family Creation
        br
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            CVLegend Family Information
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="family_name") Family Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="family_name" v-model='data_family.family_name' placeholder="(user defined)" required="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="email") Email
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="email" v-model='data_user.email' type="email" placeholder="(user defined)" required="required")
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
             CVLegend First User Information
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="first_name") First Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" v-model='data_user.first_name' placeholder="(user-defined)" required="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="middle_name") Middle Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="middle_name" v-model='data_user.middle_name' placeholder="(user defined, optional)")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="last_name") Last Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="last_name" v-model='data_user.last_name' placeholder="(user-defined)" required="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel(for="phone") Phone
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(id="phone" v-model='data_user.phone' placeholder="(user defined, optional)")
            .col-md-10.py-2
                ActionButton(@click="createFamily()" class="transition duration-300 bg-orange-999 hover:bg-green-600") Save    
        .py-4.grid(class="sm:grid-cols-3" Style="color:red" v-if="errorInPage")
            CVLabel(for="error_label") Error Creating Family and First Family Member in the System.
</template>

<style scoped></style>
