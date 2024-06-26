<script setup lang="ts">

/*
* Namra Zubair
*	EPCS 2200
*	Carson's Village: Automated Family Page
*	PageList.vue 
*	Displays a family page and allows for donation processing
*	Located under "/Page/"
*/


import type { User, Page, PageDonation, Image, Reply, Family} from '@/types.d.ts'
import {  dateFormat, donationFormat } from '@/utils'
import CVReplySystem from '@/components/CVReplySystem.vue'
import CVReply from '@/components/CVReply.vue'


const pageData = ref<Page>({
    cuid: "",
    userCuid: "",
    familyCuid: "",
    page_first_name: "",
    page_last_name: "",
    day_of_birth: null,
    day_of_passing: null,
    visitation_date: null,

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
    status: "active",
    donation_status: "in progress",
    duration: "",
    start_date: null,
    goal_met_date: null,
    last_donation_date: null,
    PageDonations: [],
    Reply: [],
    Family: {
      cuid: "",
      family_name: "",
      stripe_account_id: "",
      created_at: null,
      updated_at: null,
      FamilyMembers: [],
      FamilyDonationPayouts: [],
      Pages: [],
      AdvocateResponsible: {
          cuid: '',
          first_name: '',
          last_name: '',
          user_role: '',
          email: '',
          middle_name: '',
          phone: '',
          address: '',
          Pages: [],
          familyCuid: ''
      },
      FamilyDonations: [],
      advocateCuid: ""
    } 
});

const donationData = ref<PageDonation>({
    amount: 5,
    success: false,
    userCuid: "",
    cuid: "",
    pageCuid: "",
    familyCuid: "",
    transaction_id : "",
    donorFirstName: "",
    donorLastName: "",
    comments: "", 
    isAnonymous : false,
    donationDate: "",
    Page: ref<Page[]>([]).value[0]
});

const feeRecovery = ref(false)
const userCuid = ref("0")
const DisplayDonationPopup = ref(false)
const profileImageLink = ref("")
const family_cuid = ref("0")
const router = useRoute();
const id = computed(() => router.params.id);
const pageCuid = id.value as string
const cvuser = useCookie<Page>('cvuser')
const stripeLink_ref = ref("")
// const isAdvocateAdmin = computed(() => cvuser.value?.user_role == "admin" || cvuser.value?.user_role == "advocate")


/* 
*  This creates a stripe session and redirects the user to stripe.
*  Then it redirects to /PageDonation/pageCuid/transactionId
*/
const create_checkout_session = async () => {
    if(feeRecovery.value) {
      donationData.value.amount = 1.035 * donationData.value.amount
    }
    

    const sessionInfo = await $fetch('/api/create_session', {
        method: 'POST',
      body: {
        ...donationData,
        cuid: id.value,
        pageCuid: id.value,
        familyCuid: pageDataDB.value?.familyCuid,
        amount_raised: Math.trunc(parseFloat(donationData.value.amount as unknown as string) * 100) as number
      }
    });
    stripeLink_ref.value = sessionInfo as string
    await navigateTo(stripeLink_ref.value as string,  { external: true } )
};

// Method to populate the page with data based on the cuid in the url
const { data : pageDataDB } = await useFetch<Page>('/api/page', {
    method: 'GET',
    query: { cuid: id }
})

if(pageDataDB.value){
    pageData.value = pageDataDB.value as unknown as Page;
    userCuid.value = pageData.value.userCuid
    //familyCuid = family_cuid.value as string
    //familyCuid.value = pageDataDB.value.familyCuid as string
  }

const isActive = computed(() => pageDataDB.value?.status == "active")

// todo: Set as pop up?
const shareFacebook = () => {
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?caption=${pageDataDB.value?.page_first_name}${pageDataDB.value?.page_last_name}&u=${window.location.href}`
  window.open(facebookShareLink)
}

const shareXFormerlyKnownAsTwitter = () => {
  const xShareLink = `https://twitter.com/intent/tweet?text=${pageDataDB.value?.page_first_name}${pageDataDB.value?.page_last_name}&url=${window.location.href}`
  window.open(xShareLink)
}

const shareMail = () => {
  const MailShareLink = `mailto:?subject=Site%20sharing&body=Please%20check%20this%20site%20out%20${window.location.href}`
  window.open(MailShareLink)
}

