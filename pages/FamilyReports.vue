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
                th(style="padding: 1rem; background-color: #6eabbf; width: 14%;") Duration
                th(style="padding: 1rem; background-color: #6eabbf; width: 9%;") Goal Met
                th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Goal Met Date
                th(style="padding: 1rem; background-color: #6eabbf; width: 12%;") Start Date
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Owed
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Owed %
                th(style="padding: 1rem; background-color: #6eabbf; width: 7%") Paid
                th(style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0; width: 7%;") Goal
        tbody(v-for="family in families")
            tr(v-for="(page,i) in family.Pages" 
            :class="{'bg-gray-200': (i+1) % 2}") 
                td(style="text-align: center;") {{ page.page_name }}
                td(style="text-align: center;") {{ family.AdvocateResponsible.first_name  + " " + family.AdvocateResponsible.last_name }}
                td(style="text-align: center;") {{ "30 years" }} 
                td(style="text-align: center;") {{  "In Progress" }}
                td(style="text-align: center;") {{ dateFormat(page.deadline) }}
                td(style="text-align: center;") {{ "2012"}}
                td(style="text-align: center;") {{ donationFormat((page.amount_raised - page.amount_distributed)) }}
                td(style="text-align: center;") {{ (page.donation_goal) ? ((page.amount_raised - page.amount_distributed)/(page.donation_goal) * 100) + "%" : "No donation goal"}}
                td(style="text-align: center;") {{ donationFormat(page.amount_distributed) }}
                td(style="text-align: center;") {{ donationFormat(page.donation_goal) }}
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
      Stripe_Account_id: null,
      Stripe_Accont_cuid: null,
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
  
  function convertToCSV(arr : Partial<Page[]>) {
    const listOfTags = ["page_name", "donation_goal", "amount_raised", "deadline", "amount_distributed", "first_name", "middle_name", "last_name", "Amount Owed / Goal Percentage" ]
    //removes every column not in list of tags
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
  
    //creates CSV
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }
  
    const loadReports = async () => {
      if( isAdminAdvocate ) { 
          const { data: familiesData } = await useFetch('/api/families', {
          method: 'GET' 
          });
          families.value = familiesData.value as unknown as Family[]
          families.value.forEach((element: Family)  => { element.Pages.forEach((element2) => {familyPages.value.push( { ...element2 as unknown as Page[], ...element.AdvocateResponsible as any }) })})
          const familyPagesArr = [...familyPages.value]
          const csv = convertToCSV( familyPagesArr )
          console.log(csv)
          const csvFile = new File([csv], "file", {
           type: "text/csv" } )
    
          const filename = "report-" + dateFormat(new Date().toString())+".csv"
          filedownloadlink.value = window.URL.createObjectURL(csvFile);
          dataset.value = ["text/csv", filename, filedownloadlink.value].join(':');
          downloadName.value = filename
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