<script lang="ts" setup>
const isAdmin  = ref(false)
// const user = useCookie()
type Profile ={
    profileName: String,
    Email:  String,
    Phone: String
}

const data= ref<Profile>({
    profileName: "",
    Email: "",
    Phone: ""
})

const cvuser = useCookie('cvuser');
</script>

<template lang="pug">
div 
    .container.overflow-hidden.mt-4.mx-auto(class="w-5/6 sm:w-[1000px] sm:h-[650px]" style="height: 600px; box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
        .text-white.bg-blue.w-full.m-0.text-3xl.font-poppins.font-bold.text-center.drop-shadow-sm.p-10(class="sm:text-5xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Family Profile
        .text-white.bg-blue.w-full.m-0.text-3xl.font-poppins.font-bold.text-center.drop-shadow-sm.p-10(v-if="isAdmin" class="sm:text-5xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Admin Profile
        .flex.flex-col.justify-start.gap-6(class="sm:grid sm:gap-10 sm:grid-rows-3 sm:grid-cols-2 sm:my-16")
            .text-gray-dark.font-poppins.font-bold.pt-4.text-xl.ml-8(class="sm:mx-auto sm:text-3xl") Name:
            .text-gray-dark.font-poppins.font-bold.text-xl.ml-8(class="sm:text-3xl") {{ profileName }}
            .text-gray-dark.font-poppins.font-bold.text-xl.ml-8(class="sm:mx-auto sm:text-3xl")   Email:
            .text-gray-dark.font-poppins.font-bold.text-xl.ml-8(class="sm:text-3xl") {{email}}
            .text-gray-dark.font-poppins.font-bold.text-xl.ml-8(class="sm:mx-auto sm:text-3xl")   Phone:
            .text-gray-dark.font-poppins.font-bold.text-xl.ml-8(class="sm:text-3xl") {{phone}}
        .buttons.flex.gap-3(class=" sm:gap-10 space-between  sm:my-24" )
           
       
            NuxtLink.p-4.mx-auto.text-white.font-poppins.font-bold.bg-orange-400.rounded-full.w-fit(to='/Pages') List of client pages
            NuxtLink.p-4.mx-auto.text-white.font-poppins.font-bold.bg-orange-400.rounded-full.w-fit(to='/EditPage') Insert new page
            NuxtLink.p-4.mx-auto.text-white.font-poppins.font-bold.bg-orange-400.rounded-full.w-fit(v-if="isAdmin" to='/Users') See all users
            NuxtLink.p-4.mx-auto.text-white.font-poppins.font-bold.bg-orange-400.rounded-full.w-fit(v-if="isAdmin" to='/EditUser') Invite user
</template>

<style scoped></style>
