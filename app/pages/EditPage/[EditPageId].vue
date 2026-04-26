<script lang="ts" setup>

/*
*   David Haung and Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*	Denotes functions specific to page insertion and page editing  
*	Located under "/EditPage/"
*/

definePageMeta({
  middleware: ['family-guard']
})

import { dateFormat, donationFormat } from '@/utils'
import '@vuepic/vue-datepicker/dist/main.css';
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { vElementSize } from '@vueuse/components'
import type { Image, Page, User, PageDonation, Reply } from '@/types.d.ts'
import type { Family } from "~~/prisma/generated/models"
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const router = useRoute()

const page = ref<Page>({
    id: router.params.EditPageId === 0 ? "" : router.params.EditPageId,
    userCuid: user.value?.id,
    page_first_name: "",
    page_last_name: "",
    day_of_birth: null,
    day_of_passing: null,
    visitation_date: null,
    visitation_location: "",
    visitation_address: "",
    visitation_description: "",
    funeral_date: null,
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
        id: "",
        family_name: "",
        stripe_account_id: "",
        created_at: null,
        updated_at: null,
        FamilyMembers: [],
        Pages: [],
        AdvocateResponsible: {
            id: '',
            name: '',
            role: '',
            email: '',
            phone: '',
            address: '',
            Pages: [],
            familyCuid: '',
            AdvocateFamily: []
        },
        FamilyDonations: [],
        advocateCuid: ""
    } 
})

const isAdvocate = computed(() => user.value?.role == "advocate" || user.value?.role == "admin")
const replies = ref<Reply[]>([])
const profile_image = ref("")
const toggleFiddlyBit = ref(true)
const familyCuid = ref("")
const disableCriteria = computed(() => !page.value?.page_first_name || !page.value?.page_last_name || (!familyCuid.value && isAdvocate.value) )
const errorInPage = ref(false)

// Fetch family data, and set to empty array if not authorized
const { data: rawFamilies, error: familyError } = await useFetch('/api/family', { method: 'GET' })
const allFamilies = computed<Family[]>(() => {
  if (familyError.value || !rawFamilies.value) {
    return [] as Family
  } else {
    return rawFamilies.value
  }
})

// Method that saves form data to the database for a page that has 
const save = async () => {
    if(isAdvocate.value) {
        page.value.familyCuid = familyCuid.value
    } else {
        page.value.familyCuid = user.value?.familyId as string
    }

    if(page.value.id === "0") {
        page.value.start_date = new Date()
    }

    try {
      await $fetch('/api/page', {
        // Checks if there is a pre-existing page to edit or if to create a new page    
        method: page.value.id !== "0" ? 'PUT' : 'POST',
        body: ({ ...page.value })
      })

      // Set error to false and navigate to PageList displaying relevant pages for user
      errorInPage.value = false;
      await navigateTo('/PageList/' + page.value.userCuid + '?fetch=user')
    } catch(e){
        errorInPage.value = true;
        console.error("Failed to save changes to page:", e)
    }
};
const currentFamily = computed(() => allFamilies.value?.find(({ id }: Family) => id == familyCuid.value) || {});

// Method to populate the form when editing a pre-existing page
const getData = async (id: string) => {
  const { data: pageData } = await useFetch(`/api/page/${id}`, {
    method: 'GET'
  })
  if (pageData.value) {
    page.value = pageData.value as unknown as Page;
    familyCuid.value = page.value.familyCuid
  }

  /* 
  * Checking if donation_goal and conversly amount raised is of type number in order to prevent
  * donation_goal and amount_raised from becoming NaN due to applying the donationFormat function to a string. 
  */
  if (typeof page.value.donation_goal === 'number') {
    page.value.amount_raised = donationFormat(page.value.amount_raised as unknown as number).replace("$", "");
    page.value.donation_goal = donationFormat(page.value.donation_goal as unknown as number).replace("$", "");
  }
  replies.value = page.value?.Reply
}

