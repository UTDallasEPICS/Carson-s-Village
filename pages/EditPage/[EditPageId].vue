<script lang="ts" setup>

/*
*   David Haung and Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Denotes functions specific to page insertion and page editing  
*	Located under "/EditPage/"
*/


import '@vuepic/vue-datepicker/dist/main.css';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { vElementSize } from '@vueuse/components'


import type { Image, Page, User, PageDonation, Reply } from '@/types.d.ts'
import type { Family } from "@prisma/client"

const router = useRoute()
const cvuser = useCookie<User>('cvuser');

const data = ref<Page>({
    cuid: "",
    userCuid: "",
    page_first_name: "",
    page_last_name: "",
    day_of_birth: null,
    day_of_passing: null,
    age: 0,
    visitation_date: null,
    visitation_location: "",
    visitation_address: "",
    visitation_description: "",
    visitation_end_time: null,
    funeral_date: null,
    funeral_end_time: null,
    funeral_description: "",
    funeral_location: "",
    funeral_address: "",
    obituary: "",
    deadline: null,
    donation_goal: 0,
    donation_description: "",
    amount_raised: 0,
    amount_distributed: 0,
    profileImageCuid: "",
    Images: [], 
    familyCuid: "",
    status: "active",
    donation_status: "in progress",
    duration: "0 days",
    start_date: null,
    goal_met_date: null ,
    last_donation_date: null,
    PageDonations: [], 
    Reply: [],
    Family: {
        cuid: "",
        family_name: "",
        stripe_account_id: "",
        created_at: null,
        updated_at: null,
        FamilyMembers: [],
        FamilyDonationPayouts: [],
        Pages: [],
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
            Family: {},
            AdvocateFamily: [],
        },
        FamilyDonations: [],
        advocateCuid: ""
    } 
})


const isAdvocate = computed(() => cvuser.value?.user_role == "advocate" ||  cvuser.value?.user_role == "admin")


const replies = ref<Reply[]>([])
const imageData = ref<Image[]>([])
const profile_image = ref("")
const toggleFiddlyBit = ref(true)
const familyCuid = ref("")
const disableSubmit = ref(false)
const errorToUser = ref("")
const cuid_data = computed(() => router.params.EditPageId);
const cuid = cuid_data.value as string
const user_cuid_data = computed(() => cvuser.value?.cuid)
const user_cuid = user_cuid_data.value as string

const pageCuid = computed(() => router.params.EditPageId)
data.value.cuid = cuid;
data.value.userCuid = user_cuid;
//console.log(data.value)
const errorInPage = ref(false)

const { data: Families } = await useFetch<Family[]>('/api/family', {
    method: 'GET'
})

// Method that saves form data to the database for a page that has cuid: router.params.EditPageId
const save = async () => {
    if(isAdvocate.value) {
        data.value.familyCuid = familyCuid.value
    } else {
        data.value.familyCuid = cvuser.value.familyCuid as string
    }

    if(router.params.EditPageId === "0") {
        data.value.start_date = new Date()
    }

    const saveSuccess  = await $fetch('/api/page', {
        // Checks if there is a pre-existing page to edit or if to create a new page    
        method: router.params.EditPageId !== "0" ? 'PUT' : 'POST',
        body: ({ ...data.value })
    }
    )
    try {
        if (saveSuccess && isAdvocate.value) {
            errorInPage.value = false;
            await navigateTo('/PageList/' + data.value.userCuid + '?fromUsers=1')
        } else if(saveSuccess && !isAdvocate.value){
            await navigateTo('/PageList/' + data.value.familyCuid + '?fromUsers=0')
        } else {
            errorInPage.value = true;
        }
    } catch(e){
        console.log(e)
    }
};
const currentFamily = computed(() => Families.value?.find(({ cuid }: Partial<Family>) => cuid == familyCuid.value) || {});

