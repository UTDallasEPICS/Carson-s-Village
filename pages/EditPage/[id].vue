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
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

type Page = {
    page_name: string,
    cuid: string,
    day_of_birth: Date,
    day_of_passing: Date,
    visitation_date: Date,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date,
    funeral_description: string,
    funeral_location: string,
    obituary: string,
    timezone: string,
    deadline: Date,
    donation_goal: number,
    amount_raised: number,
}

var data = ref<Page>({
    cuid: "",
    page_name: "",
    day_of_birth: new Date(),
    day_of_passing: new Date(),
    visitation_date: new Date(),
    visitation_location: "",
    visitation_description: "",
    funeral_date: new Date(),
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    timezone: "",
    deadline: new Date(),
    donation_goal: 0,
    amount_raised: 0
})

type User = {
    cuid: string
    first_name: string,
    last_name: string,
    user_role: Object,
    email: string,
    middle_name: string,
    phone: string,
}

const router = useRoute()
const cvuser = useCookie<User>('cvuser');
const cuid = computed(() => router.params.id as string);
const cuidString = cuid.value as string
const image_cuid = "";
const family_cuid_data = computed(() => cvuser.value?.cuid)
const family_cuid = family_cuid_data.value as string
// Method that saves form data to the database for a page that has cuid: router.params.id
const save = async (page_name: string, day_of_birth: string, day_of_passing: string, visitation_date: Date, visitation_location: string, visitation_description: string, obituary: string, deadline: Date, donation_goal: Number) => {
    await useFetch('/api/page', {
        // Checks if there is a pre-existing page to edit or if to create a new page    
        method: router.params.id !== "0" ? 'PUT' : 'POST',
        body: ({ ...data.value, family_cuid: family_cuid_data, cuid: router.params.id as string })
    }
    )
};

// Method to populate the form when editing a pre-existing page
const getData = async () => {
    const { data: pageData } = await useFetch('/api/page', {
        method: 'GET',
        query: { cuid: cuid.value }
    })
    data.value = pageData.value as unknown as Page;
}

if (cuid.value as string !== "0")
  await getData();

// Method to remove a single image
const removeImage = async (theImage: string) => {
    await useFetch('/api/image', {
        method: 'DELETE',
        body: ({ url: theImage })
    }
    )
}

// Placeholder values to annotate the form
var page_name_place_holder = 'required'
var visitation_location_place_holder = 'required'
var visitation_description_place_holder = 'required'
var funeral_location_place_holder = 'required'
var funeral_description_place_holder = 'required'
var obituary_place_holder = 'required'
var donation_goal_place_holder = 'required'
var idExist = cuid.value != "0";

const images = ["../blue_image.png", "../profile.png", "../profile.png", "../media2.png", "../media2.png", "../media2.png", "../media3.png", "../media4.png", "../media2.png", "https://images-dev.carsonsvillage.org/3302bbef4ae68777a7d18c0e6914b25e"]
const selectedImage = [images[1]];
</script>

