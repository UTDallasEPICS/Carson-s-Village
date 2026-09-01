<template>
  <div class="flex gap-10 ml-4 mr-2">
    <VerticalNav
      v-if="session"
      class="hidden lg:block"
      :requireOnboarding="requireOnboarding"
    />
    <div class="flex flex-col gap-5 min-h-screen grow">
      <CVHeader/>
      <NuxtPage />
    </div>
  </div>
  <CVFooter />
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client';
const { data: session } = await authClient.useSession(useFetch);

// Flag users that need stripe onboarding
const requireOnboarding = ref(false)
const { data: family, error: familyError } = await useFetch(() => `/api/family/${session.value?.user?.familyId}`, {
  method: 'GET',
  immediate: !!session.value?.user?.familyId 
});

// We need a watchEffect (or computed) here because 'family' might not be populated immediately 
// if the fetch is delayed or reactive.
watchEffect(() => {
  if (!familyError.value && family.value?.acceptingDonations && !family.value?.stripe_account_id) {
    requireOnboarding.value = true;
  } else {
    requireOnboarding.value = false;
  }
});
</script>