// Method to populate the form when editing a pre-existing page
const getData = async (cuid: string) => {
    const pageFoundFromUser = cvuser.value.Pages.find((i: Page) => i.cuid == router.params.EditPageId) != undefined
    const pageFoundFromFamily = cvuser.value.Family?.Pages?.find((i: Page) => i.cuid == router.params.EditPageId) != undefined
    //console.log(Families.value)
    // Allowing access to the user's EditPage only if user is an advocate or it is one of the family's family pages.
    if (pageFoundFromUser || pageFoundFromFamily || cvuser.value.user_role == "advocate" || cvuser.value.user_role == "admin") {
        const { data: pageData } = await useFetch(`/api/page/${cuid}`, {
            method: 'GET',
        })
        if (pageData.value) {
            data.value = pageData.value as unknown as Page;
            familyCuid.value = data.value.familyCuid
            imageData.value = data.value?.Images as unknown as Image[]
        // Not nessesary with proper logic in watchers?
        // 1st case is handling getting the profile image from the images in imageData
        // 2nd case is handling corrupt values of profile image of if the profileImageCuid exists 
        // but is not in imageData
        // const currentFamily = computed(() => Families.value?.find(({ cuid }: Family) => cuid == familyCuid.value) || {});
        if (imageData.value?.length != 0 && (data.value.profileImageCuid == "" || imageData.value?.find((i: Image) => i.cuid == data.value.profileImageCuid) == undefined))
            data.value.profileImageCuid = imageData.value[0].cuid;
        // handling the case where all the images where deleted but the profile image was not cleared out
        } else if (imageData.value?.length == 0 && data.value.profileImageCuid !== "") {
            data.value.profileImageCuid = ""
        }

        /* 
        * Checking if donation_goal and conversly amount raised is of type number in order to prevent
        * donation_goal and amount_raised from becoming NaN due to applying the donationFormat function to a string. 
        */
        if (typeof data.value.donation_goal === 'number') {
            data.value.amount_raised = donationFormat(data.value.amount_raised as unknown as number).replace("$", "");
            data.value.donation_goal = donationFormat(data.value.donation_goal as unknown as number).replace("$", "");
        }
        replies.value = data.value?.Reply
    }
}


watch([data], () => {
    if(data.value.day_of_birth && data.value.day_of_passing) {
        data.value.age = Math.max(Math.round(((new Date(data.value?.day_of_passing)).getTime() - (new Date(data.value?.day_of_birth)).getTime()) / (1000 * 3600 * 24 * 365.25)), 0)
    }
}, {deep: true})

// Method that saves images to the frontend on image upload.
const saveImage = async (theImage: Image) => {
    imageData.value.push(theImage)
    data.value.Images = imageData.value as unknown as Image[]
    // Creates a profile image for the first image uploaded
    if (data.value.profileImageCuid == "") {
        data.value.profileImageCuid = theImage.cuid;
    }
};


// Method to set an uploaded image as the profile image of a page
// There is no network request because the profiile image cuid is saved with the rest of the form
const setProfileImage = async (theImage: Image) => {
    data.value.profileImageCuid = theImage.cuid
}

const setImagesPreview = async (Images: Image[]) => {
    data.value.Images = Images
    imageData.value = Images
}

watch(imageData, async () => {
    if (imageData.value.length == 0) {
        data.value.profileImageCuid = "";
    }

}, { deep: true })

watch(data, async () => {
    const profileImageNotFound = data.value.Images.find((i: Image) => i.cuid == data.value.profileImageCuid) == undefined
    if (data.value.Images.length != 0 && (data.value.profileImageCuid == "" || profileImageNotFound)) {
        data.value.profileImageCuid = data.value.Images[0].cuid
    }
}, { deep: true })



const updateSuspendButton = (reply:Reply, suspend:boolean) => { // updates the front end of the suspend button
    replies.value.filter((rep:Reply)=> { // ignore filter error for now
        if (rep.cuid == reply.cuid) {
            rep.suspended = suspend;
        }
    })


    return;
}

await getData(useRoute().params.EditPageId as string)

const profileImage = computed(() => data.value?.Images.find((i: Image) => i.cuid == data.value?.profileImageCuid))
const profileImgHeight = ref(40)
// moves the listbox options (dropdown) down based on the current button image's rendered height
const onResize = ({ width, height }: { width: number, height: number }) => {
    if(height != 0) {
        profileImgHeight.value = height + 45
    } else {
        profileImgHeight.value = 40
    }
}
</script>

