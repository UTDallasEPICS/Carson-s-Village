<script lang="ts" setup>

/*
*	ECS 2200
*	Carson's Village: Automated Family Page
*	index.vue 
* Shows the admin and family profile depending on role
*	Located under "/index"
*/

definePageMeta({
  middleware: ["family-guard"]
})

import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const isAdvocate = computed(() => user.value?.role == "advocate")
const isAdmin = computed(() => user.value?.role == 'admin')
</script>

<template lang="pug">
div(class=" container overflow-hidden mt-4 mx-auto")
  div(
    v-if="isAdvocate"
    class="text-white w-full m-0 text-3xl font-poppins font-bold text-center drop-shadow-sm p-10 sm:text-5xl text-shadow-[3px_3px_4px_rgb(0_0_0_/_0.25)] bg-[#5aadc2]"
  ) Advocate Profile
  div(
    v-else-if="isAdmin"
    class="text-white w-full m-0 text-3xl font-poppins font-bold text-center drop-shadow-sm p-10 sm:text-5xl text-shadow-[3px_3px_4px_rgb(0_0_0_/_0.25)] bg-[#5aadc2]"
  ) Admin Profile  
  div(
    v-else
    class="text-white w-full m-0 text-3xl font-poppins font-bold text-center drop-shadow-sm p-10 sm:text-5xl text-shadow-[3px_3px_4px_rgb(0_0_0_/_0.25)] bg-[#5aadc2]"
  ) Family Profile  
  div(class="flex flex-col justify-start gap-6 sm:grid sm:gap-10 sm:grid-rows-3 sm:grid-cols-2 sm:my-12")
    TextGrayField(class="sm:mx-auto") Name:
    TextGrayField {{ user?.name }}
    TextGrayField(class="sm:mx-auto") Email:
    TextGrayField {{ user?.email }}
    TextGrayField(class="sm:mx-auto") Phone:
    TextGrayField {{ user?.phone }}
LinkButton(
  v-if="isAdmin || isAdvocate"
  class="sm:my-2 transition duration-300 bg-orange-999 hover:bg-green-600"
  :to="`/EditUser/${user?.id}`"
) Edit Profile
</template>

<style scoped></style>
