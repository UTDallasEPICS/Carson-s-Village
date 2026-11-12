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
const showDonationSuccessNote = computed(() => router.query.donation === 'success')
const dismissDonationSuccessNote = () => navigateTo({ path: router.path, query: {} }, { replace: true })

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
const donation_goal_provided = computed(() => (pageDataDB.value?.donation_goal as number) > 0)
const donated_percentage = computed(() => {
  const goal = pageDataDB.value?.donation_goal as number
  const raised = pageDataDB.value?.amount_raised as number
  if (!goal || goal <= 0) {
    return 0
  }
  return Number(((raised / goal) * 100).toFixed(1))
})
const comments = computed(() => pageDataDB.value?.PageDonations)
const hasDonationDescription = computed(() => Boolean(pageDataDB.value?.donation_description?.trim()))
const imageData = computed(() => pageDataDB.value?.Images || [])
const profileImage = computed(() => imageData.value?.find((image: Image) => 
  image.id === pageDataDB.value?.profileImageCuid
))

// Fetch replies separately so they can be refreshed easily
const { data: replies, refresh: replyRefresh, error: replyFetchError} = useFetch(`/api/reply/${pageId.value}`, {
  method: 'GET',
  default: () => []
})

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

const exitCommentPopup = () => {
  commentModalOpen.value = false
}
const openCommentPopup = (comment: string) => {
  commentModalOpen.value = !commentModalOpen.value; 
  currentComment.value = comment;
}
</script>

