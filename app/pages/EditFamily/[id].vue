<script lang="ts" setup>

/*
*   Ofek Shaltiel
*	ECS 3200
*	Carson's Village: Automated Family Page
*	EditFamily.vue 
*	Denotes functions specific to family creation  
*	Located under "/EditFamily/"
*/
definePageMeta({
  middleware: ["family-guard"]
})

import type { User } from '@/types.d.ts'
import type { Family } from '~~/prisma/generated/models';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { vElementSize } from '@vueuse/components'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const data_user = ref<User>({
    id: "",
    name: "",
    email: "",
    role: "family",
    phone: "",
    address: "",
    Pages: [],
    familyCuid: "",
    AdvocateFamily: []
})
const userCuid = ref("")

const router = useRoute()
const id = computed(() => router.params.id as string);
const isAuthorized = computed(() => { user.value?.role == "advocate" || user.value?.role == "admin"})
const errorInPage = ref(false);

const { data: data_family } = await useFetch(`/api/family/${id.value}`, {
      method: 'GET',
      default() {
        return {} as any
      }
})

// Metat creates a new family on the backend and adds the first user
const createFamily = async () => {
  if(isAuthorized){
    const result = await $fetch('/api/family', {
      method: (id.value !== '0' ? 'PUT' : 'POST'),
      body: ({family_name: data_family.value.family_name, ...data_user.value})
    })

    if(result){
        errorInPage.value = false;
        await navigateTo('/Users')
    } else {
        errorInPage.value = true;
    }
  } 
}

</script>

<template lang="pug">
CVContainer
    form(class="p-3 rounded bg-gray-50")
        TitleComp Family Creation
        br
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
            CVLegend Family Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="family_name") Family Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="family_name" v-model='data_family.family_name' placeholder="(user defined)" required="required")
        div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
             CVLegend New User Information
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="email") Email
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="email" v-model='data_user.email' type="email" placeholder="(user defined)" required="required")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="first_name") Name
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="first_name" v-model='data_user.name' placeholder="(user-defined)" required="required")
        div(class="py-4 grid sm:grid-cols-3")
            CVLabel(for="phone") Phone
            div(class="mx-9 sm:col-span-2 sm:mr-11")
                CVInput(id="phone" v-model='data_user.phone' placeholder="(user defined, optional)")
            div(class="py-2")
                ActionButton(@click="createFamily()" class="transition duration-300 bg-orange-999 hover:bg-green-600") Save    
        div(v-if="errorInPage" class="py-4 grid sm:grid-cols-3 text-red-500")
            CVLabel(for="error_label") Error Creating Family and First Family Member in the System.
</template>

<style scoped></style>
