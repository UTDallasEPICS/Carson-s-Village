
<template lang="pug">
.flex.gap-10.ml-4.mr-2
  VerticalNav(v-if="cvCookie")
  .flex.flex-col.gap-5.min-h-screen.grow
    CVHeader
    NuxtPage
CVFooter
</template>

<script setup lang="ts">
const runtime = useRuntimeConfig()
const router = useRouter()
const routes = ref(router.getRoutes())
const route = useRoute()
const cvCookie = useCookie('cvtoken')
const cvuser = useCookie('cvuser')
const isSearch = computed(() => route.path == "/Search/")
const isFamilyPage = computed(() => route.path.includes("/Page/"))

if(!cvCookie.value && !isSearch.value && !isFamilyPage.value){
  await navigateTo('/Search/?search=')
}
</script>
