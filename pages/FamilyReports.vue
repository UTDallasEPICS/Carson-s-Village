<template lang="pug">
//todo: style the date selection and have date selection on all the following: donation deadline, start date, and goal met date (use HTML select?)
//todo: num pages per family
//todo: add selection for families instead of all at once and toggle between all at once and all families by having the first option as displaying every page
//todo: 3 column by however many needed rows (flex-wrap) of checkboxes to enable and disable columns. Future idea: put a nicer version as a sidebar
div
    h2(style="margin-top: 2.5rem;") Family Reports 
    br
    .flex.flex-col.gap-5.px-4.mx-auto.mt-8(class="w-3/4 sm:px-16")
      //img.mx-auto(v-if="profileImage?.url" class="w-[122px] h-[122px] rounded-[8px]" :src="`${profileImage?.url}`")
      .text-gray-dark.mx-auto.w-max.font-poppins.text-md {{ dateFormat(start_date, true) + ' - ' + dateFormat(end_date, true) }} 
      //.flex.flex-col-reverse.gap-5(class="sm:grid sm:grid-cols-2")
        .relative.w-96.p-1(v-if="imageData.length != 0" )
          button.absolute.left-4.top-64.bg-black.text-white(@click="prevImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#60;
          button.absolute.right-8.top-64.bg-black.text-white(@click="nextImage" style="opacity:0.7; --tw-text-opacity: 1; width: 46px; height: 46px; border-radius:50%; align-items: center; justify-content: center; line-height: 2; text-align: center;color: white;") &#62;
          img.w-96(style="object-fit:cover" :src="imageData[currentImage].url")
    .py-4.grid(class="sm:grid-cols-5") 
            CVLabel Date Range
            .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")
              CVDatepicker(v-model='start_date' @update:model-value="currentPage=0; loadReports();")
            .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")  
              p(style="text-align:center;") {{ "-" }}
            .col-md-8.mx-9(class="sm:col-span-1 sm:mr-11")  
              CVDatepicker(v-model='end_date' @update:modelValue="currentPage=0; loadReports()" )          
    .flex.gap-2.justify-center.cols-2
      table(style="margin-top: 1.25rem; width: 100%; border-spacing: 0; border-collapse: collapse;" v-if="isAdminAdvocate")
          thead(style="color: white;")
              tr
                  th(style="padding: 1rem; background-color: #6eabbf; border-radius: 60px 0 0 0; width: 12%;") Page Name
                  th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Advocate
                  th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Duration
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%;") Goal Met
                  th(style="padding: 1rem; background-color: #6eabbf; width: 10%;") Goal Met Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Start Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Owed
                  //th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Owed %
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Paid
                  th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Goal
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Goal Date
                  th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Status
                  th(style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0; width: 7%;") Toggle Status
          tbody
              tr(v-for="(page, i) in families" 
              :class="{'bg-gray-200': (i+1) % 2}") 
                  td(style="text-align: center;") {{ page.page_name }}
                  td(style="text-align: center;") {{ page.Family.AdvocateResponsible.first_name  + " " + page.Family.AdvocateResponsible?.last_name }}
                  td(style="text-align: center;") {{ page.duration }} 
                  td(style="text-align: center;") {{  page.donation_status }}
                  td(style="text-align: center;") {{ (page.goal_met_date) ? dateFormat(page.goal_met_date, true) : "Goal Not Reached" }}
                  td(style="text-align: center;") {{ dateFormat(page.start_date, true) }}
                  td(style="text-align: center;") {{ donationFormat((page.amount_raised - page.amount_distributed)) }}
                  //td(style="text-align: center;") {{ (page.donation_goal) ? ((page.amount_raised - page.amount_distributed)/(page.donation_goal) * 100).toFixed(2) + "%" : "No donation goal"}}
                  td(style="text-align: center;") {{ donationFormat(page.amount_distributed) }}
                  td(style="text-align: center;") {{ donationFormat(page.donation_goal) }}
                  td(style="text-align: center;") {{ dateFormat(page.deadline)}}
                  td(style="text-align: center;") {{ page.status }}
                  td(style="text-align: center;")
                    ActionButton(style="color: white; background-color: red;" @click="togglePageStatus(page)") {{ "X" }}
      a.mr-9.mt-1.p-4.px-6.pt-2.bg-orange-999(style="border-radius: 100px; height: 50px; color: white; font-weight: 700;" :href="filedownloadlink" :download="downloadName" :dataset.downloadurl="dataset") Download
.ml-9.mb-9.py-7.flex.flex-wrap.gap-2.place-content-center
  .col-md-10.px-2.mt-2
      button(@click="prevPage") &lt
  .col-md-10.px-2.mt-2
      p {{  currentPage + 1 }}
  .col-md-10.px-2.mt-2
      button(@click="nextPage") >
</template>
    
<script setup lang='ts'>
    // todo: Make the table resizable with custom dimensions. Possible application of the standard table 
    // todo: add number of family family pages an advocate is responsible, total amount raised by the families an advocate is responsible for
    //import { Family } from '@prisma/client'; 
    import type { Family, User, Page as Page2 } from '@/types.d.ts'
    import { Page, User as User2 } from '@prisma/client'
    import { donationFormat, dateFormat } from '@/utils';
    
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
    const start_date = ref("1/01/2015")
    const end_date = ref(new Date().toLocaleDateString())

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
      Pages: [],
      familyCuid: ''
  },
  FamilyDonations: [],
  FamilyDonationPayouts: []
  })
  
  // converts array of family pages and their advocate responsible for the family into a csv
  function convertToCSV(arr : Partial<Page[]>) {
    // todo: clean up and remove usages of any, idea for this is to use the pick type from typescript
    // problem for Samuel: page_name will be set as first_name and last_name which will be on the same level as the user first_name and last_name
    const listOfTags = ["page_name", "donation_goal", "amount_raised", "deadline", "amount_distributed", "donation_status", "duration", "start_date", "goal_met_date", "first_name", "middle_name", "last_name", "Amount Owed / Goal Percentage" ]
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

    //adds owed Percent
    //todo: add something useful here or depreciate
    type pageReport = Partial<Page> & { owedPercent: number | undefined }
    const currentArr = ref<pageReport[]>([])
    arr.forEach((d) => {
        const owed = (d?.amount_raised as number) - (d?.amount_distributed as number)
        const goal = (d?.donation_goal as number)
        const owedPercent: number | undefined = goal != 0 ? ((100 * owed) / goal) : 0
        
        currentArr.value.push({...d, ['owedPercent']: owedPercent | 0} )
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
      filedownloadlink.value = window.URL.createObjectURL(csvFile);
      dataset.value = ["text/csv", filename, filedownloadlink.value].join(':');
      downloadName.value = filename
    }
  
  // loads family report data from the families database table and joins and creates a download link for the file
  const loadReports = async () => {
    if( isAdminAdvocate ) { 
        const { data: familiesData } = await useFetch('/api/familiesReports', {
        method: 'GET', 
        query: { page_number: currentPage, start_date: start_date.value, end_date: end_date.value },
        watch: [currentPage, start_date, end_date]
        });
        
        families.value = familiesData.value?.paginated_pages as unknown as Family[]
        totalLength.value = familiesData.value?.Pagination.total as unknown as number
        console.log(families.value)
        // gathering the family data into an array of family pages and their advocate responsible
        familiesRaw.value = familiesData.value?.all_families as unknown as Family[]
        familiesRaw.value.forEach((element: Family)  => { element.Pages.forEach((element2) => {familyPages.value.push( { ...element2 as unknown as Page[], ...element.AdvocateResponsible as any }) })})
        const familyPagesArr = [...familyPages.value]
        const csv = convertToCSV( familyPagesArr )
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
    const togglePageStatus = (page: Page) => {
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
          } else if(!confirmDeactivate){
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

          booleanChanged = false          
          const toggledStatus = $fetch('api/page', {
            method: "PUT",
            body: { ...page }
          })
        }
    }
    
// Pagination control, move the page counter forwards and backwards and searches
const nextPage = () => { 
  console.log(totalLength.value / 12)
    if(currentPage.value < ((totalLength.value / 12) - 1)){
        currentPage.value++
        loadReports()
    } 
}
const prevPage= () => {
    if(currentPage.value != 0){
        currentPage.value--
        loadReports()
    } 
  }
// Invoke the initial data loading
loadReports();
    }
    </script>
