<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditPage.vue 
*		Denotes functions specific to page insertion and page editing  
*		Located under "/EditPage/"
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
//console.log(typeof imageData)
const profile_image = ref("")
//const imageLink = ref("")
const selectedImageObj = ref<Image>({
    cuid: "",
    url: "",
    pageCuid: ""
})

var selectedImageObjCopy = undefined

const imageLinkReplacement = ref("")
const router = useRoute()
const cvuser = useCookie<User>('cvuser');
const cvuser2 = useCookie<User2>('cvuser')
const cuid_data = computed(() => router.params.EditPageId);
const cuid = cuid_data.value as string
const image_cuid = "";
const family_cuid_data = computed(() => cvuser.value?.cuid)
const family_cuid = family_cuid_data.value as string
const pageCuid = computed(() => router.params.EditPageId)
const imageListIsNotEmpty = ref(false)
data.value.cuid = cuid;
data.value.familyCuid = family_cuid;
const idExist = computed(() => router.params.EditPageId !== "0")

// Method that saves form data to the database for a page that has cuid: router.params.EditPageId
const save = async () => {
    const { data: saveSuccess } = await useFetch('/api/page', {
        // Checks if there is a pre-existing page to edit or if to create a new page    
        method: router.params.EditPageId !== "0" ? 'PUT' : 'POST',
        body: ({ ...data.value})
    }
    )
    if((saveSuccess as unknown as boolean)){
        await navigateTo('/PageList/' + family_cuid)
    }
};

// Method to populate the form when editing a pre-existing page
const getData = async (cuid: string) => {
    console.log(cvuser2.value.Pages)
    const containedPage = ref(false);
    for(let i = 0 ; i < cvuser2.value.Pages.length; i++){
        if(cvuser2.value.Pages[i].cuid == cuid){
            containedPage.value = true
        }
    }
    if(cvuser.value.user_role == "advocate" || containedPage.value == true){
    const { data: pageData } = await useFetch('/api/page', {
        method: 'GET',
        query: { cuid: cuid }
    })
    if(pageData.value != false){
        data.value = pageData.value as unknown as Page;
        imageData.value = data.value?.Images as unknown as Image[] 
        let profile_image_found = false;
        // Loads the profile_image and selected images to the front end
        if(imageData.value.length != 0){
            for(let i = 0 ; i < imageData.value.length; i++){
                if(imageData.value[i].cuid === data.value.profileImageCuid){
                    profile_image.value = imageData.value[i].url
                    profile_image_found = true
                    break;
                }
            }
            if(!profile_image_found){
                profile_image.value = imageData.value[0].url
            }
            
            selectedImageObj.value.url =  imageData.value[0].url
            selectedImageObj.value.cuid =  imageData.value[0].cuid
            selectedImageObj.value.pageCuid =  imageData.value[0].pageCuid
            selectedImageObjCopy = {...selectedImageObj.value}
            imageListIsNotEmpty.value = true;
        }
    }
    
    //console.log(data)
    console.log(data.value.donation_goal as string)
    /* 
    * Checking if donation_goal and conversly amount raised is of type number in order to prevent
    * donation_goal and amount_raised from becoming NaN due to applying the donationFormat function to a string. 
    */ 
    if(typeof data.value.donation_goal === 'number'){
    data.value.amount_raised = donationFormat(data.value.amount_raised as unknown as number).replace("$","") ;
    data.value.donation_goal = donationFormat(data.value.donation_goal as unknown as number).replace("$","") ;
    }
    console.log(data.value.donation_goal)
}
}

// Method that saves images to the frontend on image upload.
const saveImage = async (theImage: Image) => {
    imageData.value.push(theImage)
    // Creates a selected image for the first image uploaded
    if(selectedImageObj.value.cuid === ""){
        selectedImageObj.value = theImage as unknown as Image
        selectedImageObjCopy = {...selectedImageObj.value}
    }
    // Creates a profile image for the first image uploaded
    if(profile_image.value === ""){
        profile_image.value = theImage.url 
    }
}