<template>
  <DonationEntryPopup
    v-model:displayDonationPopup="displayDonationPopup"
    :amount_raised="pageDataDB?.amount_raised"
    :donation_goal="pageDataDB?.donation_goal"
    :donation_goal_provided="donation_goal_provided"
    :donated_percentage="donated_percentage"
    :is-active="isActive"
    :page-cuid="pageId"
    :family-cuid="familyCuid"
  />
  <div
    v-if="commentModalOpen"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/70 p-4"
    @click.self="commentModalOpen=false"
  >
    <div class="mx-auto flex max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-white p-2 sm:p-4">
      <CommentPopup
        :comment="currentComment"
        @ExitComment="exitCommentPopup"
      />
    </div>
  </div>

  <!-- Archive button -->
  <div
    v-if="isAdminAdvocate || isFamilyMember"
    class="flex justify-center px-4 pt-2"
  >
    <button
      type="button"
      class="mt-1 h-[50px] rounded-[100px] bg-orange-999 px-6 pt-3 pb-3 font-bold text-white transition duration-300 hover:bg-green-600 sm:px-9"
      @click.prevent="handleArchive()"
    >
      {{ isActive ? "Archive" : "Reactivate" }}
    </button>
  </div>

  <!-- the header overlay with image and name -->
  <div
    class="mt-2 min-h-24 w-full bg-cover bg-center text-white uppercase"
    style="background-image: url('https://carsonsvillage.org/wp-content/uploads/2018/11/iStock-862083112-BW.jpg');"
  >
    <div class="flex h-full w-full flex-col self-center bg-teal-500/80 px-4 py-6 text-center sm:py-8">
      <p class="my-auto font-bold text-3xl break-words sm:text-4xl lg:text-5xl">
        {{ pageDataDB?.page_first_name + " " + pageDataDB?.page_last_name }}
      </p>
    </div>
  </div>
  <div
    v-if="showDonationSuccessNote"
    class="fixed bottom-4 left-4 right-4 z-50 w-auto max-w-sm rounded-lg border border-teal-500/40 bg-teal-50 px-4 py-3 text-gray-dark shadow-lg sm:left-auto sm:w-[min(24rem,calc(100vw-2rem))]"
    role="status"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="font-poppins font-bold text-teal-700">
          Thank you for your donation!
        </p>
        <p class="mt-1 font-outfit text-sm">
          Your donation is being processed and may take a couple days to appear on this page. You do not need to donate again.
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 text-teal-700 transition hover:text-orange-999 font-bold text-xl leading-none"
        aria-label="Dismiss"
        @click="dismissDonationSuccessNote"
      >
        ×
      </button>
    </div>
  </div>
  <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-5">
      <img
        v-if="profileImage?.url"
        :src="`${profileImage?.url}`"
        class="h-[122px] w-[122px] rounded-[8px] object-cover"
      >
      <div class="text-gray-dark text-center font-poppins text-md break-words">
        {{ (pageDataDB?.day_of_birth && pageDataDB?.day_of_passing) ? dateFormat(pageDataDB?.day_of_birth, true) + ' - ' + dateFormat(pageDataDB?.day_of_passing, true) : '' }}
      </div>
    </div>
    <!-- Row: scrolling images | donations -->
    <div
      class="grid grid-cols-1 gap-6 pt-5"
      :class="hasDonationDescription ? 'md:grid-cols-2 md:items-start' : ''"
    >
      <div
        class="min-w-0 w-full"
        :class="hasDonationDescription ? '' : 'mx-auto max-w-xl'"
      >
        <ImageCarousel
          v-if="imageData.length > 0"
          :images="imageData"
        />
      </div>
      <div
        v-if="pageDataDB?.Family?.acceptingDonations && hasDonationDescription"
        class="min-w-0"
      >
        <div class="flex flex-col pb-5">
          <div class="text-gray-dark pb-2 text-left font-poppins text-2xl font-bold leading-tight text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] sm:text-3xl sm:leading-9">
            Donations
          </div>
          <div
            v-if="pageDataDB?.donation_description"
            class="flex min-w-0 flex-col gap-1"
          >
            <div class="min-w-0 font-outfit break-words whitespace-normal">
              {{ pageDataDB.donation_description }}
            </div>
          </div>
          <div class="text-gray-dark text-left font-poppins text-1xl font-bold leading-9 text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]">
            <div class="flex items-center justify-center pt-9">
              <ActionButton
                text="DONATE NOW"
                name="submit"
                class="mx-auto w-full text-md transition duration-300 bg-orange-999 hover:bg-green-600 sm:w-auto"
                @click="displayDonationPopup=true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row: visitation | funeral -->
    <div class="grid grid-cols-1 gap-6 pt-5 md:grid-cols-2 md:gap-8">
      <div class="min-w-0">
        <div
          v-if="pageDataDB?.visitation_date"
          class="flex flex-col pb-5"
        >
          <div class="text-gray-dark text-center font-poppins text-2xl font-bold leading-tight text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] sm:text-3xl sm:leading-10">
            Visitation
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1 pt-2">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Date:" }}
            </div>
            <div class="font-outfit min-w-0 break-words">
              {{ longDateFormat(pageDataDB?.visitation_date) }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Time:" }}
            </div>
            <div class="font-outfit min-w-0 break-words">
              {{ longDateFormat(pageDataDB?.visitation_date, true) }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Location:" }}
            </div>
            <div class="font-outfit min-w-0 break-words whitespace-normal">
              {{ pageDataDB?.visitation_location || "TBD" }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit min-w-0 break-words">
              {{ pageDataDB?.visitation_address }}
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <div class="font-outfit">
              <b>Description:</b> {{ pageDataDB?.visitation_description ? '' : 'No Description' }}
            </div>
            <div v-if="pageDataDB?.visitation_description" class="font-outfit min-w-0 break-words whitespace-normal">
              {{ pageDataDB?.visitation_description }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col pb-5"
        >
          <div class="text-gray-dark pb-2 text-left font-poppins text-2xl font-bold leading-tight text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] sm:text-3xl sm:leading-9">
            Visitation
          </div>
          <div class="font-outfit break-words">
            {{ "There is no visitation information available at this time." }}
          </div>
        </div>
      </div>
      <div class="min-w-0">
        <div
          v-if="pageDataDB?.funeral_date"
          class="flex flex-col pb-5"
        >
          <div class="text-gray-dark pb-2 text-center font-poppins text-2xl font-bold leading-tight text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] sm:text-3xl sm:leading-9">
            Funeral Service
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Date:" }}
            </div>
            <div class="font-outfit min-w-0 break-words">
              {{ longDateFormat(pageDataDB?.funeral_date) }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Time:" }}
            </div>
            <div class="font-outfit min-w-0 break-words">
              {{ longDateFormat(pageDataDB?.funeral_date, true) }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit shrink-0 font-bold">
              {{ "Location:" }}
            </div>
            <div class="font-outfit min-w-0 break-words whitespace-normal">
              {{ pageDataDB?.funeral_location || 'TBD' }}
            </div>
          </div>
          <div class="flex flex-wrap gap-x-2 gap-y-1">
            <div class="font-outfit min-w-0 break-words whitespace-normal">
              {{ pageDataDB?.funeral_address }}
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <div class="font-outfit">
              <b>Description: </b>{{ pageDataDB?.funeral_description ? '' : 'No Description' }}
            </div>
            <div v-if="pageDataDB?.funeral_description" class="font-outfit min-w-0 break-words">
              {{ pageDataDB?.funeral_description }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col pb-5"
        >
          <div class="text-gray-dark font-poppins text-2xl font-bold leading-tight text-shadow-[3px_3px_4px_rgba(0,0,0,0.25)] sm:text-3xl sm:leading-9">
            Funeral Service
          </div>
          <div class="font-outfit break-words">
            {{ "There is no funeral information avilable at this time" }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageDataDB?.obituary" class="mt-6">
      <div
        id="obituary"
        class="mx-auto w-full max-w-4xl py-4 text-left text-base leading-7 font-medium tracking-[-0.078px] break-words text-[#6E6E6E] sm:text-lg"
      >
        {{ pageDataDB?.obituary }}
      </div>
    </div>
    <div
      v-if="pageDataDB?.Family?.acceptingDonations && !hasDonationDescription"
      class="flex justify-center px-4 pt-2 pb-5"
    >
      <ActionButton
        text="DONATE NOW"
        name="submit"
        class="mx-auto w-full text-md transition duration-300 bg-orange-999 hover:bg-green-600 sm:w-auto"
        @click="displayDonationPopup=true"
      />
    </div>
  </div>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-left sm:px-6 lg:px-8">
    <div
      v-if="comments?.length"
      class="grid w-full grid-cols-1 gap-4 py-4 md:grid-cols-2"
    >
      <div
        v-for="(comment, i) in comments"
        :key="i"
        class="flex h-full min-w-0 w-full flex-col gap-4 rounded-lg border-border-gray-300 bg-white p-4 shadow-md transition duration-300 hover:shadow-xl"
      >
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div class="min-w-0 text-lg font-bold break-words sm:text-xl">
            {{ comment.donorFirstName }} {{ comment.donorLastName }}
          </div>
          <div class="shrink-0 text-base font-bold sm:text-xl">
            {{ dateFormat(comment.donationDate, true) }}
          </div>
        </div>
        <div
          class="w-full min-w-0 grow text-base break-words text-gray-600 sm:text-xl"
          :class="{'border-l-2 border-green-500 pl-3': comment.comments.length}"
        >
          {{ comment.comments.length > 200 ? (comment.comments.substring(0, 200) + " ...") : comment.comments.substring(0, 200) }}
          <span
            v-if="comment.comments.length > 200"
            class="w-fit cursor-pointer text-base text-green-400 sm:text-xl"
            @click="openCommentPopup(comment.comments)"
          >{{ " Read More" }}</span>
        </div>
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div class="text-base font-bold sm:text-xl">
            Amount Donated
          </div>
          <div class="text-base font-bold text-green-600 sm:text-xl">
            {{ donationFormat(comment.amount) }}
          </div>
        </div>
      </div>
    </div>
    <CVReplySystem
      :page-cuid="pageId"
      :family-cuid="familyCuid"
      :replies="replies"
      :is-active="isActive"
      @displayReply="replyRefresh"
    />
    <div
      v-if="replies?.length"
      class="py-4 grid row-span-3 gap-2"
    >
      <div
        v-for="(reply,i) in replies.filter(item => !item.suspended)"
        :key="i"
        class="p-2 bg-white rounded-lg mb-2 shadow-md pb-4"
      >
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div class="ml-1 min-w-0 text-lg font-bold break-words">
            {{ reply.name }}
          </div>
          <div class="ml-1 shrink-0 text-base sm:text-lg">
            {{ dateFormat(reply.date) }}
          </div>
        </div>
        <div class="ml-1 border-l-2 border-green-500 pt-3 pb-3 pl-5 break-words">
          {{ reply.reply }}
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center font-bold text-gray-500 sm:flex-row sm:gap-2">
    <label>SHARE THIS PAGE</label>
    <div class="flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Share on Facebook"
        @click="shareFacebook"
      >
        <img
          src="/facebook-fa.png"
          class="h-[33px] w-[30px]"
        >
      </button>
      <button
        type="button"
        aria-label="Share on X"
        @click="shareXFormerlyKnownAsTwitter"
      >
        <img
          src="/twitter_fa.png"
          class="h-[29px] w-[30px]"
        >
      </button>
      <button
        type="button"
        aria-label="Share by email"
        @click="shareMail"
      >
        <img
          src="/mail_fa.png"
          class="h-[29px] w-[50px]"
        >
      </button>
    </div>
  </div>
</template>
