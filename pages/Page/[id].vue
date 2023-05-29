<script setup lang="ts">

/*
*   Namra Zubair
*	ECS 2200
*	Carson's Village: Automated Family Page
*	PageList.vue 
*	Displays a family page and allows for donation processing
*	Located under "/Page/"
*/

import type { Page } from '@/types.d.ts'
import {  dateFormat, donationFormat } from '@/utils'

type Donation = {
    amount_raised: number,
    first_name: string,
    last_name: string,
    comments: string
    transaction_id: string
};

const pageData = ref<Page>({
    cuid: "",
    familyCuid: "",
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
    amount_raised: 0,
   
});

const donationData = ref<Donation>({
    amount_raised: 0,
    first_name: "",
    last_name: "",
    comments: "",
    transaction_id : ""
});

var donated_percentage = ref(0);
var family_cuid = ref("0")
const router = await useRoute(); 
const cvuser = useCookie('cvuser');
//const cuid = computed(() => parseInt(router.params.id as string || "0"));
const cv_data = computed(() => JSON.parse(cvuser.value || "{}"));
//const page_data_cookie = useCookie('cv');
var id = computed(() =>  '');
//const page_data = computed(() => JSON.parse(page_data_cookie.value || "{}"));
const cvuser2 = useCookie<Page>('cvuser')
//const family_cuid_data = computed(() => cvuser2.value?.cuid)
//const family_cuid = family_cuid_data.value as string;

/* Right now this creates a stripe session and redirects the user to stripe.
*  Then it redirects to /PageDonation/cuid/transaction_id
*/
const create_checkup_session = async () => {
    const { data : sessionInfo } = await useFetch('/api/create_session', {
        method: 'POST',
        body: {...donationData.value, cuid: id.value, family_cuid: pageData.value.familyCuid, amount_raised: parseFloat(donationData.value.amount_raised as unknown as string) * 100}
    });
    
    if(sessionInfo.value !== null){
        console.log("we execute through here!")
        /*await useFetch('/api/complete_session', {
        method: 'GET',
    });*/
    }
};

// Method to populate the page with data based on the cuid in the url
const getDataPage = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch('/api/page', {
    method: 'GET',
    query: { cuid: id }
})

pageData.value = pageDataDB.value as unknown as Page;
donated_percentage.value = Math.trunc(((pageData.value.amount_raised / pageData.value.donation_goal ) * 100) * 100)/100;
family_cuid.value = pageData.value.familyCuid as string;
console.log(pageData);
console.log(family_cuid.value as string)
}

onMounted(async() => { 
    //setTimeout(() => { bellow code attempting to load the id before the DOM }, 1)
    /*
    update the progress bar based on donation amount !!!!!
    */
    //const progress=document.querySelector('.progress') || "{}" ;
    //progress.style.width=progress?.getAttribute('donated-amount') + "%";
    //progress.style.opacity=1;
    id = computed(() =>  router.params.id) as ComputedRef<string>;
    await getDataPage(id.value as string)
    })

const images = ["../blue_image.png", "../profile.png", "../media2.png", "../media3.png", "../media4.png", "../media2.png"]
const pageImages = ["../location_icon.png", "../clock_icon.png"]
const profile = images[1];
const theImage = images[1];
const clock = pageImages[1]
const location = pageImages[0]
</script>

