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
import { useField } from 'vee-validate';
import { PhoneInput, type PhoneDATA } from '@lbgm/phone-number-input';
import '@lbgm/phone-number-input/style';
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
    isActive: true,
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "family",
    phone: "",
    Family: {},
    Pages: [],
    familyCuid: "",
    AdvocateFamily: []
})

const data_family = ref<Family>({
    cuid: '',
    family_name: '',
    stripe_account_id: null,
    created_at: null,
    updated_at: null,
    advocateCuid: '',
    Pages: [],
    FamilyMembers: [],
    AdvocateResponsible: {
        cuid: '',
        first_name: '',
        last_name: '',
        user_role: '',
        email: '',
        Family: {},
        middle_name: '',
        phone: '',
        Pages: [],
        familyCuid: '',
        AdvocateFamily: []
    },
    FamilyDonations: [],
    FamilyDonationPayouts: []
})


type T_PhoneInput = typeof PhoneInput;
const attrs = useAttrs();
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(attrs.name, undefined, {
  initialValue: attrs.value ? attrs.value : '',
  validateOnValueUpdate: true,
});

// compute error from vee-validate
const hasError = computed((): boolean => {
  return errorMessage.value !== undefined;
});

const validatePhone = (data: PhoneDATA) => {
  handleChange(data.nationalNumber, true);
  phone.value = data
};

const errorInPage = ref(false);
const errorToUser = ref("")
const router = useRoute()
const phone = ref<PhoneDATA>({
    dialCode: "",
    country: "",
    nationalNumber: "",
    number: ""
})

const isAuthorized = computed(() => { cvuser.value?.user_role as string == "advocate" || cvuser.value?.user_role == "admin"})
const isAdmin = computed(() => cvuser.value?.user_role as string == "admin")
const cuid = computed(() => router.params.id as string);
const options = computed(() => FamilyData.value)


const { data: FamilyData } = await useFetch<Family[]>('/api/family', {
    method: 'GET',
})

// Method that creates a new user on the database on the backend
const save = async () => {
    console.log(data_user.value?.AdvocateFamily)
    const family = createNewFamily.value ? data_family.value : {}
    const familyCuidBackend = !createNewFamily.value ? familyCuid.value : undefined
    if(isAuthorized) {
        const data = await $fetch('/api/user', {
        method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
        body: ({ ...data_user.value, allFamilies: FamilyData.value , family_name: data_family.value.family_name, familyCuid: familyCuidBackend, cuid: cuid.value as string })

        }).catch((error) => {
            errorInPage.value = true 
            console.log(error.data.message);
            errorToUser.value = error.data.message
        });
        //console.log(data)
        if(data?.success){
            errorInPage.value = false;
            errorToUser.value = ""
            await navigateTo('/Users')
        }
    }

}


const currentFamily = computed(() => FamilyData.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});


const { data: userData } = await useFetch<User>(`/api/user/${cuid.value as string}`, {
    method: 'GET',
})

if(cuid.value !== "0") {
    data_user.value = userData.value as unknown as User
    phone.value.number = userData.value?.phone as unknown as string
}

watch(phone, () => {
    data_user.value.phone = phone.value.number 
}, {deep: true})

// boolean indicating that we need the family selection listbox 
const addingFamily = computed(() => data_user.value?.user_role == "family")
const createNewFamily = ref(false)
const assigningAdvocatesToFamilies = computed(() => data_user.value?.user_role == "admin" || data_user.value?.user_role == "advocate")
const family_cuid = computed(() => data_user.value?.familyCuid as unknown as string)
const familyCuid = ref<string>('')

var after3 = false
var after8 = false
var removeRLC = false
const disableSubmit = ref(false)
watch(data_user, () => {
    if((data_user.value?.first_name || data_user.value?.last_name) && !data_user.value?.email) {
        errorInPage.value = true
        errorToUser.value = "Email required"
        disableSubmit.value = true
    } else if(data_user.value?.first_name && data_user.value?.email) {
        errorInPage.value = false
        errorToUser.value = ""
        disableSubmit.value = false
    }

    if(data_user.value?.last_name && !data_user.value?.first_name) {
        errorInPage.value = true
        errorToUser.value = "first name required"
        disableSubmit.value = true
    } else if(data_user.value?.last_name && data_user.value?.first_name) {
        errorInPage.value = false
        errorToUser.value = ""
        disableSubmit.value = false
    }

    if(data_user.value?.phone && !data_user.value?.last_name) {
        errorInPage.value = true
        errorToUser.value = "last name required"
        disableSubmit.value = true
    } else if(data_user.value?.last_name && data_user.value?.phone) {
        errorInPage.value = false
        errorToUser.value = ""
        disableSubmit.value = false
    }

    
}, {deep: true})

watch(data_user, () => {
    const not_phone_number_regex = /([*^.!@$%&*=_/<>;:'{},\]\[~`])/
    if(data_user.value?.phone?.match(not_phone_number_regex)) {
        errorInPage.value = true
        errorToUser.value = "No special characters allowed in phone number "
        disableSubmit.value = true
    } else {
        errorToUser.value = ""
        errorInPage.value = false
        disableSubmit.value = false
    }
}, {deep:true})


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
                    option(v-if="isAdmin") admin
        .py-4.grid(class="sm:grid-cols-3" v-if="addingFamily && !createNewFamily")
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
                                ListboxOption(as='div' v-for="family in FamilyData" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to add the user to' }}
        .py-4.grid(class="sm:grid-cols-3" v-if="addingFamily")
            CVLabel Create New Family
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input(style="line-height: 0px" type="checkbox" v-model="createNewFamily")
        .py-4.grid(class="sm:grid-cols-3" v-if="createNewFamily && addingFamily")
            CVLabel Family Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data_family.family_name' placeholder="(user defined)" required) 
        .py-4.grid(class="sm:grid-cols-3" v-if="assigningAdvocatesToFamilies")
            CVLabel Families Assigned
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVMultiSelect.border-box(:options="options" v-model='data_user.AdvocateFamily') Select User Role
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
                phone-input(v-model='phone' placeholder="(user defined, optional)" 
                    v-element-size="onResize"
                    :allowed="[]"
                    :has-error="hasError"
                    :errorMessage="errorMessage"
                    @phoneData="validatePhone"
                    arrow=true
                    default-country="US"
                    listHeight="400px"
                )
            .col-md-10.py-2
                ActionButton(@click="save" :disabled="disableSubmit" :class="{'transition duration-300 bg-orange-999 hover:bg-green-600': true, 'cursor-not-allowed': disableSubmit }") Save    
        .div(v-if="errorInPage")    
            label.text-red-500 Error in Creating or Editing User in the system. 
            br
            label.text-red-500 {{ errorToUser }}
        mb-72
        mb-72
</template>

<style scoped></style>
