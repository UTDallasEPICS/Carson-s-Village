<script lang="ts" setup>

import { ref } from 'vue'

var dt=null;

type Page ={
    Cuid: string
    url : String
    page_name: string,
    timezone: String,
    day_of_birth: Date,
    day_of_passing: Date,
    visitation_date: Date,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date,
    funeral_description: String,
    funeral_location: String,
    obituary: String,
    deadline: Date,
    donation_goal: Number,
    query: String
}

const data = ref<Page>( {
    Cuid : "",
    url : "",
    timezone : "",
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
    deadline: new Date(),
    donation_goal: 0,
    query: ""
})
// use vue router to extract the id, then call useFetch
const cvPage = useCookie('cv');
const cvData = computed (() => JSON.parse(cvPage.value || "{}"))
console.log(cvData);


// saving the contents of the page edit form to the backend route page.POST for no existing page indicted by no id or put with an existing page.
const save =async (page_name: string, day_of_birth: string, day_of_passing: string, visitation_date: Date, visitation_location: string, visitation_description: string,obituary:string, deadline:Date, donation_goal:Number) => {
    
    await useFetch('/api/page', {
    method: data.value.Cuid? 'PUT' : 'POST'
    
}
)};
const router = useRoute()
const id = computed(() => {router.params.id});
console.log(id);

var page_name = 'required'
var page_name_place_holder = 'required'
var visitation_location_place_holder = 'required'
var visitation_description_place_holder = 'required'
var funeral_location_place_holder ='required'
var funeral_description_place_holder = 'required'
var obituary_place_holder = 'required'
var donation_goal_place_holder = 'required'
var idExist = false;

</script>

<template lang="pug">

div This is where page editing goes.
        .row.p-3
        nuxtLink.p-3.px-6.pt-2.text-white.bg-orange-500.font-sans(to = '/Pages' style="font-weight: 700; border-radius: 32px;") Back
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
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") {{ page_name }} Page Name
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='page_name_input' :placeholder="page_name_place_holder")
                .py-4.grid(class="sm:grid-cols-3")
                    a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Images
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input#images.rounded-md.outline-0.border-box.w-full.p-2(class="sm:ml-2" style="border: 1px solid #c4c4c4;" name='images' type='file' accept=".png,.jpeg,.jpg,.gif" multiple)
                .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
                    legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Preview
                .py-4.grid.flex-box.flex-directional-row(class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
                    .div(style='position: relative') 
                                img.object-cover.align-middle.rounded-lg( class="w-40 sm:w-64" src = "https://carsonsvillage.org/wp-content/uploads/2018/10/arrow-blue-1.jpg")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center;color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 30px; border-radius: 50%;") x
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg( class="w-40 sm:w-64" src = "https://carsonsvillage.org/wp-content/uploads/2018/10/arrow-blue-1.jpg")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg(src = "https://carsonsvillage.org/wp-content/uploads/2018/09/Logo-e1559690539778.png")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500.align-middle(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ;color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg(src = "https://carsonsvillage.org/wp-content/uploads/2018/10/arrow-blue-1.jpg")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500.align-middle(style="display: flex;align-items: center;justify-content: center;text-align: center ;color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg(src = "https://carsonsvillage.org/wp-content/uploads/2018/09/Logo-e1559690539778.png")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500.align-middle(style="line-height: -55px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg(src = "https://carsonsvillage.org/wp-content/uploads/2018/10/arrow-blue-1.jpg")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500.align-middle(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x
                            .div(style='position: relative ;width:25%; height:auto;') 
                                img.object-cover.align-middle.rounded-lg(  src = "https://carsonsvillage.org/wp-content/uploads/2018/09/Logo-e1559690539778.png")
                                form.form-horizontal(style='position: absolute; top: 5px; right: 5px')
                                    fieldset
                                        button#remove.bg-red-500(style="display: flex;align-items: center;justify-content: center;line-height: 0px;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 15px; height: 15px; border-radius: 50%;") x 
                                        
                                        
                                        
                                        
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Day of birth (YYYY-MM-DD)  
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='date_of_birth_input' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Day of Passing (YYYY-MM-DD)  
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='date_of_passing_input' :placeholder="date_of_passing" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}")  
            
                .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
                    legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation Information 
                .py-4.grid(class="sm:grid-cols-3")     
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Date (YYYY-MM-DD)  
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11") 
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='visitation_date_input' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Location 
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='visitation_location_input' :placeholder="visitation_location_place_holder")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Description
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='visitation_description_input' :placeholder="visitation_description_place_holder")
            
                .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
                    legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral Information       
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Date (YYYY-MM-DD)    
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='funeral_date_input' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Location 
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='funeral_location_input' :placeholder="funeral_location_place_holder")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Description
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='funeral_description_input' :placeholder="funeral_description_place_holder")
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Obituary
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        textarea.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='obituary_input' :placeholder="obituary_place_holder")
                .information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
                    legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Fundraising Information
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Goal    
                    .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
                        span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
                        input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" type="number" min="0.00" step="0.01" v-model='donation_goal_input' :placeholder="donation_goal_place_holder" onblur="(this.type='number')" onfocus="(this.type='number')" required)
                .py-4.grid(class="sm:grid-cols-3")
                    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Deadline Date (YYYY-MM-DD HH:MM)
                    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='deadline_input' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}")
                .ml-9.mb-9.py-7.flex.flex-wrap.gap-2
                    .col-md-10.py-2
                        button.p-3.px-6.pt-2.bg-orange-500(@click="save" style="color: white; font-weight: 700; border-radius: 32px;") Save
                    .col-md-10.py-2.mt-2
                        NuxtLink.p-3.px-6.pt-2.bg-orange-500(v-if="idExist" to='/Page' style="color: white; font-weight: 700; border-radius: 32px;") View Page <!-- v-if id!=null--> 
                    .col-md-10.p-2.pt-6.mt-2(class="sm:pt-2 sm:ml-auto sm:mr-6")
                        NuxtLink.p-3.px-6.pt-2.bg-orange-500(v-if="idExist" to='#' style="color: white; font-weight: 700; border-radius: 32px;") Delete Page <!-- v-if id!=null-->      
                        .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
</template>

    
<style scoped></style>
