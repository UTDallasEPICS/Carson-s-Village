<script setup lang="ts">

/*
*   Namra Zubair
*	ECS 2200
*	Carson's Village: Automated Family Page
*	PageList.vue 
*	Displays a family page and allows for donation processing
*	Located under "/Page/"
*/

import type { Page, PageDonation, Image } from '@/types.d.ts'
import {  dateFormat, donationFormat } from '@/utils'

const pageData = ref<Page>({
    cuid: "",
    familyCuid: "",
    page_name: "",
    day_of_birth: "",
    day_of_passing: "",
    visitation_date: "",
    visitation_location: "",
    visitation_description: "",
    funeral_date: "",
    funeral_description: "",
    funeral_location: "",
    obituary: "",
    deadline: "",
    donation_goal: 0,
    amount_raised: 0,
    amount_distributed: 0,
    profileImageCuid: "",
    Images: []
});

type donor = {
    first_name: string,
    last_name: string,
    isAnonnomous: boolean,
    comments: string 
}
const donorInfo = ref<donor>({
    first_name: "",
    last_name: "",
    isAnonnomous: false,
    comments: "",
})

const donationData = ref<PageDonation>({
    amount: 0,
    success: false,
    cuid: "",
    pageCuid: "",
    familyCuid: "",
    transaction_id : ""
});

const profileImageLink = ref("")
const imageData = ref<Image[]>([])
const donated_percentage = ref(0);
const donated_percentage_100 = ref(0)
const family_cuid = ref("0")
const router = useRoute();
const id = computed(() =>  router.params.id);
const cvuser = useCookie<Page>('cvuser')
const stripeLink_ref = ref("")


/* 
*  This creates a stripe session and redirects the user to stripe.
*  Then it redirects to /PageDonation/pageCuid/transactionId
*/
const create_checkup_session = async () => {
    const { data : sessionInfo } = await useFetch('/api/create_session', {
        method: 'POST',
        body: {...donationData.value, cuid: id.value, family_cuid: pageData.value.familyCuid, amount_raised: Math.trunc(parseFloat(donationData.value.amount as unknown as string) * 100) as number}
    });
    stripeLink_ref.value = sessionInfo.value as string
    await navigateTo(stripeLink_ref.value as string,  { external: true } )
};

// Method to populate the page with data based on the cuid in the url
const getDataPage = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch('/api/page', {
    method: 'GET',
    query: { cuid: id }
})

if(pageDataDB.value !== false){
    pageData.value = pageDataDB.value as unknown as Page;
    donated_percentage.value = Math.trunc((((pageData.value.amount_raised as number) / (pageData.value.donation_goal as number )) * 100));
    //donated_percentage_100.value = donated_percentage.value*100
    family_cuid.value = pageData.value.familyCuid as string;
    /*console.log(pageData);
    console.log(family_cuid.value as string)
    console.log(donated_percentage.value as number)*/
    // Sets the front end images including the profile image
    if(pageData.value.Images?.length!=0)
        imageData.value = pageData.value.Images as unknown as Image[] 
        for(let i = 0; i < imageData.value?.length; i++){
            if(imageData.value[i].cuid === pageData.value.profileImageCuid){
                profileImageLink.value = imageData.value[i].url
                break;
            }
        }
}
}

onMounted(() => { 
    const progress=(document.querySelector('.progress') || document.createElement("null")) as HTMLElement ;
    progress.style.width=progress?.getAttribute('donated-amount') + "%";
    progress.style.opacity="1";
})

await getDataPage(id.value as string)
// use flex for services 3 rows, justify-center: space-between
const images = ["../blue_image.png", "../profile.png", "../media2.png", "../media3.png", "../media4.png", "../media2.png"]
const pageImages = ["../location_icon.png", "../clock_icon.png"]
const profile = images[1];
const theImage = images[1];
const clock = pageImages[1]
const location = pageImages[0]
</script>

<template lang="pug">
.bg-blue.w-screen(class="h-[80px]")
img.bg-orange-400.-mt-16.mx-auto(class="w-[122px] h-[122px] rounded-[8px]" :src="`${profileImageLink}`")
.text-gray-dark.font-poppins.text-2xl.text-center.font-semibold(style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);") {{ pageData.page_name }}
.row.text-center
  .text-gray-dark.font-poppins.text-md.inline-block {{ dateFormat(pageData.day_of_birth) }} 
  .text-gray-dark.font-poppins.text-md.inline-block.whitespace-pre  - 
  .text-gray-dark.font-poppins.text-md.inline-block {{ dateFormat(pageData.day_of_passing)}}