const familyCuid = computed(() => pageDataDB.value?.familyCuid)
const donated_percentage = computed(() => (((pageDataDB.value?.amount_raised as number) / (pageDataDB.value?.donation_goal as number )) * 100).toFixed(1) + "");
const donation_goal_provided = computed(() => pageDataDB.value?.donation_goal as number > 0)
const comments = computed(() => pageDataDB.value?.PageDonations)
const replies = computed(() => pageDataDB.value?.Reply)
const imageData = computed(() => pageDataDB.value?.Images || [])
const profileImage = computed(() => imageData.value?.find((image: Image) => 
          image.cuid === pageDataDB.value?.profileImageCuid
      ))

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
    if(currentImage.value === imageData.value?.length - 1){
        currentImage.value = 0
    } else {
        currentImage.value++
    } 
}
const prevImage = () => {
    if(currentImage.value === 0){
        currentImage.value = imageData.value?.length - 1
    } else {
        currentImage.value--
    }
}

// Recursively moves to the next image every 5 seconds
const setImageAutoSlide = () => {
  nextImage()
  setTimeout(setImageAutoSlide, 5000)
}

// Recieves emitted reply from CVReplies System to update replies in real time
const displayReply = async (reply: Reply) => {
    pageDataDB.value?.Reply.push(reply)
}

// Recieves the emit to stop displaying the donation popup from the button within the component donationEntryPoppup
const exitPopup = async(exit: boolean) => {
  DisplayDonationPopup.value = false
}

console.log(pageDataDB.value?.visitation_description)
console.log(pageDataDB.value?.funeral_date)

setImageAutoSlide()
</script>

<template lang="pug">
// donation popup
.div.flex(@click.self="DisplayDonationPopup=false" v-if="DisplayDonationPopup" style="z-index: 10; align-items: center; justify-content: center; position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7);")
  .mx-auto.flex.p-2(style="width:50%; background-color:#fff;")
    DonationEntryPopup(@Exit="exitPopup" :amount_raised="pageDataDB.amount_raised" :donation_goal="pageDataDB.donation_goal" :donation_goal_provided="donation_goal_provided" :donated_percentage="donated_percentage" :isActive="isActive" :donationData="donationData" :pageCuid="pageCuid" :familyCuid="familyCuid")  

// the header overlay with image and name

.flex.gap-2.justify-center.cols-2.pl-6.pr-6
    a.mr-2.mt-1.p-2.px-9.pt-3.pb-3.bg-orange-999(class="transition duration-300 bg-orange-999 hover:bg-green-600" style="border-radius: 100px; height: 50px; color: white; font-weight: 700;") Archive
.mt-2.min-h-24.text-white.uppercase.w-full(style="background-image: url('https://carsonsvillage.org/wp-content/uploads/2018/11/iStock-862083112-BW.jpg');") 
  .h-full.py-8.self-center.w-full.text-center.flex.flex-col(style="background-color: rgba(50, 119, 136, .8)") 
    p.my-auto.font-bold.text-4xl {{ pageDataDB.page_first_name + " " + pageDataDB.page_last_name }}

