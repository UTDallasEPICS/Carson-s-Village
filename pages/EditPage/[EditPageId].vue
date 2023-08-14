<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Denotes functions specific to page insertion and page editing  
*	Located under "/EditPage/"
*/

import ImageUpload from '@/components/ImageUpload.vue'
import CVInput from '@/components/CVInput.vue'
import CVLabel from '@/components/CVLabel.vue'
import CVDatepicker from '@/components/CVDatepicker.vue'
import '@vuepic/vue-datepicker/dist/main.css';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

import type { Image, Page, User } from '@/types.d.ts'
import { donationFormat } from '@/utils'

const data = ref<Page>({
    cuid: "",
    familyCuid: "",
    page_name: "",
    day_of_birth: new Date().toString(),
    day_of_passing: new Date().toString(),
    visitation_date: new Date().toString(),
    visitation_location: "",
    visitation_description: "",
    funeral_date: new Date().toString(),
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    deadline: new Date().toString(),
    donation_goal: 0,
    amount_raised: 0,
    amount_distributed: 0,
    profileImageCuid: "",
    Images: []
})
type User2 = {
    cuid: string
    first_name: string,
    last_name: string,
    user_role: Object,
    email: string,
    middle_name: string,
    phone: string,
    Pages: Page[]
    //PageDonations: PageDonation[]
    //DonationPayouts: DonationPayout[]  
}

const imageData = ref<Image[]>([])
const profile_image = ref("")

const router = useRoute()
const cvuser = useCookie<User>('cvuser');
const cvuser2 = useCookie<User2>('cvuser')
const cuid_data = computed(() => router.params.EditPageId);
const cuid = cuid_data.value as string
const family_cuid_data = computed(() => cvuser.value?.cuid)
const family_cuid = family_cuid_data.value as string
const pageCuid = computed(() => router.params.EditPageId)
data.value.cuid = cuid;
data.value.familyCuid = family_cuid;

// Method that saves form data to the database for a page that has cuid: router.params.EditPageId
const save = async () => {
    const { data: saveSuccess } = await useFetch('/api/page', {
        // Checks if there is a pre-existing page to edit or if to create a new page    
        method: router.params.EditPageId !== "0" ? 'PUT' : 'POST',
        body: ({ ...data.value })
    }
    )
    if (saveSuccess.value == true) {
        await navigateTo('/PageList/' + family_cuid)
    } else {
        alert("Error in creating a page")
    }
};

// Method to populate the form when editing a pre-existing page
const getData = async (cuid: string) => {
    const pageFound = cvuser.value.Pages.find((i: Page) => i.cuid == router.params.EditPageId) != undefined
    // Allowing access to the user's EditPage only if user is an advocate or it is one of the family's family pages.
    if (pageFound || cvuser.value.user_role == "advocate") {

        const { data: pageData } = await useFetch('/api/page', {
            method: 'GET',
            query: { cuid: cuid }
        })
        if (pageData.value) {
            data.value = pageData.value as unknown as Page;
            imageData.value = data.value?.Images as unknown as Image[]
        // Not nessesary with proper logic in watchers?
        // 1st case is handling getting the profile image from the images in imageData
        // 2nd case is handling corrupt values of profile image of if the profileImageCuid exists 
        // but is not in imageData
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
    }
}

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

// Use watcher on for images to handle profile image on here to handle image remove edge cases.
await getData(useRoute().params.EditPageId as string)
const profileImage = computed(() => data.value?.Images.find((i: Image) => i.cuid == data.value?.profileImageCuid))
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
    .div
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            CVLegend Personal Information
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Page Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.page_name' placeholder="required" required)
        ImagePreview(v-model:images="imageData" :images="data.Images" :profileImage="profileImage" @profileImage="setProfileImage" @images="setImagesPreview")
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Profile Image Selection        
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Profile Image
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="width:350px; border: 1px solid #c4c4c4;" v-model="data.profileImageCuid" as="div") 
                    ListboxButton(class='bg-white relative rounded-md pl-2 py-2 sm:text-sm')
                        img.rounded-lg(style="padding: 10px;" :src="profileImage?.url")
                    ListboxOptions(as='div' style="width:350px;" class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                        ListboxOption(v-for="(image,k) in imageData" :key="image.cuid" :value="image.cuid")
                            img.rounded-lg(style="padding: 10px;" :src="image.url")
                          
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Day of Birth
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.day_of_birth')
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Day of Passing 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.day_of_passing')
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            CVLegend Visitation Information 
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Date
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.visitation_date')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Location 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.visitation_location' placeholder="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.visitation_description' placeholder="required")

        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            CVLegend Funeral Information       
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Date    
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.funeral_date')
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Location 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVInput(v-model='data.funeral_location' placeholder="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.funeral_description' placeholder="required")
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Obituary
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVTextArea(v-model='data.obituary' placeholder="required")
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            CVLegend Fundraising Information
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Goal    
            .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
                span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
                input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.donation_goal' placeholder="required" required)
        .py-4.grid(class="sm:grid-cols-3")
            CVLabel Deadline Date
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                CVDatepicker(v-model='data.deadline')
        .ml-9.mb-9.py-7.flex.flex-wrap.gap-2
            .col-md-10.px-2.mt-2
                ActionButton(@click="save") Save
            .col-md-10.py-2.mt-2
                LinkButton(v-if="pageCuid!=0" :to="`/Page/${cuid}`") View Page
            .col-md-10.p-2.pt-6.mt-2(class="sm:pt-2 sm:ml-auto sm:mr-6")
                LinkButton(v-if="pageCuid!=0" to='#') Delete Page  
</template>

<style scoped></style>
