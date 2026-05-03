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
import { dateFormat, donationFormat } from '@/utils'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const displayDonationPopup = ref(false)
const router = useRoute();
const pageId = computed(() => router.params.id);
const commentModalOpen = ref(false)
const currentComment = ref('')

// Method to populate the page with data based on the cuid in the url
const { data : pageDataDB, refresh: pageRefresh } = await useFetch<Page>(`/api/page/${pageId.value}`, {
  method: 'GET'
})

const isAdminAdvocate = computed(() => user.value?.role === "admin" || pageDataDB.value?.Family.advocateCuid === user.value?.id);
const isFamilyMember = computed(() => user.value?.familyId === pageDataDB.value?.familyCuid)
const isActive = computed(() => pageDataDB.value?.status.toLowerCase() == "active")

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
const donated_percentage = computed<Number>(() => 
  (((pageDataDB.value?.amount_raised as number) / (pageDataDB.value?.donation_goal as number )) * 100).toFixed(1)
);
const donation_goal_provided = computed(() => pageDataDB.value?.donation_goal as number > 0)
const comments = computed(() => pageDataDB.value?.PageDonations)
const replies = computed(() => pageDataDB.value?.Reply)
const imageData = computed(() => pageDataDB.value?.Images || [])
const profileImage = computed(() => imageData.value?.find((image: Image) => 
  image.id === pageDataDB.value?.profileImageCuid
))

// Handles archiving of pages
async function handleArchive() {
  if (isActive.value && (isAdminAdvocate.value || isFamilyMember.value)) {
    const confirmation = confirm('Are you sure you want to deactivate this page?');
    if (confirmation) {
      try {
        await $fetch('/api/page', {
          method: "PUT",
          body: {
            id: pageId.value,
            userCuid: pageDataDB.value?.userCuid,
            familyCuid: pageDataDB.value?.familyCuid,
            status: 'inactive'
          }
        })
      } catch (err) {
        console.log(`Failed to deactivate page ${pageId.value}:`, err)
      }

      // Refetch page info after status change
      pageRefresh()
    }
  } 
  else if (!isActive.value && (isAdminAdvocate.value || isFamilyMember.value)) {
    const confirmation = confirm('Are you sure you want to reactivate this page?')
    if (confirmation) {
      try {
        await $fetch('/api/page', {
          method: "PUT",
          body: {
            id: pageId.value,
            userCuid: pageDataDB.value?.userCuid,
            familyCuid: pageDataDB.value?.familyCuid,
            status: 'active'
          }
        })
      } catch (err) {
        console.log(`Failed to reactivate page ${pageId.value}:`, err)
      }

      // Refetch page info after status change
      pageRefresh()
    }
  }
}

const currentImage = ref(0)
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

const previewImage = ref("")
const showPreview = (image: Image) => {
  previewImage.value = image.url
}

