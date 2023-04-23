<script lang="ts" setup>
//import loginGet from '~~/server/api/login.get';

const first_name = '(user defined)'
const last_name = '(user defined)'
const email = '(user defined)'
const middle_name = '(user defined, optional)'
const phone = '(user defined, optional)'
var first_name_input = ''
var middle_name_input = ''
var last_name_input = ''
var email_input = ''
var phone_input = ''
enum role {
    family,
    admin
}
type User = {
    first_name: String,
    last_name: String,
    user_role : Object,
    email: String,
    middle_name: String,
    phone: String,
}
const data = ref<User>({
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role : "{}",
    phone: ""
})
const cookieUsage = useCookie('cv')
const save =async (first_name: string, last_name: String,user_role:Object, email: String, middle_name: String, phone: String) => {
    await useFetch('/api/user',{
    //method: data.value.id? 'PUT' : 'POST'
})
    
}
</script>

<template lang="pug">
    
div This is where users are created or updated. Admins can create new users and update user info, family members can only update their own. you can do both POSt and PUT here, sw3itching based on whether we are editing a new or existing user. 
    .row.p-3
    nuxtLink.p-3.px-6.pt-2.text-white.bg-orange-500.font-sans(to = '/' style="font-weight: 700; border-radius: 32px;") Back
    .container.overflow-hidden.mt-4.mx-auto.place-content-center.font-sans.well.well-sm(class="w-5/6 sm:max-w-xl sm:p-6" style="box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
        .well.well-sm
            h1.text-center.pt-9.text-xl(class="sm:text-3xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); font-weight: 700;") User Account Entry 
            br
            .bar.mx-9(style="border-top: 0.5px solid #646464;")
            br
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Email
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='email_input' :placeholder="email")
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") User Role
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='userRole') Select User Role
                        option Family
                        option Advocate
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") First Name
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='first_name_input' :placeholder="first_name")
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Middle Name
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='middle_name_input' :placeholder="middle_name")
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Last Name
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='last_name_input' :placeholder="last_name" )
            .py-4.grid(class="sm:grid-cols-3")
                label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Phone
                .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
                    input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='phone_input' :placeholder="phone")
                .col-md-10.py-2
                    button.p-3.px-6.pt-2.bg-orange-500(onclick="save()" style="color: white; font-weight: 700; border-radius: 100px;") Save    
</template>

<style scoped></style>
