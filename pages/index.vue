<script lang="ts" setup>

/*
*	ECS 2200
*	Carson's Village: Automated Family Page
*	index.vue 
* Shows the admin and family profile depending on role
*	Located under "/index"
*/


import type { User } from '@/types.d.ts'
import CVHeader from '@/components/CVHeader.vue';


const cvuser = useCookie<User>('cvuser');
const cuid_data = computed(() => cvuser.value?.cuid)
const cuid = cuid_data.value as string
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")
</script>

<template lang="pug">
.container.overflow-hidden.mt-4.mx-auto
  .text-white.w-full.m-0.text-3xl.font-poppins.font-bold.text-center.drop-shadow-sm.p-10(v-if="isAdmin" class="sm:text-5xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Admin Profile
  .text-white.w-full.m-0.text-3xl.font-poppins.font-bold.text-center.drop-shadow-sm.p-10(v-else class="sm:text-5xl" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Family Profile
  .flex.flex-col.justify-start.gap-6(class="sm:grid sm:gap-10 sm:grid-rows-3 sm:grid-cols-2 sm:my-16")
    TextGrayField(class="sm:mx-auto") Name:
    TextGrayField {{ cvuser?.first_name }} {{ cvuser?.last_name }}
    TextGrayField(class="sm:mx-auto") Email:
    TextGrayField {{ cvuser?.email}}
    TextGrayField(class="sm:mx-auto") Phone:
    TextGrayField {{ cvuser?.phone}}
</template>

<style scoped></style>