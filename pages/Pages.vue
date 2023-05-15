<script lang="ts" setup>

/*
* Shalin Shrestha
*	ECS 2200
*	Carson's Village: Automated Family Page
*	pages.vue 
* Allows users to search for a page by name
*	Located under "/"
*/

type Page = {
    page_name: string,
    cuid : string,
    day_of_birth: Date,
    day_of_passing: Date,
    visitation_date: Date,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date,
    funeral_description: string,
    funeral_location: string,
    obituary: string,
    deadline: Date,
    donation_goal: number,
    amount_raised: number
}

const pages = ref<Page[]>([])
const searchQuery = ref('');

const pageSearch = async() => { 
    const { data : pageData } = await useFetch('/api/pages', {
    method: 'GET',
    query: {searchQuery: searchQuery.value}    
    })
    pages.value = pageData.value as unknown as Page[]
}

const dateFormat = function (date: string){
  var dateObj = new Date(date);
  return dateObj.toString();
}
</script>

<template lang="pug">
.container.mx-auto
  h1(class = 'text-2xl indent-8 mt-2') Memorial Page Search
  
  br
  legend(class='text-m indent-8') Search memorial pages
  input(class="border border-gray-300 py-2 px-4 ml-8 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="searchQuery")
  button(class='text-m bg-gray-300 p-2 mt-1 mb-2' @click='pageSearch') SEARCH
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
        tr(v-for="page in pages")
          td(style="text-align: center")   
            NuxtLink(:to="`/Page/${page.cuid}`") {{ page.page_name}}
          td(style="text-align: center") {{ page.donation_goal }}
          td(style="text-align: center") {{ dateFormat(page.deadline) }}
              
</template>

<style scoped>
</style>