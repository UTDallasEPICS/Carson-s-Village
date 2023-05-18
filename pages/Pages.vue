<script lang="ts">
const pages = ref([]);
//const searchQuery ="";
type searchParam = {
    searchQuery : String
}

const data_search = ref<searchParam>({
    searchQuery: ""
})

const search = async () => {
    await useFetch('/api/pages', {
    method: 'GET',
    body: data_search.value
  })
  console.log(data_search.value);

}
</script>


<template lang="pug">
.container
  h1(class = 'text-2xl indent-8 mt-2') Memorial Page Search
  br
  legend(class = 'text-m indent-8' ) Search memorial pages
  input(class="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-black-500" type="search" placeholder=" " v-model="data_search.searchQuery")
  button(class='text-m bg-gray-300 p-2 mt-1 mb-2' @click='search') SEARCH
      .container

b(class = "text-indent-8") Search Results 
table.table.table-striped(style="width:100%;")
    thead
      .bg-green-400.text-white-500(style="color:white")
        tr
            th Page&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            th Donation Goal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            th Deadline
            tr(v-for="(page, index) in pages")
                td {{ page }}
                

</template>

<style scoped>
</style>
