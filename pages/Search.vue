<script lang="ts" setup>

/*
* Shalin Shrestha
*	ECS 2200
*	Carson's Village: Automated Family Page
*	Pages.vue 
* Allows users to search for a page(s) by name
*	Located under "/Search"
*/

import type { Page } from '@/types.d.ts'
import { donationFormat, dateFormat } from '@/utils'

const pages = ref<Page[]>([])
const router = useRoute();
// We use the search query from the url from nav based searches, and we use the input field when on the search page.
// to call /api/pages

const searchQueryInput = ref("");

// Method to populate search results for pages
const pageSearch = async( searchQuery: string) => { 
    const { data : pageData } = await useFetch('/api/pages', {
    method: 'GET',
    query: {searchQuery: searchQuery}    
    })
    pages.value = pageData.value as unknown as Page[]
}

// Calling the search method using the url from the nav when the user searches from the nav. This is only called once.
onMounted(() => {  
  pageSearch(router.query.search as string)    
  searchQueryInput.value = router.query.search as string
})
</script>

<template lang="pug">
.container.mx-auto
  h1(class = 'text-2xl indent-8 mt-2') Memorial Page Search
  
  br
  legend(class='text-m indent-8') Search memorial pages
  input(class="border border-gray-300 py-2 px-4 ml-8 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQueryInput")
  button(class='text-m bg-gray-300 p-2 mt-1 mb-2' @click='pageSearch(searchQueryInput)') SEARCH
  .container
  br
  b(class="ml-8 text-xl")     Search Results 
  table.table.table-striped(style="width:100%;")
      thead
        tr.bg-green-400.text-white
          th.px-8 Page 
          th.px-8 Donation Goal
          th.px-8 Deadline
      tbody
        tr(v-for="(page, i) in pages" :class="{'bg-gray-200': (i+1) % 2}")
          td(style="text-align: center")   
            NuxtLink(:to="`/Page/${page.cuid}`") {{ page.page_name}}
          td(style="text-align: center") {{ donationFormat(page.donation_goal) }}
          td(style="text-align: center") {{ dateFormat(page.deadline) }}
              
</template>

<style scoped>
</style>