<template>
  <CVHeader/>
  <div
    class="flex items-stretch"
    :class="session ? 'min-h-[calc(100vh-100px)]' : 'ml-4 mr-2'"
  >
    <VerticalNav v-if="session" />
    <div
      class="flex min-w-0 flex-col gap-5 grow"
      :class="session ? 'mr-2' : ''"
    >
      <NuxtPage />
    </div>
  </div>
  <CVFooter />

  <div
    v-if="requireOnboarding && stripeOnboardingUrl && showStripeToast"
    class="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] max-w-sm rounded-lg border border-red-400/50 bg-red-50 px-4 py-3 text-gray-dark shadow-lg"
    role="status"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p class="font-poppins font-bold text-red-700">
            Stripe setup needed
          </p>
          <p class="mt-1 text-sm text-red-700">
            You need to set up Stripe.
            <a
              :href="stripeOnboardingUrl"
              class="underline font-bold"
            >Click here to continue</a>.
          </p>
        </div>
      </div>
      <button
        type="button"
        class="shrink-0 text-red-700 transition hover:text-orange-999 font-bold text-xl leading-none"
        aria-label="Dismiss"
        @click="showStripeToast = false"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const { data: session } = await authClient.useSession(useFetch)

const requireOnboarding = ref(false)
const showStripeToast = ref(true)
const stripeOnboardingUrl = ref('')

const { data: family, error: familyError } = await useFetch(() => `/api/family/${session.value?.user?.familyId}`, {
  method: 'GET',
  immediate: !!session.value?.user?.familyId
})

watchEffect(() => {
  if (!familyError.value && family.value?.acceptingDonations && !family.value?.stripe_account_id) {
    requireOnboarding.value = true
  } else {
    requireOnboarding.value = false
  }
})

watch(requireOnboarding, async (needed) => {
  if (!needed) {
    stripeOnboardingUrl.value = ''
    return
  }
  try {
    stripeOnboardingUrl.value = await $fetch<string>('/api/stripe/create_account')
  } catch (error) {
    console.error('Failed to fetch Stripe onboarding URL', error)
  }
}, { immediate: true })
</script>
