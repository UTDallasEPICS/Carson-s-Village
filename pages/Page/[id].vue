<script setup lang="ts">

/*
*   Namra Zubair
*	ECS 2200
*	Carson's Village: Automated Family Page
*	PageList.vue 
*	Displays a family page and allows for donation processing
*	Located under "/Page/"
*/

import type { Page, PageDonation, Image, Reply} from '@/types.d.ts'
import {  dateFormat, donationFormat } from '@/utils'
import CVReplySystem from '@/components/CVReplySystem.vue'

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
    Images: [],
    PageDonations:[],
    Reply:[]
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
    transaction_id : "",
    donorFirstName: "",
    donorLastName: "",
    comments: "", 
    isAnonymous : false
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
// const Replies = ref<Reply[]>([]);
// const comments = ref<PageDonation[]>([])
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
//const getDataPage = async( id: string ) => { 
    const { data : pageDataDB } = await useFetch<Page>('/api/page', {
        method: 'GET',
        query: { cuid: id }
    })

    if(pageDataDB.value){
        //comments.value = pageDataDB.value as unknown as PageDonation[];
        //console.log(comments.value)
        pageData.value = pageDataDB.value as unknown as Page;
        donated_percentage.value = (((pageData.value.amount_raised as number) / (pageData.value.donation_goal as number )) * 100).toFixed(1) + "";
        family_cuid.value = pageData.value.familyCuid as string;
        familyCuid = family_cuid.value as string

        // Sets the front end images including the profile image
        if(pageData.value.Images?.length != 0)
            imageData.value = pageData.value.Images as unknown as Image[] 
            for(let i = 0; i < imageData.value?.length; i++){
                if(imageData.value[i].cuid === pageData.value.profileImageCuid){
                    profileImageLink.value = imageData.value[i].url
                    break;
                }
            }
    }
    const comments = computed(() => pageDataDB.value?.PageDonations)
    const replies = computed(() => pageDataDB.value?.Reply)
    
//}

//await getDataPage(id.value as string)


// images for testing if needed.
/*const temp = ref([
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fbwc57i93rum21.jpg&f=1&nofb=1&ipt=6cd8c33a4e48d6262d33f9672b6305dff1c96c86a5514ffa9ab39d4216355d94&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fbwc57i93rum21.jpg&f=1&nofb=1&ipt=6cd8c33a4e48d6262d33f9672b6305dff1c96c86a5514ffa9ab39d4216355d94&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
{url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61c8jg5GogL._AC_SS450_.jpg&f=1&nofb=1&ipt=3e12836a0e8c59555ce3cc5c3ba1941d4ebacfe86377cb3aee4ca65c81ac5cb0&ipo=images"},
])*/

const currentImage = ref(0)
// TODO: setup auto cycle on a timer
const nextImage = () => { 
    if(currentImage.value === imageData.value.length - 1){
        currentImage.value = 0
    } else {
        currentImage.value++
    } 
}
const prevImage = () => {
    if(currentImage.value === 0){
        currentImage.value = imageData.value.length -1
    } else {
        currentImage.value--
    }
    }
const DisplayReply = async (reply: Reply) => {
    pageDataDB.value?.Reply.push(reply)
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
    .relative.w-96.border.border-2.border-grey.p-1(v-if="imageData.length != 0" )
      button.absolute.left-4.top-64.bg-black.text-white(@click="prevImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#60;
      button.absolute.right-8.top-64.bg-black.text-white(@click="nextImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#62;
      img.w-96(style="object-fit:cover" :src="imageData[currentImage].url")
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
        .py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="comments?.length" style="line-height: 0px;text-align: center")
            .div.py-4.grid.gap-4(class="w-full" style="grid-template-columns: repeat(3, 1fr);")
                .div(v-for="(comment, i) in comments" :key="i" class="comment-box")
                    .comment-box(style="flex: calc(30% - 1rem); height: 10rem; width: 11rem; margin: 0.5rem; padding: 1rem; border-radius: 8px; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.05);")
                        .div.comment-header(style="font-size: 0.75rem; font-weight: bold; margin-bottom: 1.5rem;") {{ comment.donorFirstName }} {{ comment.donorLastName }}
                        .div.comment-body(style="font-size: 0.75rem; color: #666; border-left: 1px solid black;") {{ comment.comments }}
                        .div.comment-donation-amount(style="font-size: 0.75rem; color: #666; margin-top: 5rem;") Amount Donated ${{ comment.amount }}
        CVReplySystem(:pageCuid="pageCuid" :familyCuid="familyCuid" :replies="replies" @displayReply="DisplayReply")
        .py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="replies?.length" style="line-height: 0px;text-align: center")
            div(class="flex")
            .div(v-for="(reply,i) in replies" :key="i" class="reply-box")
                .reply-box(v-if="reply.reply.length > 0" style="padding: 1rem; text-align: left; border-bottom: 1px solid black") 
                    .reply-header(style="font-size: 1rem; font-weight: bold; margin-bottom: 2.5rem; margin-left: 1rem") {{reply.name}}
                    .reply-body(style="font-size: 1rem; color: #666; margin-bottom: 2.5rem;") {{reply.reply}}
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
        .div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 14px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageData.obituary }}
</template>
