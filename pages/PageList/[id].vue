<script lang = "ts" setup>
import type { Page, User } from '@/types.d.ts'
import { dateFormat, donationFormat} from '@/utils'
import { RoutingRuleFilterSensitiveLog } from '@aws-sdk/client-s3'

/*
*   Ofek Shaltiel
*	  ECS 3200
*	  Carson's Village: Automated Family Page
*	  PageList.vue 
*		Shows a list of pages for a specific user based on their cuid
*		Located under "/PageList/"
*/

const family_cuid = ref("")
const router = useRoute()
const family_cuid_data = computed(() => router.params.id)
family_cuid.value = family_cuid_data.value as string;
const pages = ref<Page[]>([])
const cvuser = useCookie<User>('cvuser')
const isAdmin = computed(() => cvuser.value?.user_role == "advocate")

const data = ref<User>({
  cuid: "",
  first_name: "",
  last_name: "",
  user_role: "{}",
  email: "",
  middle_name: "",
  phone: "",
  Pages: [],
  //PageDonations: [],
  //DonationPayouts: []
})

// Method to populate the page list with databased on the cuid of the user in the url
const getDataPageList = async () => {
  if(cvuser.value.cuid === family_cuid.value || cvuser.value.user_role == "advocate"){
  const { data: pagesData } = await useFetch('/api/page_list', {
    method: 'GET',
    query: { family_cuid }
  })

  pages.value = pagesData.value as unknown as Page[]
}
}

await getDataPageList()
</script>

<template lang ="pug">
//.row.p-3
  LinkButton(to='/') Back
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1000px]" style="height: auto; box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
  table(style="table-layout: auto;")
    thead
      tr 
        th.font-poppins.font-bold.p-2(style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));overflow: hidden; border-radius: 60px 0px 0px 0px; width:30%; ")  Page Name
        th.font-poppins.font-bold.overflow-hidden(v-if="isAdmin" style="width:15%;--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") User ID
        th.font-poppins.font-bold(style="width:35%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Donation Deadline
        th.font-poppins.font-bold(style="width:30%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page Edit
        th.font-poppins.font-bold(style="border-radius: 0px 60px 0px 0px; width:20%; --tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));") Page View
      tr(v-for="(item, i) in pages" 
      :key="i" 
      )
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ item.page_name }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center" v-if="isAdmin") {{ item.familyCuid }}
        td.font-poppins.text-gray-dark.font-bold(style="text-align: center") {{ dateFormat(item.deadline) }}
        td
            LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/EditPage/${item.cuid}`") Edit
        td
            LinkButton(class="sm:my-2" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity)); white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="`/Page/${item.cuid}`") View
  .container.bg-blue-300.mx-auto(class="w-auto sm:w-[1000px]" style="--tw-bg-opacity: 1; background-color: rgb(110 171 191 / var(--tw-bg-opacity));height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>		