.div
    
    .py-4.grid(class="sm:grid-cols-6")
        img.object-cover.align-middle(class="w-40 sm:w-64" :src = "`${profileImageLink}`")
        .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11") 
            .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Services
            .div(v-if="pageData.visitation_date")
                .px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
                .flex.justify-between.gap-5
                    //img.px-4(:src="`${clock}`")
                    .py-1.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ "Date:" }}
                    .py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{ dateFormat(pageData.visitation_date) }}
                    //img.px-2(:src="`${location}`")
                .flex.justify-between.gap-5
                    .py-1.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ "Location:" }}
                    .py-1.font-outfit.text-dark-blue.col-span-4.leading-loose.whitespace-normal(style="font-size: 20px; line-height: 30px;") {{ pageData.visitation_location }}
                .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ pageData.visitation_description }}
        .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
            br
            .div(v-if="pageData.funeral_date")
                .px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
                .grid.gap-x-3.gap-y-0.grid-cols-5.grid-rows-2
                    //img.px-4(:src="`${clock}`")
                    .py-1.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ "Date:" }}
                    .py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{ dateFormat(pageData.funeral_date) }}
                    //img.px-2(:src="`${location}`")
                    .py-1.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ "Location:" }}
                    .py-1.font-outfit.text-dark-blue.whitespace-normal.leading-loose.col-span-4(style="font-size: 20px; line-height: 30px;") {{ pageData.funeral_location }}
                    .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ pageData.funeral_description }}
    .div.p-4(id="donations")
        .container(class="sm:overflow-hidden sm:w-3/4 sm:mt-4 sm:mx-auto sm:place-content-center sm:max-w-xl sm:p-6 sm:rounded-card sm:shadow-card")
            .container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
                .text-md.text-center.ml-4.my-3(class="sm:text-xl sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{ donationFormat(pageData.amount_raised)  + " raised of " +  donationFormat(pageData.donation_goal) + " goal" }}
                .py-4
                .progress-bar.overflow-hidden.ml-4.h-5.rounded-full(style="30px; background-color:#b5b5b5;")
                    CVProgress(v-if="donated_percentage >= 100" modelBarWidth=100) {{ donated_percentage  + "%" }}
                    CVProgress(v-else-if="donated_percentage > 0 && donated_percentage < 100" :modelBarWidth="donated_percentage") {{ donated_percentage  + "%" }}
                    CVProgress(v-else style="text-align:center;" modelBarWidth=0) 
                .well.well-sm
                    h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donor Information
                br
                .form-horizontal()
                    .col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
                        CVInput(name='first_name' type='text' v-model="donorInfo.first_name" placeholder='First Name' required)
                    .col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
                        CVInput(name='last_name' type='text' v-model="donorInfo.last_name" placeholder='Last Name' required)
                    .col-md-8.ml-4.pt-4.pr-5.flex
                        input#anonymous(type='checkbox' class="sm:ml-1" name='anonymous' value='Bike')
                        label.mt-4.ml-4.text-md(for='anonymous' class="sm:mt-0" style="letter-spacing: 0.35px;")  Make this an anonymous donation
                    .col-md-8.ml-4.pt-4.pr-5.flex(class="sm:mx-4 sm:w-full sm:py-2")
                        textarea#comments.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" name='comments' rows='3' v-model="donorInfo.comments" placeholder='Comments' required)
                    .col-md-8.ml-4.pt-4.pr-5.grid.grid-cols-3(class="sm:mx-4 sm:w-full sm:py-2")
                        span.rounded-l-md.p-3.col-span-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") Donation Amount
                        .flex
                            span.bg-gray-light.py-2.px-1.text-lg(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4; border-right:none;") $
                            input#donation_amount.bg-gray-light.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4; border-left:none;" name='donation_amount' type="number" min="0.00" step="0.01" v-model="donationData.amount" required)
                    .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center
                        ActionButton.mx-auto.text-md(name='submit' @click="create_checkup_session") DONATE NOW
    .div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageData.obituary }}
    .div.p-4(id="media")
        .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
            .div(style='position: relative ;width:25%; height:auto;' class="basis-1/4" v-for="(image,i) in imageData" :key="i") 
                img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" :src = "`${image.url}`")
        //.container.gap-1(style="width:500px" class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
            div(class="flex" style="overflow-x: auto")
                .div(v-for="(image,i) in imageData" :key="i" style="flex-shrink: 0;") 
                    img.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" style="margin-right:5px" :src = "`${image.url}`")
</template>

<style scoped></style>