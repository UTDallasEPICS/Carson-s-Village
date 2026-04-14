<script lang="ts" setup>
import { dateFormat } from 'utils';

const props2 = defineProps<{ headers: [] }>()
const props = defineProps({
    headers: {
        type: []
    }
});

// make the table based on a row of objects with a list of headers (list of objects) { title, property } iterate over headers
// header object has header.name and header.property
//  table 
//      thread
//              tr(v-for="(header in headers)" :key="i")
//                  th.css  {{ header.name }}
//              tr(v-for="(header in headers)" :key="j")
//                  LinkButton(v-if="${header.kind=="link"}" :to=header.property)
//                  td.css(v-else-if="${header.kind=="money"}") {{ donationFormat(header.property) }}
//                  td.css(v-else-if="${header.kind=="date"}")  {{ dateFormat(header.property) }}
//                  td.css(v-else) {{ header.property }}
//                

const headers = [
  {
    name: "Name",
    property: "name"
  },
  {
    name: "Amount Raised",
    property: 2000,
    kind: "money"
  },
  {
    name: "",
    property: "/Page/12sdfgsfdscadasd",
    kind: "link"
  },
  {
    name: "page name",
    property: "Leorem Ipsum",
    kind: "string"
  }, 
  {
    name: "current date",
    property: new Date().toISOString(),
    kind: "date"
  }
]

/* 
tr(v-for="row in rows")
  td(v-for="header in headers") 
    p(v-if="header.kind != 'link") {{row[header.property]}}
    LinkButton(v-else) {{row[header.property]}}
*/
// Usage
/* rowsObject = ref<tableItems>({
    name: ""
    property: undefined or new object()
    url: ""
    linkName: ""
}

/* pageNameHeader = ref<tableItems>({
    name: "Page Name"
    property: ""
    isLink: false
}

/* viewPageHeader = ref<tableItems>({
    name: "view"
    property: ""
    isLink: true
}
}

*/
// StandardTable(:header=rowsObject )
</script>

<template lang="pug">
div(class="container bg-white mx-auto mt-1 w-11/12 sm:w-[1000px] h-auto rounded-[60px] shadow-[0px_3px_6px_3px_rgba(0,0,0,0.15),0px_3px_3px_rgba(0,0,0,0.3)]")
    table(class="table-auto")
        thead
            tr
                th(class="font-poppins font-bold p-2 bg-[#5aadc2] rounded-tl-[60px] w-[33%] overflow-hidden") 
                    slot
                th(class="font-poppins font-bold w-[34%] bg-[#5aadc2]") 
                    slot
                th(class="font-poppins font-bold bg-[#5aadc2]")
                    slot
                th(class="font-poppins font-bold w-[33%] rounded-tr-[60px] bg-[#5aadc2]")
                    slot
            tr(v-for="(item, i) in itemList" 
                :key="i" 
            )
                td(class="font-poppins text-gray-dark font-bold text-center") 
                    slot
                td(class="font-poppins text-gray-dark font-bold text-center") 
                    slot
                td
                LinkButton(class="sm:my-2 whitespace-nowrap flex flex-row py-3.5 px-6 gap-2.5" :to="") 
                    slot
    div(class="container mx-auto w-auto sm:w-[1000px] bg-[#5aadc2] h-[50px] rounded-b-[60px]")
</template>

<style scoped></style>
