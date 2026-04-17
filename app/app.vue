<template lang="pug">
div(class='flex gap-10 ml-4 mr-2')
  VerticalNav(class="hidden lg:block" v-if="session?.value")
  div(class='flex flex-col gap-5 min-h-screen grow')
    div(class="flex flex-col justify-center items-center")
      form(class='well well-sm')
        VerticalNavHamburger(class="lg:hidden" v-if="session?.value" :hamburgerOpen="hamburgerOpen")
    CVHeader(:hamburgerOpen="hamburgerOpen" @hamburger="hamburgerOpen = !hamburgerOpen")
    NuxtPage
CVFooter
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client';
const { data: session } = await authClient.useSession(useFetch);

const runtime = useRuntimeConfig()
const hamburgerOpen = ref(false)
</script>