<template lang="pug">
.bg-blue.w-screen(class="h-[80px]")
img.bg-orange-400.-mt-16.mx-auto(class="w-[122px] h-[122px] rounded-[8px]" :src="`${profile}`")
.text-gray-dark.font-poppins.text-2xl.text-center.font-semibold(style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);") {{ pageData.page_name }}
.row.text-center
.text-gray-dark.font-poppins.text-md.inline-block.text-center {{ dateFormat(pageData.day_of_birth) }} 
.text-gray-dark.font-poppins.text-md.inline-block.whitespace-pre  - 
.text-gray-dark.font-poppins.text-md.inline-block {{ dateFormat(pageData.day_of_passing)}}
.row.p-3
NuxtLink.mx-16.p-3.px-6.pt-2.text-white.bg-orange-400.font-poppins(style="font-weight: 700; border-radius: 32px;" :to="`/PageList/${family_cuid}`") Back
.div(style="background: #F8F8F8;")
    .div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageData.obituary }}
    .div.p-4(id="services")
        .div(v-if="pageData.visitation_date")
            .px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
            .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ pageData.visitation_description }}
            .grid.gap-x-3.gap-y-0.grid-cols-5.grid-rows-2
                img.px-4(:src="`${clock}`")
                .py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{ dateFormat(pageData.visitation_date) }}
                img.px-2(:src="`${location}`")
                .py-2.font-outfit.text-dark-blue.col-span-4.whitespace-normal(style="font-size: 20px; line-height: 30px;") {{ pageData.visitation_location }}
        .div(v-if="pageData.funeral_date")
            .px-5.py-4.text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
            .px-5.pt-2.pb-8.font-outfit.text-dark-blue(style="font-size: 20px; line-height: 30px;") {{ pageData.funeral_description }}
            .grid.gap-x-3.gap-y-0.grid-cols-5.grid-rows-2
                img.px-4(:src="`${clock}`")
                .py-1.font-outfit.text-dark-blue.col-span-4(style="font-size: 20px; line-height: 30px;") {{ dateFormat(pageData.funeral_date) }}
                img.px-2(:src="`${location}`")
                .py-2.font-outfit.text-dark-blue.col-span-4.whitespace-normal.leading-loose(style="font-size: 20px; line-height: 30px;") {{ pageData.funeral_location }}
    .div.p-4(id="donations")
        .container(class="sm:overflow-hidden sm:w-3/4 sm:mt-4 sm:mx-auto sm:place-content-center sm:max-w-xl sm:p-6 sm:rounded-card sm:shadow-card")
            .container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
                .text-md.text-center.ml-4.my-3(class="sm:text-xl sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{ donationFormat(pageData.amount_raised)  + " raised of " +  donationFormat(pageData.donation_goal) + " goal" }}
                .progress-bar.overflow-hidden.ml-4.h-5.rounded-full(style="30px; background-color:#b5b5b5;")
                    .progress.rounded-full.text-white.flex.items-center.justify-center(donated-amount=donated_percentage style="background: linear-gradient(90deg, rgba(15,200,0,1) 35%, rgba(203,255,0,1) 100%); box-shadow: 0 3px 3px -5px #1ba710, 0 2px 5px #1ba710; height: 100%; opacity: 1; width: 30%;") {{ donated_percentage  + "%" }}
                .well.well-sm
                    h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donor Information
                        .bar(style="border-top: 0.5px solid #646464;")
                br
                .form-horizontal()
                    .col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
                        input#first_name.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" name='first_name' type='text' v-model="donationData.first_name" placeholder='First Name' required)
                    .col-md-8.ml-4.pt-1.pr-5(class="sm:mx-4 sm:w-full sm:py-2")
                        input#last_name.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" name='last_name' type='text' v-model="donationData.last_name" placeholder='Last Name' required)
                    .col-md-8.ml-4.pt-4.pr-5.flex
                        input#anonymous(type='checkbox' class="sm:ml-1" name='anonymous' value='Bike')
                        label.mt-4.ml-4.text-md(for='anonymous' class="sm:mt-0" style="letter-spacing: 0.35px;")  Make this an anonymous donation
                    .col-md-8.ml-4.pt-4.pr-5.flex(class="sm:mx-4 sm:w-full sm:py-2")
                        textarea#comments.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" name='comments' rows='3' v-model="donationData.comments" placeholder='Comments' required)
                    .col-md-8.ml-4.pt-4.pr-5.grid.grid-cols-3(class="sm:mx-4 sm:w-full sm:py-2")
                        span.rounded-l-md.p-3.col-span-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") Donation Amount
                        .flex
                            span.bg-gray-light.py-2.px-1.text-lg(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4; border-right:none;") $
                            input#donation_amount.bg-gray-light.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4; border-left:none;" name='donation_amount' type="number" min="0.00" step="0.01" v-model="donationData.amount_raised" required)
                    .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center
                        button#submit.mx-auto.p-3.px-6.pt-2.bg-orange-400.text-md(style="color: white; font-weight: 700; border-radius: 32px;" name='submit' @click="create_checkup_session") DONATE NOW
    .div.p-4(id="media")
        .row.gallery.flex.flex-wrap.gap-1.items-center.justify-center(class="basis-1/2 sm:basis-1/4 sm:gap-3 sm:m-8")
            .div(style='position: relative ;width:25%; height:auto;' v-for="(image,i) in images" :key="i") 
                img.object-cover.align-middle.rounded-lg( class="w-40 sm:w-64" :src = "`${image}`")
</template>

<style scoped></style>