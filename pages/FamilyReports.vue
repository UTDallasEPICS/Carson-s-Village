<template lang="pug">
//todo: add selection for families instead of all at once and toggle between all at once and all families by having the first option as displaying every page
div
    TitleComp.border-1.border-black Family Reports 
    br
    .py-4.grid(class="sm:grid-cols-3" v-if="date_ranged")
        CVLabel Date Field
        .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
            select.rounded-md.outline-0.border-box.w-full.p-2.bg-white(style="border: 1px solid #c4c4c4;" v-model='date_field') Select User Role
                option deadline
                option start_date
                option goal_met_date
    .flex.gap-5(style="align-items: center; justify-content: center;" v-if="date_ranged")
      CVLabel Date Range
      CVDatepicker(v-model='date' @update:model-value="currentPage=0; loadReports();" range)
    h2.mt-4.ml-10.border-1.border-black.underline(style="font-size: 23px") Table Dimensions
      .flex.flex-box.flex-wrap.gap-10(style="width: 450px") 
        h1.ml-1(style="font-size: 18px") Number of Table Rows
          CVInputNumerical(v-model="dimensions")
    h2.mt-4.ml-10.underline(style="font-size: 18px") Fields to Show
    .flex.flex-box.flex-wrap.gap-10.stretch.grid.ml-2(class="sm:grid-cols-3" style="width: 700px") 
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Duration
        div(class="w-full")
          input(type='checkbox' v-model="display.duration")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Goal Met
        div
          input(type='checkbox' v-model="display.goal_met")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Goal Met Date
        div
          input(type='checkbox' v-model="display.goal_met_date")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Start Date
        div
          input(type='checkbox' v-model="display.start_date")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Amount Owed
        div
          input(type='checkbox' v-model="display.owed") 
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Amount Paid Out
        div
          input(type='checkbox' v-model="display.paid")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Goal Date
        div
          input(type='checkbox' v-model="display.goal_date")
      label.mt-4.ml-10.text-md(class="sm:mt-0" style="letter-spacing: 0.35px;") Donation Goal
        div
          input(type='checkbox' v-model="display.donation_goal")
    .flex.flex-col.gap-5.px-4.mx-auto.mt-8(class="w-3/4 sm:px-16")
    br
    .gap-2.justify-center.cols-2.pl-10.pr-6  
      button.mr-9.mt-1.p-6.px-6.pr-6.pt-3.pb-3.cursor-pointer.bg-orange-999(class="transition duration-300 bg-orange-999 hover:bg-green-600" style="border-radius: 125px; height: 50px; color: white; font-weight: 700;" @click="date_ranged=!date_ranged; currentPage=0; loadReports()") {{ "Display In Date Range" }}
      a.mr-9.mt-1.p-6.px-6.pr-6.pt-3.pb-3.cursor-pointer.bg-orange-999(class="transition duration-300 bg-orange-999 hover:bg-green-600" style="border-radius: 100px; height: 50px; color: white; font-weight: 700;" :href="filedownloadlink" :download="downloadName" :dataset.downloadurl="dataset") Download
      button.mr-2.mt-1.p-2.px-9.pt-3.pb-3.cursor-pointer.bg-orange-999(class="transition duration-300 bg-orange-999 hover:bg-green-600"  @click="tableToggle = !tableToggle" style="border-radius: 100px; height: 50px; color: white; font-weight: 700;") {{ !tableToggle ? "archive" : "all pages" }}
      table(style="margin-top: 1.25rem; width: 100%; border-spacing: 0; border-collapse: collapse;" v-if="isAdminAdvocate")
          thead(style="color: white;")
              tr
                  th(style="padding: 1rem; background-color: #6eabbf; border-radius: 60px 0 0 0; width: 12%;") Page Name
                  th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Advocate
                  th(style="padding: 1rem; background-color: #6eabbf; width: 10%;" v-if="display.duration") Duration
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%;" v-if="display.goal_met") Goal Met
                  th(style="padding: 1rem; background-color: #6eabbf; width: 10%;" v-if="display.goal_met_date") Goal Met Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 12%;" v-if="display.start_date") Start Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%;" v-if="display.owed") Owed
                  //th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Owed %
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%" v-if="display.paid") Paid
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%" v-if="display.donation_goal") Goal
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%" v-if="display.goal_date") Goal Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Status
                  th(style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0; width: 9%;") Toggle Status
          tbody
              //only show active pages on toggle
              tr(v-for="(page, i) in (!tableToggle ? families : families.filter(page => page.status === 'active'))" 
              :class="{'bg-gray-200': (i+1) % 2}" :key="listOfTagsLen") 
                  td(style="text-align: center;") {{ page.page_first_name + " " + page.page_last_name }}
                  td(style="text-align: center;") {{ page.Family.AdvocateResponsible ? (page.Family?.AdvocateResponsible?.first_name  + " " + page.Family?.AdvocateResponsible?.last_name) : "No Advocate Assigned"}}
                  td(style="text-align: center;" v-if="display.duration") {{ page.duration }} 
                  td(style="text-align: center;" v-if="display.goal_met") {{  page.donation_status }}
                  td(style="text-align: center;" v-if="display.goal_met_date") {{ (page.goal_met_date) ? dateFormat(page.goal_met_date, true) : "Goal Not Reached" }}
                  td(style="text-align: center;" v-if="display.start_date") {{ dateFormat(page.start_date, true) }}
                  td(style="text-align: center;" v-if="display.owed") {{ donationFormat((page.amount_raised - page.amount_distributed)) }}

                  //td(style="text-align: center;") {{ (page.donation_goal) ? ((page.amount_raised - page.amount_distributed)/(page.donation_goal) * 100).toFixed(2) + "%" : "No donation goal"}}
                  td(style="text-align: center;"  v-if="display.paid") {{ donationFormat(page.amount_distributed) }}
                  td(style="text-align: center;" v-if="display.donation_goal" ) {{ donationFormat(page.donation_goal) }}
                  td(style="text-align: center;" v-if="display.goal_date") {{ dateFormat(page.deadline)}}
                  td(style="text-align: center;") {{ page.status }}
                  td(style="text-align: center;")
                    ActionButton(style="color: white; background-color: red;" @click="togglePageStatus(page)") {{ "X" }}

.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
  .col-md-10.px-2.mt-2
      button(@click="prevPage") &lt
  .col-md-10.px-2.mt-2
      p {{  currentPage + 1 }}
  .col-md-10.px-2.mt-2
      button(@click="nextPage") >
</template>
    
<script setup lang='ts'>
    // todo: add number of family family pages an advocate is responsible, total amount raised by the families an advocate is responsible for
    //import { Family } from '@prisma/client'; 
    import type { Family, User } from '@/types.d.ts'
    import type { Page } from '@prisma/client'
    import { ref } from 'vue';

    import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

    
    const cvuser = useCookie<User>('cvuser');
    const isAdminAdvocate = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin" )
    const families = ref<Family[]>([]);
    const familyPages = ref<Partial<Page[]>>([])
    const familiesRaw = ref<Family[]>([])
    const currentPage = ref(0);
    const currentFamily = ref(null);
    const currentFamilyId = ref(null);
    const filedownloadlink = ref("")
    const dataset = ref("")
    const downloadName = ref("")
    const totalLength = ref(0)
    const tableToggle = ref(false)
    const start_date = ref(new Date("1/01/2023"))
    const end_date = ref(new Date())
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(endDate.getDate() - 31));
    
    const listOfTags = ref(["donation_goal", "amount_raised", "deadline", "amount_distributed", "donation_status", "duration", "start_date", "goal_met_date", "page_first_name", "page_last_name", "first_name", "middle_name", "last_name", "owed"])
    // computed variable used as a key for each element of the table so that the striping of the table re-renders when the table is resized.
    const listOfTagsLen = computed(() => listOfTags.value?.length)
    // number of family pages in the family reports table per page with @default=12 pages
    const dimensions = ref(12)
    const date_ranged = ref(false)
    const date = ref([startDate, endDate])
    date.value = [startDate, endDate]
    const date_field = ref("start_date")
    type DisplayReport = {
      duration: boolean,
      goal_date: boolean,
      goal_met: boolean,
      goal_met_date: boolean,
      owed: boolean,
      paid: boolean,
      donation_goal: boolean,
      start_date: boolean,
    }

    const display = ref<DisplayReport>({
      duration: true,
      goal_met: true,
      goal_met_date: true,
      goal_date: true,
      start_date: true,
      owed: true,
      paid: true,
      donation_goal: true
    })

    // todo: improve performance (we do not want to rebuild the list everytime).
    // selects the list of tags to show in the report csv
    watch(display, async() => {
      listOfTags.value = []
      if(display.value.donation_goal) {
        listOfTags.value.push("donation_goal")
      }
      if(display.value.paid) {
        listOfTags.value.push("amount_raised")
      }
      listOfTags.value.push("amount_distributed")
      if(display.value.goal_date) {
        listOfTags.value.push("deadline")
      }
      if(display.value.goal_met) {
        listOfTags.value.push("donation_status")
      }
      if(display.value.duration) {
        listOfTags.value.push("duration")
      }
      if(display.value.start_date) {
        listOfTags.value.push("start_date")
      }
      if(display.value.goal_met_date) {
        listOfTags.value.push("goal_met_date")
      }
      listOfTags.value.push("page_first_name")
      listOfTags.value.push("page_last_name")
      listOfTags.value.push("first_name")
      listOfTags.value.push("middle_name") 
      listOfTags.value.push("last_name")
      if(display.value.owed) {
        listOfTags.value.push("owed")
      }
      //listOfTags.value.push("Amount Owed / Goal Percentage")
      console.log(listOfTagsLen.value)
      const familyPagesArr = [...familyPages.value]
      const csv = convertToCSV(familyPagesArr, listOfTags.value)
      createCsvDownloadLink(csv)
    },  { deep: true })
    
    // The next three watches respond to changing the top input, date field, and date range and reload reports accordingly
    watch(dimensions, async() => {
      currentPage.value = 0
      loadReports()
    })
    watch(date_field, async() => {
      currentPage.value = 0
      loadReports()
    })

    const data_family = ref<Family>({
      cuid: '',
      family_name: '',
      stripe_account_id: null,
      created_at: '',
      updated_at: '',
      advocateCuid: '',
      Pages: [],
      FamilyMembers: [],
      AdvocateResponsible: {
      cuid: '',
      first_name: '',
      last_name: '',
      user_role: '',
      email: '',
      middle_name: '',
      phone: '',
      address: '',
      Pages: [],
      familyCuid: ''
  },
  FamilyDonations: [],
  FamilyDonationPayouts: []
  })
  
  // converts array of family pages and their advocate responsible for the family into a csv
  function convertToCSV(arr: Partial<Page[]>, listOfTags: string[]) {
    // todo: clean up and remove usages of any, idea for this is to use the pick type from typescript
    //const listOfTags = ["page_name", "donation_goal", "amount_raised", "deadline", "amount_distributed", "donation_status", "duration", "start_date", "goal_met_date", "first_name", "middle_name", "last_name", "Amount Owed / Goal Percentage" ]
    // removes every column not in list of tags
    Object.keys(arr[0] || "").forEach((element: string) => {
      const currentArr = ref<Partial<Page[]>>([])
      if(!listOfTags.includes(element)) {
        arr.forEach((d: any) => {
        const { [element]: removedSeries , ...newObject  } = d
        currentArr.value.push(newObject)
    });
      arr = currentArr.value 
      }
    })

    //adds owed and calculates owed percent (which we may want to depreciate)
    type pageReport = Partial<Page> & { owed: number | undefined}
    const currentArr = ref<pageReport[]>([])
    arr.forEach((d) => {
        const owedCents: number | undefined = (d?.amount_raised as number) - (d?.amount_distributed as number)
        const owed: string | undefined = donationFormat(owedCents)
        const goal = (d?.donation_goal as number)
        const owedPercent: number | undefined = goal != 0 ? ((100 * owedCents) / goal) : 0
        currentArr.value.push({...d, ['owed']: owedCents/100.0 | 0} )
        //currentArr.value.push({...d, ['owedPercent']: owedPercent | 0} )
    });

    const array = [listOfTags].concat(currentArr.value as unknown as string[])
  
    // creates CSV
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }


  // creates download link to csv of family reports table
  const createCsvDownloadLink = (csv: string) => {
      const csvFile = new File([csv], "file", {
      type: "text/csv" } )
      // unique filename based on current time
      const filename = "family_report_" + formatReportDate(dateFormat(new Date().toString(), true).replaceAll("/", "-")) + ".csv"
      console.log(filename)
      //if(typeof window !== undefined) {
      filedownloadlink.value = window.URL.createObjectURL(csvFile);
      //}
      dataset.value = ["text/csv", filename, filedownloadlink.value].join(':');
      downloadName.value = filename
    }
  
  // loads family report data from the families database table and joins and creates a download link for the file
  // Additionally, if the user presses display date ranged, the UI table filters by a cirtain date range specified by start_date and end_date on the date_field
  const loadReports = async () => {
    if( isAdminAdvocate ) { 
        const { data: familiesData } = await useFetch('/api/familiesReports', {
        method: 'GET', 
        query: { page_number: currentPage, dimensions, start_date: date.value[0].toISOString(), end_date: date.value[1].toISOString(), date_field: date_field.value },
        watch: [currentPage, date, date_field]
        });
        
        if(date_ranged.value) {
          families.value = familiesData.value?.date_ranged_pages as unknown as Family[]
          totalLength.value = familiesData.value?.Pagination.total_date_ranged as unknown as number
        } else {
          families.value = familiesData.value?.paginated_pages as unknown as Family[]
          totalLength.value = familiesData.value?.Pagination.total as unknown as number
        }
        
        console.log(families.value)
        // gathering the family data into an array of family pages and their advocate responsible
        familiesRaw.value = familiesData.value?.all_families as unknown as Family[]
        //families.value.forEach((family: Family) => { family.Pages?.forEach((pages: any) => { pages.page_first_name_2 = pages.page_first_name })})
        console.log(families.value)     
        // loading every single family in the database into the report. This has to be different than families because families is paginated and thus lacks records
        familiesRaw.value.forEach((family: Family)  => { family.Pages?.forEach((pages) => {familyPages.value.push( { ...pages as unknown as Page[], ...family.AdvocateResponsible as any }) })}) //page_first_name: pages.first_name, page_last_name: pages.last_name
        console.log(familyPages.value) 
        const familyPagesArr = [...familyPages.value]
        const csv = convertToCSV(familyPagesArr, listOfTags.value)
        createCsvDownloadLink(csv)

    }
  }


    // Formats report date to the format 'yyyy-mm-dd'
    function formatReportDate(date: string) {
      const dates = date.split("-")
      const month = dates[0]
      const day = dates[1]
      const year = dates[2]
      const formatedMonth = parseInt(month) >= 10 ? month : 0 + "" + month
      const formatedDay = parseInt(day) >= 10 ? day : 0 + "" + day
      return year + "-" + formatedMonth + "-" + formatedDay 
    }
    
    
    // method activated by Advocate or Admin to manual remove the ability to donate to a family page after about a week of the donation deadline.
    // an advocate or admin can also re-enable a page to set its status from 'inactive' to 'active'
    const togglePageStatus = async(page: Page) => {
      if(isAdminAdvocate.value) {
        let booleanChanged = false 
        if(page.status == "active") {
          const confirmDeactivate = confirm('Are you sure you want to deactivate this page?')
            if(confirmDeactivate) {
              page.status = "inactive"
              booleanChanged = true
            } else if(!confirmDeactivate){
              return ""
            }
        } else if(page.status == "inactive" && !booleanChanged) {
          const confirmReactivate = confirm('Are you sure you want to reactivate this page?')
          if(confirmReactivate) {
            page.status = "active"

            booleanChanged = true
          } else if(!confirmReactivate){
          return ""
          }
      } else if(page.status == "inactive" && !booleanChanged) {
        const confirmReactivate = confirm('Are you sure you want to reactivate this page?')
        if(confirmReactivate) {
          page.status = "active"
          booleanChanged = true
        } else if(!confirmReactivate) {
        return ""
        }
       }
          booleanChanged = false          
          const toggledStatus = await $fetch('api/page', {

            method: "PUT",
            body: { ...page }
          })
    }

  }
    

// Pagination control, move the page counter forwards and backwards and searches
const nextPage = () => { 
  console.log(totalLength.value / dimensions.value)
    if(currentPage.value < ((totalLength.value / dimensions.value) - 1)){
        currentPage.value++
        loadReports()
    } 
}
const prevPage = () => {
    if(currentPage.value != 0) {
        currentPage.value--
        loadReports()
    } 
  }
// Invoke the initial data loading
loadReports();
</script>