<template lang="pug">
CVContainer
    .well.well-sm
        //conditional rendering for page editing or page insert. This does not affect the function of Page editting.
        TitleComp(v-if="pageCuid!=0") Edit Family Page
        TitleComp(v-else) Insert New Family Page
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
    br
    div
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            CVLegend Personal Information
        .py-4.grid(class="sm:grid-cols-3") 
            .flex
                CVLabel First Name
                CVHelpButton(class="inline-block" 
    description="The first and last name of the recently deceased person this page should be dedicated to should be entered here")
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.page_first_name' placeholder="required" required)
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Last Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.page_last_name' placeholder="required" required)
        .py-4.grid(class="sm:grid-cols-3" v-if="isAdvocate")
            CVLabel Family
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.shadow-sm.border.border-1.rounded-lg(as='div' v-model="familyCuid")
                    .relative
                        Transition(
                    leave-active-class='transition ease-in duration-300'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                )
                            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                                ListboxOption(as='div' v-for="family in Families" :key="family.cuid" :value="family.cuid" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to add the page to' }}
        ImagePreview(v-model:images="imageData" :images="data.Images" :profileImage="profileImage" :pageCuid="cuid_data" @profileImage="setProfileImage" @images="setImagesPreview")
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            legend.ml-4(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Profile Image Selection        
        .py-4.grid(class="sm:grid-cols-3")
            .flex
                CVLabel Profile Image
                CVHelpButton(class="inline-block z-20" 
description="Here, you select from photos you uploaded to show up at the top of the family page") 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.rounded-lg.outline-0.w-full.bg-white.p-2(v-model="data.profileImageCuid" as="div") 
                    .relative
                        Transition(
                            leave-active-class='transition ease-in duration-300'
                            leave-from-class='opacity-100'
                            leave-to-class='opacity-0'
                            @leave="toggleFiddlyBit=!toggleFiddlyBit"
                            @enter="toggleFiddlyBit=!toggleFiddlyBit"
                            
                        )
                            ListboxOptions(as='div' class='w-full absolute z-10 bg-white shadow-lg shrink-0 max-h-60 max-w-96 mt-8 px-2 py-2 text-base ring-1 ring-black ring-opacity-5 rounded-md overflow-auto focus:outline-none sm:text-sm' :style="{ 'margin-top': profileImgHeight + 'px' }")
                                    ListboxOption(v-for="(image,k) in imageData" :key="image.cuid" :value="image.cuid")
                                        img.rounded-lg(class="py-4" :src="image.url" v-if="imageData.length") 
                    ListboxButton(class='relative rounded-md pl-2 py-4 pr-6 max-w-96 sm:text-sm' style="border: 1px solid #c4c4c4" v-element-size="onResize")
                        .flex
                            img.rounded-lg(:src="profileImage?.url" v-if="profileImage")
                            div.rounded-md.w-96(v-else)
                            CVChevronLeft.h-4.text-grey-500.z-3(class="inline-block size-4 h-2 max-w-8" v-if="toggleFiddlyBit")
                            CVChevronDown.h-4.text-gray-500.z-3(v-else class="inline-block size-4 h-2 max-w-8")
                            
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Day of Birth
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.day_of_birth')
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Day of Passing 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.day_of_passing')
        .py-4.grid(class="sm:grid-cols-3") 
            .flex
                CVLabel Age
                CVHelpButton(class="inline-block" 
    description="If the date of birth of the person is not known, add an approximate age the person lived to.")
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")       
                CVInputNumerical(type='number' v-model="data.age")           
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            CVLegend Visitation Information 
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Date
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.visitation_date')
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel End Time
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.visitation_end_time')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Location 

            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.visitation_location' placeholder="optional")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Address  
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.visitation_address' placeholder="optional")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.visitation_description' placeholder="optional")

        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            CVLegend Funeral Information       
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Date    
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.funeral_date')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel End Time    
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.funeral_end_time')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Location 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.funeral_location' placeholder="optional")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Address 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.funeral_address' placeholder="optional")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.funeral_description' placeholder="optional")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Obituary
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.obituary' placeholder="optional")
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
            CVLegend Fundraising Information
        .py-4.grid(class="sm:grid-cols-3")
            .flex
                CVLabel Goal
                CVHelpButton(class="inline-block" description="If the Donation Goal is 0, it will be assumed that you do not wish to display your donation progress bar and current amount raised.")  
            .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
                span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
                input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.donation_goal' placeholder="required" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Deadline Date
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.deadline')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.donation_description' placeholder="optional")
        .information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999" v-if="replies?.length")
            CVLegend Comment Moderation
        .py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="replies?.length" style="line-height: 0px;")
            div(class="flex")
            .div(v-for="(reply,i) in replies" :key="i" class="reply-box")
                CVReply(:r="reply")
                CVSuspendButton(:suspend="reply.suspended" :rep="reply" @update:suspend="updateSuspendButton")
            .div(v-for="(reply, i) in replies" :key="i")
        .ml-9.mb-9.py-7.flex.flex-wrap.gap-2
            .col-md-10.px-2.mt-2
                ActionButton(:class="{'transition duration-300 bg-orange-999 hover:bg-green-600': true, 'cursor-not-allowed': disableSubmit }" :disabled="disableSubmit" @click="save") Save
            .col-md-10.py-2.mt-2
                LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" v-if="pageCuid!=0" :to="`/Page/${cuid}`") View Page
            .col-md-10.p-2.pt-6.mt-2(class="sm:pt-2 sm:ml-auto sm:mr-6")
                LinkButton(class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600" v-if="pageCuid!=0" to='#') Delete Page
        .div(v-if="errorInPage")    
            label.text-red-500 Error in Creating or Editing Page in the system. 
            br
            label.text-red-500 {{ errorToUser }}
        .mb-36
</template>

<style scoped></style>