// Watcher for updating profile image when data.Images is updated
watch(
  () => page.value.Images, 
  (images: Image[]) => {
    if (images.length == 0) {
      page.value.profileImageCuid = "";
    }
    // Check if profile image was deleted and if so assign it first image in array
    else if (images.value && !images.find((img: Image) =>  img.id == page.value.profileImageCuid )) {
      page.value.profileImageCuid = images.value[0]   
    }
  }, 
  { deep: true }
)

const updateSuspendButton = (reply:Reply, suspend:boolean) => { // updates the front end of the suspend button
    replies.value.filter((rep:Reply)=> { // ignore filter error for now
        if (rep.id == reply.id) {
            rep.suspended = suspend;
        }
    })
    return;
}

await getData(page.value.id)

const profileImage = computed(() => page.value?.Images.find((i: Image) => i.id == page.value?.profileImageCuid))
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
    form(class="p-3 rounded bg-gray-50")
        //conditional rendering for page editing or page insert. This does not affect the function of Page editting.
        TitleComp(v-if="page.id != 0") Edit Family Page
        TitleComp(v-else) Insert New Family Page
        br
    br
    div
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Personal Information
        div(class="py-4 grid sm:grid-cols-3") 
            div(class="flex")
                CVLabel(for="first_name") First Name
                CVHelpButton(
                  class="inline-block" 
                  description="The first and last name of the recently deceased person this page should be dedicated to should be entered here"
                )
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" v-model='page.page_first_name' type="text" placeholder="required" required="required")
        div(class="py-4 grid sm:grid-cols-3") 
            CVLabel(for="last_name") Last Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="last_name" v-model='page.page_last_name' text="text" placeholder="required" required="required")
        div(v-if="isAdvocate" class="py-4 grid sm:grid-cols-3")
            CVLabel(for="family") Family
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                Listbox(id="family" as='div' v-model="familyCuid" required class="shadow-sm border border-1 rounded-lg")
                    div(class="relative")
                        Transition(
                    leave-active-class='transition ease-in duration-300'
                    leave-from-class='opacity-100'
                    leave-to-class='opacity-0'
                )
                            ListboxOptions(as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' )
                                ListboxOption(as='div' v-for="family in allFamilies" :key="family.id" :value="family.id" class="px-2 border border-grey-500 py-1 my-1") {{ family.family_name }}
                    ListboxButton(class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96') {{ familyCuid ? currentFamily.family_name : 'Select family to add the page to' }}
        ImagePreview(v-model:images="page.Images" :pageCuid="page.id")
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            legend(class="ml-4 sm:py-1 font-bold text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Profile Image Selection        
        div(class="py-4 grid sm:grid-cols-3")
            div(class="flex")
                CVLabel(for="profile_image") Profile Image
                CVHelpButton(class="inline-block z-20" 
description="Here, you select from photos you uploaded to show up at the top of the family page") 
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                Listbox(id="profile_image" v-model="page.profileImageCuid" as="div" class="rounded-lg outline-0 w-full bg-white p-2") 
                    div(class="relative")
                        Transition(
                            leave-active-class='transition ease-in duration-300'
                            leave-from-class='opacity-100'
                            leave-to-class='opacity-0'
                            @leave="toggleFiddlyBit=!toggleFiddlyBit"
                            @enter="toggleFiddlyBit=!toggleFiddlyBit"
                            
                        )
                            ListboxOptions(as='div' :style="{ 'margin-top': profileImgHeight + 'px' }" class='w-full absolute z-10 bg-white shadow-lg shrink-0 max-h-60 max-w-96 mt-8 px-2 py-2 text-base ring-1 ring-black ring-opacity-5 rounded-md overflow-auto focus:outline-none sm:text-sm')
                                    ListboxOption(v-for="(image,k) in page.Images" :key="image.id" :value="image.id")
                                        img(v-if="page.Images.length" :src="image.url" class="py-4 rounded-lg") 
                    ListboxButton(v-element-size="onResize" class='relative rounded-md pl-2 py-4 pr-6 max-w-96 sm:text-sm border border-[#c4c4c4]')
                        div(class="flex")
                            img(v-if="profileImage" :src="profileImage?.url" class="rounded-lg")
                            div(v-else class="rounded-md w-96")
                            CVChevronLeft(v-if="toggleFiddlyBit" class="inline-block size-4 h-2 max-w-8 h-4 text-grey-500 z-3")
                            CVChevronDown(v-else class="inline-block size-4 h-2 max-w-8 h-4 text-gray-500 z-3")
                            
                          
        div(class="py-4 grid sm:grid-cols-3") 
            CVLabel(for="day_of_birth") Day of Birth
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVDatepicker(id="day_of_birth" v-model='page.day_of_birth')
        div(class="py-4 grid sm:grid-cols-3") 
            CVLabel(for="day_of_passing") Day of Passing 
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVDatepicker(id="day_of_birth" v-model='page.day_of_passing')
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Visitation Information 
        div(class="py-4 grid sm:grid-cols-3") 
            CVLabel(for="visitation_date") Date
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVDatepicker(id="visitation_date" v-model='page.visitation_date')
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="visitation_location") Location 
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="visitation_location" v-model='page.visitation_location' placeholder="optional")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="visitation_address") Address  
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="visitation_address" v-model='page.visitation_address' placeholder="optional")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="visitation_description") Description
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVTextArea(id="visitation_description" v-model='page.visitation_description' placeholder="optional")

        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Funeral Information       
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="funeral_date") Date    
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVDatepicker(id="funeral_date" v-model='page.funeral_date')
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="funeral_location") Location 
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="funeral_location" v-model='page.funeral_location' placeholder="optional")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="funeral_address") Address 
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="funeral_address" v-model='page.funeral_address' placeholder="optional")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="funeral_description") Description
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVTextArea(id="funeral_description" v-model='page.funeral_description' placeholder="optional")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="obituary") Obituary
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVTextArea(id="obituary" v-model='page.obituary' placeholder="optional")
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Fundraising Information
        div(class="py-4 grid sm:grid-cols-3")
            div(class="flex")
                CVLabel(for="donation_goal") Goal
                CVHelpButton(class="inline-block" description="If the Donation Goal is 0, it will be assumed that you do not wish to display your donation progress bar and current amount raised.")  
            div(class="flex mx-9 sm:col-span-2 sm:mr-11")
                span(class="rounded-l-md bg-gray-200 text-lg p-2 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] border border-[#c4c4c4]") $
                input(id="donation_goal" v-model='page.donation_goal' class="outline-0 rounded-r-md border-box w-full p-2 border border-[#c4c4c4]")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="deadline") Deadline Date
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVDatepicker(id="deadline" v-model='page.deadline')
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="donation_description") Description
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVTextArea(id="donation_description" v-model='page.donation_description' placeholder="optional")
        div(v-if="replies?.length" class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Comment Moderation
        div(v-if="replies?.length" class="py-4 grid flex-box flex-row item-centered gap-1 leading-none")
            div(class="flex")
            div(v-for="(reply,i) in replies" :key="i" class="reply-box")
                CVReply(:r="reply")
                CVSuspendButton(:suspend="reply.suspended" :rep="reply" @update:suspend="updateSuspendButton")
        div(class="ml-9 mb-9 py-7 flex flex-wrap gap-2")
            div(class="px-2 mt-2")
                ActionButton(:disabled="disableCriteria" @click="save" class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600 disabled:bg-orange-800 disabled:cursor-not-allowed") Save
            div(class="py-2 mt-2")
                LinkButton(v-if="page.id != 0" :to="`/Page/${page.id}`" class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600") View Page
            div(class="p-2 pt-6 mt-2 sm:pt-2 sm:ml-auto sm:mr-6")
                LinkButton(v-if="page.id != 0" to='#' class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600") Delete Page
        div(v-if="errorInPage" class="py-4 grid sm:grid-cols-3 text-red-500")
            CVLabel(for="error") Error in Creating/Editing page in the system.
</template>
