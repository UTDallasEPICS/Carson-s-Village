<script lang="ts" setup>

/*
* Shalin Shrestha
*	ECS 2200
*	Carson's Village: Automated Family Page
*	Pages.vue 
* Allows users to search for a page(s) by name
*	Located under "/Search"
*/

import type { Page, User } from '@/types.d.ts'
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

const currentPage = ref(0)
const lastPage = ref(0)
const pages = ref<Page[]>([])

const router = useRoute();
const cvuser = useCookie<User>("cvuser")
const toSearch = ref(false)
const isLoggedIn = computed(() => cvuser.value?.cuid != undefined)
// We use the search query from the url from nav based searches, and we use the input field when on the search page.
// to call /api/pages

//page sorting
const searchQueryInput = ref("");
const totalLength = ref(0)
const order = ref('')
const OrderField = ref('')
  
type paginated_results = {
  data: Page[]
  Pagination: {
    total: number
  }
  unsorted_data: Page[]
}

function SortCV(pages:any, OrderFields:string){
  OrderField.value = OrderFields as string
  if (order.value === ''){
    order.value = 'desc'
   } else if (order.value === 'desc') {
    order.value = 'asc'
   } else if (order.value === 'asc') {
    OrderField.value = ''
    order.value = ''
   }
   pageSearch(searchQueryInput.value)
}

// Method to populate search results for pages
const pageSearch = async(searchQuery: string) => { 
    const { data: pageData } = await useFetch<paginated_results>('/api/pages', {
    method: 'GET',
    query: {searchQuery: searchQuery, page_number: currentPage.value, isPageList: 0, sortedColumn:OrderField.value, order:order.value},
    watch: [currentPage]
})
    // api/pages returns both the pages 12 at a time and the length for upper bounds checking
    if(OrderField.value) {
      pages.value = pageData.value?.data as unknown as Page[]
    } else {
      pages.value = pageData.value?.unsorted_data as unknown as Page[]
    }
    totalLength.value = pageData.value?.Pagination.total as unknown as number
}

// Pagination control, move the page counter forwards and backwards and searches
const nextPage = () => { 
  console.log(totalLength.value / 12)
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
        pageSearch(searchQueryInput.value)
    } 
}
const prevPage = () => {
    if(currentPage.value != 0){
        currentPage.value--
        pageSearch(searchQueryInput.value)
    } 
}

// Calling the search method using the url from the nav when the user searches from the nav. This is only called once.
onMounted(() => { 
  if(isLoggedIn.value) { 
    pageSearch((router.query.search as string).trim())    
    searchQueryInput.value = (router.query.search as string).trim()
    console.log(searchQueryInput.value)
  }
})

const searchOnEnter = () => {
  currentPage.value = 0; // Reset current page to 0
  pageSearch(searchQueryInput.value); // Trigger search
}


</script>




<template lang="pug">
.container.mx-auto(v-if="isLoggedIn")
  h1(class = 'text-2xl indent-8 mt-2') Memorial Page Search
  
  br
  legend(class='text-m indent-8') Search memorial pages
  input(class="border border-gray-300 py-2 px-4 ml-8 rounded-lg focus:outline-none focus:border-black-500" 
  type="search" placeholder=" " v-model.trim="searchQueryInput" v-on:keyup.enter="searchOnEnter")
  button(class='text-m bg-gray-300 p-2 mt-1 mb-2' @click='currentPage=0; pageSearch(searchQueryInput)') SEARCH
  .container
  br
  b(class="ml-8 text-xl")     Search Results 
  table.table.table-striped(style="width:100%;")
      thead
        tr.text-white
          th.px-8(style="background-color: #5aadc2; border-radius: 60px 0px 0px 0px; align-items: center; justify-content: center; width: 33.33%")
            button(@click="SortCV(pages, 'page_last_name')") Page &nbsp;
            span(v-if="order === 'asc' && OrderField==='page_last_name'" style="padding-right:3px; padding-top: 3px;")
              ChevronUpIcon.h-6.inline-flex
            span(v-else-if="order === 'desc' && OrderField==='page_last_name'" style="padding-right:3px; padding-top: 3px;")
              ChevronDownIcon.h-6.inline-flex
            span(v-else style="padding-right:3px; padding-top: 3px;")
              ChevronUpDownIcon.h-6.inline-flex
          th.px-8(style="background-color: #5aadc2; justify-content: center; width: 33.33%")
            button(@click="SortCV(pages, 'donation_goal')") Donation Goal &nbsp;
            span(v-if="order === 'asc' && OrderField==='donation_goal'" style="padding-right:3px; padding-top: 3px;")
              ChevronUpIcon.h-6.inline-flex
            span(v-else-if="order === 'desc' && OrderField==='donation_goal'" style="padding-right:3px; padding-top: 3px;")
              ChevronDownIcon.h-6.inline-flex
            span(v-else style="padding-right:3px; padding-top: 3px;")
              ChevronUpDownIcon.h-6.inline-flex
          th.px-8(style="background-color: #5aadc2; border-radius: 0px 60px 0px 0px; justify-content: center; width: 33.33%")
            button(@click="SortCV(pages, 'deadline')") Deadline &nbsp;
            span(v-if="order === 'asc' && OrderField==='deadline'" style="padding-right:3px; padding-top: 3px;")
              ChevronUpIcon.h-6.inline-flex
            span(v-else-if="order === 'desc' && OrderField==='deadline'" style="padding-right:3px; padding-top: 3px;")
              ChevronDownIcon.h-6.inline-flex
            span(v-else style="padding-right:3px; padding-top: 3px;")
              ChevronUpDownIcon.h-6.inline-flex
      tbody
        tr(v-for="(page, i) in pages" :class="{'bg-gray-200': (i+1) % 2}")
          td(style="text-align: center")   
            NuxtLink(:to="`/Page/${page.cuid}`") {{ page.page_first_name + " " + page.page_last_name }}
          td(style="text-align: center") {{ donationFormat(page.donation_goal) }}
          td(style="text-align: center") {{ dateFormat(page.deadline) }}
  .ml-9.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
    .col-md-10.px-2.mt-2
        button(@click="prevPage") &lt
    .col-md-10.px-2.mt-2
        p {{  currentPage + 1 }}
    .col-md-10.px-2.mt-2
        button(@click="nextPage") >
p(v-else style="text-align: center") Welcome and thank you for supporting one of the families in our Village.
</template>

<style scoped>
</style>