const closePreview = () => {
  previewImage.value = ''
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

const exitCommentPopup = () => {
  commentModalOpen.value = false
}
const openCommentPopup = (comment: string) => {
  commentModalOpen.value = !commentModalOpen.value; 
  currentComment.value = comment;
}

setImageAutoSlide()
</script>

<template lang="pug">
// donation popup
DonationEntryPopup(
  v-model:displayDonationPopup="displayDonationPopup"
  :amount_raised="pageDataDB?.amount_raised"
  :donation_goal="pageDataDB?.donation_goal" 
  :donation_goal_provided="donation_goal_provided"
  :donated_percentage="donated_percentage"
  :isActive="isActive"
  :pageCuid="pageId"
  :familyCuid="familyCuid"
)  

div(
  v-if="commentModalOpen"
  @click.self="commentModalOpen=false"
  class="flex items-center justify-center z-10 fixed top-0 bottom-0 left-0 right-0 bg-black/70"
)
  div(class="mx-auto flex p-2 bg-white w-1/2 h-1/2")
    CommentPopup(@ExitComment="exitCommentPopup" :comment="currentComment")  

// Archive button
div(
  v-if="isAdminAdvocate || isFamilyMember"
  class="flex gap-2 justify-center cols-2 pl-6 pr-6"
)
  button(
    type="button"
    class="mr-2 mt-1 p-2 px-9 pt-3 pb-3 bg-orange-999 transition duration-300 hover:bg-green-600 rounded-[100px] h-[50px] text-white font-bold"
    @click.prevent="handleArchive()"
  ) {{ isActive ? "Archive" : "Reactivate" }}

// the header overlay with image and name
div(class="mt-2 min-h-24 text-white uppercase w-full bg-cover bg-center" style="background-image: url('https://carsonsvillage.org/wp-content/uploads/2018/11/iStock-862083112-BW.jpg');") 
  div(class="h-full py-8 self-center w-full text-center flex flex-col bg-teal-500/80") 
    p(class="my-auto font-bold text-5xl") {{ pageDataDB?.page_first_name + " " + pageDataDB?.page_last_name }}

div(class="grid grid-cols-1 sm:grid-cols-2 justify-center px-2")
  div(class="col-span-2")
    div(class="flex flex-col gap-5 px-4 mx-auto mt-8 w-3/4 sm:px-16")
      img(v-if="profileImage?.url" :src="`${profileImage?.url}`" class="mx-auto w-[122px] h-[122px] rounded-[8px]")
      div(class="text-gray-dark mx-auto w-max font-poppins text-md") {{(pageDataDB?.day_of_birth && pageDataDB?.day_of_passing) ?  dateFormat(pageDataDB?.day_of_birth, true) + ' - ' + dateFormat(pageDataDB?.day_of_passing, true) : '' }} 
  div(class="col-span-1 justify-self-end pr-5 pt-5")
    div(v-if="imageData.length != 0" class="relative w-96 p-1")
      button(@click="prevImage" class="absolute left-4 top-64 bg-black text-white opacity-70 w-[46px] h-[46px] rounded-full items-center justify-center leading-loose text-center text-white") &#60;
      button(@click="nextImage" class="absolute right-8 top-64 bg-black text-white opacity-70 w-[46px] h-[46px] rounded-full items-center justify-center leading-loose text-center text-white") &#62;
      img(:src="imageData[currentImage].url" @click="showPreview(profileImage)" class="w-96 cursor-pointer z-[-1] object-cover")     
      div(v-if="previewImage" @click.self="closePreview" class="w-full h-full overflow-auto block fixed left-0 top-0 z-[1000] bg-black/80")
        img(v-for="(image, index) in imageData" :key="index" :src="image.url" class="py-2 block max-w-[80%] max-h-[80%] m-auto")
        span(@click="closePreview" class="absolute cursor-pointer top-[15px] right-[35px] text-[30px] transition duration-300 text-gray-400 hover:text-white focus:text-white cursor-pointer") &times;
  // services list
  div(class="col-span-1 sm:grid-cols-2 pt-5 pl-5 pr-15")
        div(v-if="pageDataDB?.visitation_date" class="flex flex-col pb-5 pr-15")
          div(class="text-gray-dark font-poppins text-3xl text-left font-bold leading-10 justify-start text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Visitation
          div(class="flex row gap-2 pt-2")
            div(class="font-outfit flex-col font-bold") {{ "Date:" }}
            div(class="font-outfit") {{ longDateFormat(pageDataDB?.visitation_date) }}
          div(class="flex row gap-2")
            div(class="font-outfit font-bold") {{ "Time:" }}
            div(class="font-outfit gap-y-5") {{ longDateFormat(pageDataDB?.visitation_date, true) }}
          div(class="flex row gap-2")
            div(class="font-outfit font-bold") {{ "Location:" }}
            div(class="font-outfit whitespace-normal") {{ pageDataDB?.visitation_location ? pageDataDB?.visitation_location : "TBD" }}
          div(class="flex row gap-2")
            div(class="font-outfit gap-y-5") {{ pageDataDB?.visitation_address }}
          div(class="flex row gap-2 pr-10") 
            div(class="font-outfit font-bold") {{ "Description:" }}
            div(class="font-outfit whitespace-normal") {{ pageDataDB?.visitation_description }}
            
        div(v-else class="flex flex-col pb-5 pr-15")
          div(class="text-gray-dark font-poppins text-3xl text-left font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Visitation
          div(class="flex row gap-2")
            div(class="font-outfit") {{ "There is no visitation information available at this time." }}
        div(v-if="pageDataDB?.funeral_date" class="flex flex-col pb-5 pr-15")
            div(class="text-gray-dark font-poppins text-3xl text-left font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Funeral Service
            div(class="flex row gap-2")
              div(class="font-outfit font-bold") {{ "Date:" }}
              div(class="font-outfit gap-2") {{ longDateFormat(pageDataDB?.funeral_date) }}
            div(class="flex row gap-2")
              div(class="font-outfit font-bold") {{ "Time:" }}
              div(class="font-outfit gap-y-5") {{ longDateFormat(pageDataDB?.funeral_date, true) }}
            div(class="flex row gap-2")
              div(class="font-outfit font-bold") {{ "Location:" }}
              div(class="font-outfit whitespace-normal") {{ pageDataDB?.funeral_location }}
            div(class="flex row gap-2")
              div(class="font-outfit whitespace-normal") {{ pageDataDB?.funeral_address }}
            div(class="flex row gap-2 pr-10") 
              div(class="font-outfit font-bold") {{ "Description:" }}
              div(class="font-outfit") {{ pageDataDB?.funeral_description }}

        div(v-else class="flex flex-col pb-5")
            div(class="text-gray-dark font-poppins text-3xl text-left font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Funeral Service
            div(class="flex row gap-2")
              div(class="font-outfit gap-y-5") {{ "There is no funeral information avilable at this time" }}
        div(class="flex flex-col pb-5")
          div(class="text-gray-dark font-poppins text-3xl text-left font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Donations
          div(class="text-gray-dark font-poppins text-1xl text-left font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") 
            div(class="ml-1 pt-9 pr-5 flex items-center justify-center")
              ActionButton(name='submit' @click="displayDonationPopup=true" class="mx-auto text-md transition duration-300 bg-orange-999 hover:bg-green-600") DONATE NOW
  div(class="col-span-2")
    div(class="mx-9 sm:col-span-1 sm:mr-11")
        div(id="obituary" class="px-10 py-4 text-[#6E6E6E] font-medium text-lg leading-7 tracking-[-0.078px] break-words") {{ pageDataDB?.obituary }}

div(class="py-4 grid gap-1 text-left")
  div(v-if="comments?.length" class="py-4 grid gap-4 w-full justify-center grid-cols-[repeat(3,30rem)]")
      div(v-for="(comment, i) in comments" :key="i" class="flex flex-col gap-4 h-full min-w-44 p-4 rounded-lg bg-white border-border-gray-300 shadow-md py-4 transition duration-300 hover:shadow-xl")
        div(class="flex justify-between gap-5")
          div(class="text-xl font-bold") {{ comment.donorFirstName }} {{ comment.donorLastName }}
          div(class="text-xl font-bold") {{ dateFormat(comment.donationDate, true) }}
        div(class="text-xl grow w-fit text-gray-600" :class="{'border-l-2 border-green-500 pl-3': comment.comments.length}") {{ comment.comments.length > 200 ? (comment.comments.substring(0, 200) + " ...") :  comment.comments.substring(0, 200) }}
          span(v-if="comment.comments.length > 200" @click="openCommentPopup(comment.comments)" class="text-xl w-fit text-green-400 cursor-pointer") {{ " Read More" }}
        div(class="flex justify-between gap-5")
          div(class="text-xl font-bold") Amount Donated
          div(class="text-xl font-bold text-green-600") {{ donationFormat(comment.amount) }}
  CVReplySystem(:pageCuid="pageId" :familyCuid="familyCuid" :replies="replies" @displayReply="displayReply")
  div(v-if="replies?.length" class="py-4 grid row-span-3 gap-2")
    div(v-for="(reply,i) in replies.filter(item => !item.suspended)" :key="i" class="p-2 bg-white rounded-lg mb-2 shadow-md pb-4") 
      div(class="flex justify-between gap-5 pd-4")
        div(class="ml-1 text-lg font-bold") {{reply.name}}
        div(class="ml-1 text-lg") {{ dateFormat(reply.date) }}
      div(class="ml-1 pt-3 pb-3 pl-5 border-l-2 border-green-500") {{reply.reply}}
div(class="flex text-gray-500 font-bold justify-center items-center h-[100px]")
  label SHARE THIS PAGE |&nbsp;
  div
    button(@click="shareFacebook")
      img(src="/facebook-fa.png" class="w-[30px] h-[33px]") 
  div
    button(@click="shareXFormerlyKnownAsTwitter")
        img(src="/twitter_fa.png" class="w-[30px] h-[29px]") 
  div
    button(@click="shareMail")
        img(src="/mail_fa.png" class="w-[50px] h-[29px]") 
  div
    p {{ "" }}
</template>
