<template lang="pug">
div
    h2(style="margin-top: 2.5rem;") Family Reports 
    br
    a.mt-1.p-4.px-6.pt-2.bg-orange-400.rounded-full(style="color: white; font-weight: 700;" :href="filedownloadlink" :download="downloadName" :dataset.downloadurl="dataset") download
    table(style="margin-top: 1.25rem; width: 100%; border-spacing: 0; border-collapse: collapse;" v-if="isAdminAdvocate")
        thead(style="color:white;")
            tr
                th(style="padding: 1rem; background-color: #6eabbf; border-radius: 60px 0 0 0; width: 12%;") Page Name
                th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Advocate
                th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Duration
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%;") Goal Met
                th(style="padding: 1rem; background-color: #6eabbf; width: 10%;") Goal Met Date
                th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Start Date
                th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Owed
                th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Owed %
                th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Paid
                th(style="padding: 1rem; background-color: #6eabbf; width: 5%") Goal
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Goal Date
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Status
                th(style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0; width: 7%;") Toggle Status
        tbody(v-for="family in families")
            tr(v-for="(page,i) in family.Pages" 
            :class="{'bg-gray-200': (i+1) % 2}") 
                td(style="text-align: center;") {{ page.page_name }}
                td(style="text-align: center;") {{ family.AdvocateResponsible.first_name  + " " + family.AdvocateResponsible.last_name }}
                td(style="text-align: center;") {{ page.duration }} 
                td(style="text-align: center;") {{  page.donation_status }}
                td(style="text-align: center;") {{ (page.goal_met_date) ? dateFormat(page.goal_met_date, true) : "Goal Not Reached" }}
                td(style="text-align: center;") {{ dateFormat(page.start_date, true) }}
                td(style="text-align: center;") {{ donationFormat((page.amount_raised - page.amount_distributed)) }}
                td(style="text-align: center;") {{ (page.donation_goal) ? ((page.amount_raised - page.amount_distributed)/(page.donation_goal) * 100) + "%" : "No donation goal"}}
                td(style="text-align: center;") {{ donationFormat(page.amount_distributed) }}
                td(style="text-align: center;") {{ donationFormat(page.donation_goal) }}
                td(style="text-align: center;") {{ dateFormat(page.deadline)}}
                td(style="text-align: center;") {{ page.status }}
                td(style="text-align: center;")
                  ActionButton(style="color: white; background-color:red;" @click="togglePageStatus(page)") {{ "X" }}
</template>
    
<script setup lang='ts'>
    //import { Family } from '@prisma/client'; 
    import type { Family, User, Page as Page2 } from '@/types.d.ts'
    import { Page, User as User2 } from '@prisma/client'
    import { donationFormat, dateFormat } from '@/utils';
    
    const cvuser = useCookie<User>('cvuser');
    const isAdminAdvocate = computed(() => cvuser.value?.user_role == "advocate" || cvuser.value?.user_role == "admin" )
    const families = ref<Family[]>([]);
    const familyPages = ref<Partial<Page[]>>([])
    const currentFamily = ref(null);
    const currentFamilyId = ref(null);
    const filedownloadlink = ref("")
    const dataset = ref("")
    const downloadName = ref("")
  
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
  
    // loads family report data from the families database table and joins and creates a download link for the file
    const loadReports = async () => {
      if( isAdminAdvocate ) { 
          const { data: familiesData } = await useFetch('/api/families', {
          method: 'GET' 
          });
          
          families.value = familiesData.value as unknown as Family[]
          // gathering the family data into an array of family pages and their advocate responsible
          families.value.forEach((element: Family)  => { element.Pages.forEach((element2) => {familyPages.value.push( { ...element2 as unknown as Page[], ...element.AdvocateResponsible as any }) })})
          const familyPagesArr = [...familyPages.value]
          
          const csv = convertToCSV( familyPagesArr )
          createCsvDownloadLink(csv)
      }
    }

    // creates download link to csv
    const createCsvDownloadLink = (csv: string) => {
      const csvFile = new File([csv], "file", {
      type: "text/csv" } )
      const filename = "report-" + dateFormat(new Date().toString())+".csv"
      filedownloadlink.value = window.URL.createObjectURL(csvFile);
      dataset.value = ["text/csv", filename, filedownloadlink.value].join(':');
      downloadName.value = filename
    }
    // method activated by Advocate or Admin to manual remove the ability to donate to a family page after about a week of the donation deadline.
    // an advocate or admin can also re-enable a page to set its status from 'inactive' to 'active'
    const togglePageStatus = (page: Page) => {
      if(isAdminAdvocate.value) {
        console.log(page.status)
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
          } else if(!confirmReactivate) {
          return ""
          }
        }
          booleanChanged = false          

          const toggledStatus = useFetch('api/page', {
            method: "PUT",
            body: { ...page }
          })
        }
    }
    const goToNextPage = () => {
      // existing logic for pagination
    };
    
    const goToPreviousPage = () => {
      // existing logic for pagination
    };
    
    // Invoke the initial data loading
    loadReports();
    
  </script>