<template lang="pug">
.row.p-3
NuxtLink.p-3.px-6.pt-2.text-white.bg-orange-500.font-sans(:to="`/PageList/${family_cuid}`" style="font-weight: 700; border-radius: 32px;") Back
.container.overflow-hidden.mt-4.mx-auto.place-content-center.font-sans.well.well-sm(class="w-5/6 sm:max-w-xl sm:p-6" style="box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
    .well.well-sm
        <!-- conditional rendering for page editing or page insert. This does not affect the function of Page editting. -->
        h1.text-center.pt-9.text-xl(v-if="idExist" class="sm:text-3xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); font-weight: 700;" ) Edit Family Page
        h1.text-center.pt-9.text-xl(v-else class="sm:text-3xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); font-weight: 700;" ) Insert New Family Page
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
    br
    .form-horizontal
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Personal Information
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Page Name
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.page_name' :placeholder="page_name_place_holder")  
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Preview Stable
        .py-4.grid.flex-box.flex-directional-row.item-centered.gap-1(class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
            .div(style='position: relative;' v-for="(theImage,j) in selectedImage" :key="j") 
                img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" :src = "`${theImage}`")
                .form-horizontal(style='position: absolute; top: 5px; right: 5px')
                    button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 30px; border-radius: 50%;" @click = "removeImage(theImage)") x
            .col-md-8(class="sm:col-span-2 sm:mr-11")
                .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8" style="overflow-x: scroll; width:250px; height:150px;")
                    .div(style="position:relative; width:30%; height: auto;" v-for="(image,i) in images" :key="i") 
                        img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" :src = "`${image}`")
                        .form-horizontal(style='position: absolute; top: 5px; right: 5px')
                            button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;" @click = "removeImage(image)") x
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Preview Dev
        .py-4.grid.flex-box.flex-directional-row(class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
            .div(style='position: relative'  v-for="(theImage,j) in selectedImage" :key="j") 
                img.object-cover.align-middle.rounded-lg( class="w-40 sm:w-64" :src = "`${theImage}`")
                .form-horizontal(style='position: absolute; top: 5px; right: 5px')
                    button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 30px; border-radius: 50%;" @click = "removeImage(theImage)") x
            .col-md-8(class="sm:col-span-2 sm:mr-11")
                .row.flex.gallery.flex-box.flex-directional-row(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8" style="overflow-x: scroll; width:300px")
                    .div(style='position: relative;' v-for="(image,i) in images" :key="i") 
                        img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" :src = "`${image}`")
                        .form-horizontal(style='position: absolute; top: 5px; right: 5px')
                            button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;" @click = "removeImage(image)") x
        .py-4.grid(class="sm:grid-cols-3")
            a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") image upload
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                ImageUpload()
        .py-4.grid(class="sm:grid-cols-3")
            a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") image replace
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                ImageUpload()
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Selection        
        //Listbox(v-model="data.profile_image")
            ListboxButton() {{ data.profile_image.cuid }}
                ListboxOptions
                    ListboxOption(v-for="image in images" :key="image.cuid" :value="image" ) {{ image.cuid }}                       
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Day of birth (YYYY-MM-DD)  
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.day_of_birth')
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Day of Passing (YYYY-MM-DD)  
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.day_of_passing')  

        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation Information 
        .py-4.grid(class="sm:grid-cols-3")     
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Date (YYYY-MM-DD)  
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11") 
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.visitation_date')
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Location 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.visitation_location' :placeholder="visitation_location_place_holder")
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.visitation_description' :placeholder="visitation_description_place_holder")

        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral Information       
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Date (YYYY-MM-DD)    
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.funeral_date')
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Location 
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.funeral_location' :placeholder="funeral_location_place_holder")
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Description
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.funeral_description' :placeholder="funeral_description_place_holder")
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Obituary
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.obituary' :placeholder="obituary_place_holder")
        .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
            legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Fundraising Information
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Goal    
            .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
                span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
                input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" type="number" min="0.00" step="0.01" v-model='data.donation_goal' :placeholder="donation_goal_place_holder" onblur="(this.type='number')" onfocus="(this.type='number')" required)
        .py-4.grid(class="sm:grid-cols-3")
            label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Deadline Date (YYYY-MM-DD HH:MM)
            .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data.deadline')
        .ml-9.mb-9.py-7.flex.flex-wrap.gap-2
            .col-md-10.py-2
                button.p-3.px-6.pt-2.bg-orange-500(@click="save" style="color: white; font-weight: 700; border-radius: 32px;") Save
            .col-md-10.py-2.mt-2
                NuxtLink.p-3.px-6.pt-2.bg-orange-500(v-if="idExist" :to="`/Page/${cuidString}`" style="color: white; font-weight: 700; border-radius: 32px;") View Page <!-- v-if id!=null--> 
            .col-md-10.p-2.pt-6.mt-2(class="sm:pt-2 sm:ml-auto sm:mr-6")
                NuxtLink.p-3.px-6.pt-2.bg-orange-500(v-if="idExist" to='#' style="color: white; font-weight: 700; border-radius: 32px;") Delete Page <!-- v-if id!=null-->      
                .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
</template>



<style scoped></style>