.flex.flex-col.gap-5.px-4.mx-auto.mt-8(class="w-3/4 sm:px-16")
  img.mx-auto(v-if="profileImage?.url" class="w-[122px] h-[122px] rounded-[8px]" :src="`${profileImage?.url}`")
  .text-gray-dark.mx-auto.w-max.font-poppins.text-md {{ dateFormat(pageDataDB.day_of_birth, true) + ((pageDataDB.day_of_birth || pageDataDB.day_of_passing) ? ' - ' : '') + dateFormat(pageDataDB.day_of_passing, true) }} 
  .flex.flex-col-reverse.gap-5(class="sm:grid sm:grid-cols-2")
    .relative.w-96.p-1(v-if="imageData.length != 0" )
      button.absolute.left-4.top-64.bg-black.text-white(@click="prevImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#60;
      button.absolute.right-8.top-64.bg-black.text-white(@click="nextImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#62;
      img.w-96(style="z-index: -1; object-fit:cover;" :src="imageData[currentImage].url")
    // services list
    .py-4.flex.flex-col.gap-5(style="font-size: 18px")
      .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Services
      .flex.flex-col.gap-5(class="lg:grid lg:grid-cols-2")
        .flex.flex-col.gap-5(v-if="pageDataDB.visitation_date")
          .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
          .flex.gap-5
            .font-outfit {{ "Date:" }}
            .font-outfit {{ dateFormat(pageDataDB.visitation_date, true) }}
          .flex.gap-5
            .font-outfit {{ "Location:" }}
            .font-outfit.whitespace-normal {{ pageDataDB.visitation_location ? pageDataDB.visitation_location : "TBD" }}
          .font-outfit {{ pageDataDB.visitation_description }}
        .flex.flex-col.gap-5(v-else)
          .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Visitation
          .flex.gap-5
            .font-outfit {{ "Date:  TBD"}}
          .flex.gap-5
            .font-outfit {{ "Location:  TBD" }}
        .flex.flex-col.gap-5(v-if="pageDataDB.funeral_date")
            .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
            .flex.gap-5
              .font-outfit {{ "Date:" }}
              .font-outfit {{ dateFormat(pageDataDB.funeral_date, true) }}
            .flex.gap-5
              .font-outfit {{ "Location:" }}
              .font-outfit.whitespace-normal {{ pageDataDB.funeral_location }}
            .font-outfit {{ pageDataDB.funeral_description }}
        .flex.flex-col.gap-5(v-else)
            .text-gray-dark.font-poppins.text-2xl.text-left.font-bold(style="line-height: 36px; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Funeral
            .flex.gap-5
              .font-outfit {{ "Date:  TBD" }}
            .flex.gap-5
              .font-outfit {{ "Location:  TBD" }}
//.container(class="sm:overflow-hidden sm:w-3/4 sm:mt-4 sm:mx-auto sm:place-content-center sm:max-w-xl sm:p-6 sm:rounded-card sm:shadow-card")
.grid(class="sm:grid-cols-2")
    .container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
        .well.well-sm
            h1.ml-4.pt-9.text-2xl.text-gray-dark(class="sm:text-3xl" style="font-weight: 600; letter-spacing: 0.35px;") Donations
        .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center
          ActionButton.mx-auto.text-md(name='submit' @click="DisplayDonationPopup=true" class="transition duration-300 bg-orange-999 hover:bg-green-600" ) DONATE NOW
        .py-4.grid.gap-1(v-if="comments?.length" style="text-align: center")
            .div.py-4.grid(class="w-full" style="grid-template-columns: repeat(3, 1fr);")
                .div(v-for="(comment, i) in comments" :key="i" class="comment-box")
                    .comment-box(style="flex: calc(30% - 1rem); height: 10rem; width: 11rem; margin: 0.5rem; padding: 1rem; border-radius: 8px; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.05);")
                        .div.comment-header(style="font-size: 0.75rem; font-weight: bold; margin-bottom: 1.5rem;") {{ comment.donorFirstName }} {{ comment.donorLastName }}
                        p.comment-body(style="font-size: 0.75rem; width: fit-content; color: #666;") {{ comment.comments }}
                        .div.comment-donation-amount(style="font-size: 0.75rem; color: #666;") Amount Donated: {{ donationFormat(comment.amount) }}
        CVReplySystem(:pageCuid="id" :familyCuid="familyCuid" :replies="replies" @displayReply="displayReply")
        .py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="replies?.length" style="line-height: 0px;text-align: center")
            div(class="flex")
            .div(v-for="(reply,i) in replies" :key="i" class="reply-box")
                .reply-box(v-if="reply.reply.length > 0" style="padding: 1rem; text-align: left; border-bottom: 1px solid black") 
                    .reply-header(style="font-size: 1rem; font-weight: bold; margin-bottom: 2.5rem; margin-left: 1rem") {{reply.name}}
                    .reply-body(style="font-size: 1rem; color: #666; margin-bottom: 2.5rem;") {{reply.reply}}
div.flex(style="color:gray; font-weight: 700; justify-content:center; align-items: center; height: 100px;")
  label SHARE THIS PAGE |&nbsp;
  .col
    button(@click="shareFacebook")
      img(src="/facebook-fa.png" style="width:30px; height:33px;") 
  .col
    button(@click="shareXFormerlyKnownAsTwitter")
        img(src="/twitter_fa.png" style="width:30px; height:29px;") 
  .col
    button(@click="shareMail")
        img(src="/mail_fa.png" style="width:50px; height:29px;") 
  .col
    p {{ "" }}
    .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
        .div.px-8.py-4(style="color: #6E6E6E; font-weight: 500; font-size: 18px; line-height: 28px; letter-spacing: -0.078px; word-break: break-word;" id="obituary") {{ pageDataDB.obituary }}
</template>
