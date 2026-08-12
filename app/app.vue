<template>
  <div class="flex gap-10 ml-4 mr-2">
    <VerticalNav
      v-if="session"
      class="hidden lg:block"
    />
    <div class="flex flex-col gap-5 min-h-screen grow">
      <div class="flex flex-col justify-center items-center">
        <form class="well well-sm">
          <VerticalNavHamburger
            v-if="session"
            class="lg:hidden"
            :hamburger-open="hamburgerOpen"
          />
        </form>
      </div>
      <CVHeader
        :hamburger-open="hamburgerOpen"
        @hamburger="hamburgerOpen = !hamburgerOpen"
      />
      <NuxtPage />
    </div>
  </div>
  <CVFooter />
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client';
const { data: session } = await authClient.useSession(useFetch);

const runtime = useRuntimeConfig()
const hamburgerOpen = ref(false)
</script>
