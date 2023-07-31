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

// shrink profile image selection to 100px, expand image gallery, place image upload next to selected image
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

var familyCuid = "0"
const profileImageLink = ref("")
const imageData = ref<Image[]>([])
const donated_percentage = ref("0");
const donated_percentage_100 = ref(0)
const family_cuid = ref("0")
const router = useRoute();
const id = computed(() =>  router.params.id);
const pageCuid = id.value as string
const cvuser = useCookie<Page>('cvuser')
const stripeLink_ref = ref("")
donationData.value.pageCuid = id.value as string;
donationData.value.familyCuid = pageData.value.familyCuid

/* 
*  This creates a stripe session and redirects the user to stripe.
*  Then it redirects to /PageDonation/pageCuid/transactionId
*/
const create_checkout_session = async () => {
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
    donated_percentage.value = (((pageData.value.amount_raised as number) / (pageData.value.donation_goal as number )) * 100).toFixed(1) + "";
    family_cuid.value = pageData.value.familyCuid as string;
    familyCuid = family_cuid.value as string

    console.log(donated_percentage.value as string)
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
// Use 2x2 grid to place donation entry component bellow images, and place obituary right next to that
const images = ["../blue_image.png", "../profile.png", "../media2.png", "../media3.png", "../media4.png", "../media2.png"]
const pageImages = ["../location_icon.png", "../clock_icon.png"]
const profile = images[1];
const theImage = images[1];
const clock = pageImages[1]
const location = pageImages[0]
const temp = ref([
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fbwc57i93rum21.jpg&f=1&nofb=1&ipt=6cd8c33a4e48d6262d33f9672b6305dff1c96c86a5514ffa9ab39d4216355d94&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fbwc57i93rum21.jpg&f=1&nofb=1&ipt=6cd8c33a4e48d6262d33f9672b6305dff1c96c86a5514ffa9ab39d4216355d94&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
])

const currentImage = ref(0)
// TODO: if we reach either end we need to loop around
// TODO: setup auto cycle on a timer
const nextImage = () => { 
    if(currentImage.value === temp.value.length - 1){
        currentImage.value = -1
    }
    currentImage.value++ 
}
const prevImage = () => {
    if(currentImage.value === 0){
        currentImage.value = temp.value.length
    }
    currentImage.value--
    }
    </script>

<template lang="pug">
// the header overlay with image and name
.mt-2.min-h-24.text-white.uppercase.w-full(style="background-image: url('https://carsonsvillage.org/wp-content/uploads/2018/11/iStock-862083112-BW.jpg');") 
  .h-full.py-8.self-center.w-full.text-center.flex.flex-col(style="background-color: rgba(50, 119, 136, .8)") 
    p.my-auto.font-bold.text-4xl {{ pageData.page_name }}

.flex.flex-col.gap-5.px-4.mx-auto.mt-8(class="w-3/4 sm:px-16")
  img.mx-auto(v-if="profileImageLink" class="w-[122px] h-[122px] rounded-[8px]" :src="`${profileImageLink}`")
  .text-gray-dark.mx-auto.w-max.font-poppins.text-md {{ dateFormat(pageData.day_of_birth, true) + ' - ' + dateFormat(pageData.day_of_passing, true) }} 
  .flex.flex-col-reverse.gap-5(class="sm:grid sm:grid-cols-2")
    .relative.h-96.w-96.border.border-2.border-grey.p-1(v-if="imageData.length != 0" )
      // TODO: icons instead of text, style to match existing page
      // to do: use object fit to place button accourding to image height
      button.absolute.left-4.top-16.bg-gray-500.text-white(@click="prevImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#60;
      button.absolute.right-8.top-16.bg-gray-500.text-white(@click="nextImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#62;
      img.h-96.w-96.object-fit(:src="imageData[currentImage].url")
    // services list
    .py-4.flex.flex-col.gap-5
      .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Services
      .flex.flex-col.gap-5(class="lg:grid lg:grid-cols-2")
        .flex.flex-col.gap-5(v-if="pageData.visitation_date")
          .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
          .flex.justify-between.gap-5
            .font-outfit {{ "Date:" }}
            .font-outfit {{ dateFormat(pageData.visitation_date, true) }}
          .flex.justify-between.gap-5
            .font-outfit {{ "Location:" }}
            .font-outfit.whitespace-normal {{ pageData.visitation_location }}
          .font-outfit {{ pageData.visitation_description }}
        .flex.flex-col.gap-5(v-if="pageData.funeral_date")
            .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
            .flex.justify-between.gap-5
              .font-outfit {{ "Date:" }}
              .font-outfit {{ dateFormat(pageData.funeral_date, true) }}
            .flex.justify-between.gap-5
              .font-outfit {{ "Location:" }}
              .font-outfit.whitespace-normal {{ pageData.funeral_location }}
            .font-outfit {{ pageData.funeral_description }}
//.container(class="sm:overflow-hidden sm:w-3/4 sm:mt-4 sm:mx-auto sm:place-content-center sm:max-w-xl sm:p-6 sm:rounded-card sm:shadow-card")
.grid(class="sm:grid-cols-2")
    .container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
        .text-md.text-center.ml-4.my-3(class="sm:text-xl sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{ donationFormat(pageData.amount_raised)  + " raised of " +  donationFormat(pageData.donation_goal) + " goal" }}
        .py-4
        .progress-bar.overflow-hidden.ml-4.h-5.rounded-full(style="30px; background-color:#b5b5b5;")
            CVProgress(v-if="donated_percentage >= 100" modelBarWidth="100") {{ donated_percentage  + "%" }}
            CVProgress(v-else-if="donated_percentage > 0 && donated_percentage < 100" :modelBarWidth="donated_percentage") {{ donated_percentage  + "%" }}
            CVProgress(v-else style="text-align:center;" modelBarWidth="0")  {{ donated_percentage   + "%" }}
        .well.well-sm
            h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donor Information
        DonationEntry(:donationData="donationData" :pageCuid="pageCuid" :familyCuid="familyCuid")
        
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
        .div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageData.obituary }}
    //.form-horizontal()
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
            ActionButton.mx-auto.text-md(name='submit' @click="create_checkout_session") DONATE NOW
//.div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageData.obituary }}
</template>
