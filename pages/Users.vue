<script lang = "ts" setup>
/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	Users.vue 
*	Lists all the users in the website
*	Located under "/Users"
*/

import type { User } from "@/types.d.ts"

const users = ref<User[]>([])
const cvuser = useCookie<User>('cvuser')
//const family_cuid_data = computed(() => cvuser.value?.cuid)
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")

// Method that retrieves all the authenticated users on the website (advocates and family members)
const getDataUsers = async () => {
    const { data: usersData } = await useFetch('/api/users', {
        method: 'GET',
    })
    users.value = usersData.value as unknown as User[];
}

if( (isAdmin.value as boolean) == true )
  await getDataUsers()
</script>

<template lang = "pug">
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1000px]" style="height: auto; box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
    table(style="table-layout: auto;")
        thead
            tr
                th.font-poppins.font-bold.font-bold.p-2(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));border-radius: 60px 0px 0px 0px; width:33%; overflow: hidden") User Names
                th.font-poppins.font-bold(style="width:34%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User ID
                th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User Email
                th.font-poppins.font-bold(style="width:33%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Pages
            tr(v-for="(item, i) in users" 
                :key="i" 
            )
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.first_name + " " + item.last_name }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.cuid }}
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.email }}
                LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/pageList/${item.cuid}`") View
    .container.mx-auto(class="w-auto sm:w-[1000px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
</template>