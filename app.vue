
<template lang="pug">
.flex.gap-10.ml-4.mr-2
  VerticalNav(v-if="cvCookie && width > 900")
  .flex.flex-col.gap-5.min-h-screen.grow
    div(class="flex flex-col justify-center items-center")
      form.well.well-sm
        VerticalNavHamburger(v-if="cvCookie && width <= 900" :hamburgerOpen="hamburgerOpen")
    CVHeader(:hamburgerOpen="hamburgerOpen" @hamburger="hamburgerOpen = !hamburgerOpen")
    NuxtPage
CVFooter
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
const runtime = useRuntimeConfig()
const router = useRouter()
const routes = ref(router.getRoutes())
const hamburgerOpen = ref(false)
const route = useRoute()
const cvCookie = useCookie('cvtoken')
const cvuser = useCookie('cvuser')
const isSearch = computed(() => route.path == "/Search/")
const isFamilyPage = computed(() => route.path.includes("/Page/"))


if(!cvCookie.value && !isSearch.value && !isFamilyPage.value){
  await navigateTo('/Search/?search=')
}
</script>
