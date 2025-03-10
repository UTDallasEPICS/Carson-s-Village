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
import { vElementSize } from '@vueuse/components'

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
    isActive: true,
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "family",
    phone: "",
    Pages: [],
    familyCuid: "",
    AdvocateFamily: [],
    Family: {},
    //PageDonations: [],
    //DonationPayouts: []
})
//const data_all_users = ref<Family[]>([])
const errorInPage = ref(false)
const errorToUser = ref("")
const useExistingUser = ref(false)
const userCuid = ref("")
const bottomHeight = ref(0)

const router = useRoute()
const cuid = computed(() => router.params.id as string);
const isAuthorized = computed(() => { cvuser.value?.user_role as string == "advocate" || cvuser.value?.user_role == "admin"})
const currentUser = computed(() => data_all_users.value.all_family_users.find((({ cuid }: User) => cuid === userCuid.value )) || {})

const { data: data_all_users } = await useFetch('/api/users', {
      method: 'GET',
      query: { page_number: 0, sortedColumn: "first_name", order: "asc", familyCuid: "0" }, 
      default() {
        return [] as any
      }
    })

const getFamily = async () => {
    const { data: data_family_db } = await useFetch(`/api/family/${cuid.value}`, {
        method: 'GET',
    })
    data_family.value = data_family_db.value as unknown as Family
}

if(cuid.value !== '0'){
    await getFamily()
}
// Method that creates a new family on the backend and adds the first user
const saveFamily = async () => {
    const firstUser = useExistingUser.value ? currentUser.value : data_user.value
  if(isAuthorized){
    const result = await $fetch('/api/family', {
      method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
      body: ({family_name: data_family.value.family_name, ...firstUser, existingUser: useExistingUser.value, familyCuid: cuid.value})
    })

    if(result){
        errorInPage.value = false;
        await navigateTo('/Users')
    } else {
        errorInPage.value = true;
    }
  } 
}

const onResize = ({ height }: { height: number }) => {
    console.log(height)
    if(height != 0) {
        bottomHeight.value = height + 150
    } else {
        bottomHeight.value = 20
    }
}
</script>

<template lang="pug">
CVContainer
    .well.well-sm
        TitleComp {{ cuid == '0' ? 'Create' : 'Edit' }} Family
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-3" v-if="cuid == '0'")
            CVLabel Use Existing User
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input(style="line-height: 0px" type="checkbox" v-model="useExistingUser")
        .py-4.grid(class="sm:grid-cols-3" v-if="useExistingUser || cuid != '0'")
            CVLabel Family Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_family.family_name' placeholder="(user defined)" required) 
        .py-4.grid(class="sm:grid-cols-3" v-if="useExistingUser" v-element-size="onResize")
            CVLabel Current User
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="userCuid")
                    .relative
                        Transition(
                                leave-active-class='transition ease-in duration-100'
                                leave-from-class='opacity-100'
                                leave-to-class='opacity-0'
                                )
                        ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm')
                            ListboxOption(as='div' v-for="user in data_all_users.all_family_users" :key="user.cuid" :value="user.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ user.first_name + " " +  user.last_name  }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ userCuid ? currentUser.first_name + " " +  currentUser.last_name  : 'Select user to add to family' }}
        .div(v-if="!useExistingUser && cuid === '0'")
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
                    CVInput(v-model='data_user.first_name' placeholder="(user-defined)" required)
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
            ActionButton(@click="saveFamily()" class="transition duration-300 bg-orange-999 hover:bg-green-600") Save    
    .py-4.grid(class="sm:grid-cols-3" Style="color:red" v-if="errorInPage")
        CVLabel Error Creating Family and First Family Member in the System.
    .div(:style="{ 'margin-bottom': bottomHeight + 'px'}")
</template>

<style scoped></style>