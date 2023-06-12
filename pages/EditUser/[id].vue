<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditUser.vue 
*		Denotes functions specific to user insertion  
*		Located under "/EditUser/"
*/


// Placeholder annotations for the insert user form.
const first_name = '(user defined)'
const last_name = '(user defined)'
const email = '(user defined)'
const middle_name = '(user defined, optional)'
const phone = '(user defined, optional)'

import type { User } from '@/types.d.ts'

const data_user = ref<User>({
    cuid: "",
    first_name: "",
    last_name: "",
    email: "",
    middle_name: "",
    user_role: "{}",
    phone: ""
})

const cvuser = useCookie('cvuser');
const cvData = computed(() => JSON.parse(cvuser.value || "{}"))
const router = await useRoute()
const cuid = computed(() => router.params.id as string);

// Method that creates a new user on the database on the backend
const save = async () => {
    await useFetch('/api/user', {
        method: (cuid.value as string) !== "0" ? 'PUT' : 'POST',
        body: ({ ...data_user.value, cuid: cuid.value as string })
    })

}

// Method to populate the form when editing a pre-existing user
const getData = async (cuid: string) => {
    const { data: userData } = await useFetch('/api/user', {
        method: 'GET',
        query: { cuid: cuid }
    })
    data_user.value = userData.value as unknown as User;
}

if ((cuid.value as string) !== "0")
    await getData(cuid.value as string);
/*onMounted(async() => {
    if((cuid.value as string) !== "0")
        await getData();
})*/
</script>

<template lang="pug">
.row.p-3
LinkButton(to='/') Back
.container.overflow-hidden.mt-4.mx-auto.place-content-center.font-sans.well.well-sm(class="w-5/6 sm:max-w-xl sm:p-6" style="box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
    .well.well-sm
        TitleComp User Account Entry 
        br
        .bar.mx-9(style="border-top: 0.5px solid #646464;")
        br
        .py-4.grid(class="sm:grid-cols-2")
            Label Email
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data_user.email' :placeholder="email")
        .py-4.grid(class="sm:grid-cols-2")
            Label User Role
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='data_user.user_role') Select User Role
                    option family
                    option advocate
        .py-4.grid(class="sm:grid-cols-2")
            Label First Name
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                Input(v-model='data_user.first_name' :placeholder="first_name")
        .py-4.grid(class="sm:grid-cols-2")
            Label Middle Name
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                Input(v-model='data_user.middle_name' :placeholder="middle_name")
        .py-4.grid(class="sm:grid-cols-2")
            Label Last Name
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                Input(v-model='data_user.last_name' :placeholder="last_name" )
        .py-4.grid(class="sm:grid-cols-2")
            Label Phone
            .col-md-8.mx-9(class="sm:col-span-2a sm:mr-11")
                Input(v-model='data_user.phone' :placeholder="phone")
            .col-md-10.py-2
                ActionButton(@click="save") Save    
</template>

<style scoped></style>