// Method to remove a single image
const removeImage = async (theImage: Image) => {
    // Confirmation of image deletetion. If no is pressed nothing happens
    if(confirm('Are you sure you want to delete this image?')){
    
    for(let i = 0 ; i < imageData.value.length; i++){
        if(imageData.value[i].cuid === theImage.cuid){
            imageData.value.splice(i, 1)
            if(selectedImageObj.value.cuid === theImage.cuid && imageData.value.length !=0 ){
                selectedImageObj.value.url = imageData.value[0].url
                selectedImageObj.value.cuid = imageData.value[0].cuid
                selectedImageObj.value.pageCuid = imageData.value[0].pageCuid
                profile_image.value = imageData.value[0].url
            } else if(imageData.value.length === 0){
                profile_image.value = ""
                selectedImageObj.value.cuid = ""
                selectedImageObj.value.url = ""
                selectedImageObj.value.pageCuid = ""
            }
            await useFetch('/api/image', {
            method: 'delete',
            body: ({ image : theImage })
            })
            if(theImage.url === profile_image.value && imageData.value.length !=0){
                profile_image.value = imageData.value[0].url
                data.value.profileImageCuid = imageData.value[0].cuid
            }
            return selectedImageObjCopy = {...selectedImageObj.value};
            }
    }
}
}

// Method to set an uploaded image as the profile image of a page
// There is no network request because the profiile image cuid is saved with the rest of the form
const setProfileImage = async (theImage: Image) => {
    data.value.profileImageCuid = theImage.cuid
    profile_image.value = theImage.url
}

// Method that uploads an image to replace the image that is on the left, the selected image, and replaces it.
const replaceImage = async (theImage: Image) => {
    await useFetch('/api/image', {
        method: 'put',
        body: ({ imageUploaded: theImage, replacedImage: selectedImageObj, page_cuid: pageCuid.value as string })
    }
    )
    if(imageData.value.length === 0){
        imageData.value[0] = theImage
        selectedImageObj.value = theImage
        selectedImageObjCopy = {...selectedImageObj.value}
        data.value.profileImageCuid = theImage.cuid
        profile_image.value = theImage.url
        return;
    }
    for(let i = 0 ; i < imageData.value.length; i++){
        if(imageData.value[i].cuid == selectedImageObj.value.cuid){
            imageData.value[i] = theImage
            break;
        }
    }
    if(selectedImageObj.value.url === profile_image.value){
        data.value.profileImageCuid = imageData.value[0].cuid
        profile_image.value = imageData.value[0].url
    }
    selectedImageObj.value = theImage   
    selectedImageObjCopy = {...selectedImageObj.value}
}

const selectImage = function(theImage: Image){
    selectedImageObj.value = theImage as unknown as Image
    selectedImageObjCopy = {...selectedImageObj.value}
}

await getData(useRoute().params.EditPageId as string)
</script>

<template lang="pug">
//.row.p-3
    LinkButton(:to="`/PageList/${family_cuid}`") Back
CVContainer
    .well.well-sm
        <!-- conditional rendering for page editing or page insert. This does not affect the function of Page editting. -->
        TitleComp(v-if="idExist") Edit Family Page
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
                CVInput(v-model='data.page_name' placeholder="required")
        ImagePreview(:profileImage= "profile_image" :selectedImageObject = "selectedImageObj" :images = "imageData")
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            CVLegend Images
        
        .py-4.grid(class="sm:grid-cols-3") 
            div(v-if="imageData.length !=0" style='position: relative;') 
                img.cursor-pointer.object-cover.align-middle.rounded-lg(class="hover:opacity-1/2 w-40 sm:w-64" :src = "`${selectedImageObj.url}`")
                .absolute(style='top: 10px; right: 150px')
                    button.bg-red-500(class='w-40 sm:64' style="align-items: center;justify-content: center;line-height: 1;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(selectedImageObjCopy)") x
            a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") image upload
                ImageUpload(@imageUploaded="saveImage" :pageCuid="cuid" isImageReplace="false")
        .py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="imageData.length!= 0" class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
            div(style="width:1200px" class="")
                div(class="flex" style="overflow-x: auto")
                    .div(v-for="(image,i) in imageData" :key="i" style="flex-shrink: 0; position: relative;") 
                        img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-40 sm:w-64" style="margin-right:5px" :src = "`${image.url}`" @click="selectImage(image)")
                        .form-horizontal(style='position: absolute; top: 10px; right: 10px')
                            button.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 2;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(image)") x
        //.py-4.grid(class="sm:grid-cols-3") 
            a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") image replace
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                ImageUpload(:pageCuid="cuid" @imageUploaded="replaceImage" isImageReplace="true")
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Profile Image Selection        
        .py-4.grid(class="sm:grid-cols-3") 
            CVLabel Profile Image
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Listbox.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="width:350px; border: 1px solid #c4c4c4;" v-model="profile_image" as="div") 
                    ListboxButton
                        img.rounded-lg(style="padding: 10px;" :src = "`${profile_image}`")
                        ListboxOptions(v-for="(image,k) in imageData" :key="k" :value="image" @click="setProfileImage(image)")
                            img.rounded-lg(style="padding: 10px;" :src = "`${image.url}`")                                            
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
