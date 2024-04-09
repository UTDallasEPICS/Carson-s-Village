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
.container.bg-white.mx-auto.mt-1(class="w-11/12 sm:w-[1000px]" style="height: auto; box-shadow: 0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3); border-radius: 60px;")
    table(style="table-layout: auto;")
        thead
            tr
                th.font-poppins.font-bold.font-bold.p-2(style="--tw-bg-opacity: 1; background-color: #5aadc2;border-radius: 60px 0px 0px 0px; width:33%; overflow: hidden") 
                    slot
                th.font-poppins.font-bold(style="width:34%; --tw-bg-opacity: 1; background-color: #5aadc2;") 
                    slot
                th.font-poppins.font-bold(style="--tw-bg-opacity: 1; background-color: #5aadc2;")
                    slot
                th.font-poppins.font-bold(style="width:33%; --tw-bg-opacity: 1; border-radius: 0px 60px 0px 0px; background-color: #5aadc2;")
                    slot
            tr(v-for="(item, i) in itemList" 
                :key="i" 
            )
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") 
                    slot
                td.font-poppins.text-gray-dark.font-bold(style="text-align: center") 
                    slot
                td
                LinkButton(class="sm:my-2" style="white-space: nowrap; display: flex; flex-direction: row; padding: 14px 24px; gap: 10px;" :to="") 
                    slot
    .container.mx-auto(class="w-auto sm:w-[1000px]" style="--tw-bg-opacity: 1; background-color: #5aadc2;height: 50px; border-radius: 0px 0px 60px 60px;")
</template>

<style scoped></style>
