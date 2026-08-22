<script setup lang='ts'>
  // todo: add number of family family pages an advocate is responsible, total amount raised by the families an advocate is responsible for
  //import { Family } from '@prisma/client'; 
  import type { Family, User } from '@/types.d.ts'
  import type { Page } from '~~/prisma/generated/models'
  import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
  import { authClient } from '~/utils/auth-client';

  const { data } = await authClient.useSession(useFetch);
  const user = computed(() => data.value?.user || null)

  definePageMeta({
    middleware: ["advocate-guard"]
  })
  
  const isAdminAdvocate = computed(() => user.value?.role == "advocate" || user.value?.role == "admin" )
  const families = ref<Family[]>([]);
  const familyPages = ref<Partial<Page[]>>([])
  const familiesRaw = ref<Family[]>([])
  const currentPage = ref(0);
  const totalLength = ref(0)
  const pageFilter = ref('active')
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
    await loadReports()
  })
  watch(date_field, async() => {
    currentPage.value = 0
    await loadReports()
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
  const filedownloadlink = ref("")
  const dataset = ref("")
  const downloadName = ref("")
  const createCsvDownloadLink = (csv: string) => {
      const csvFile = new File([csv], "file", {
      type: "text/csv" } )

      // unique filename based on current time
      const filename = "family_report_" + formatReportDate(dateFormat(new Date().toString(), true).replaceAll("/", "-")) + ".csv"

      filedownloadlink.value = window.URL.createObjectURL(csvFile);
      dataset.value = ["text/csv", filename, filedownloadlink.value].join(':');
      downloadName.value = filename
  }
  
  // loads family report data from the families database table and joins and creates a download link for the file
  // Additionally, if the user presses display date ranged, the UI table filters by a cirtain date range specified by start_date and end_date on the date_field
  const loadReports = async () => {
    if(isAdminAdvocate) { 
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
        
        // gathering the family data into an array of family pages and their advocate responsible
        familiesRaw.value = familiesData.value?.all_families as unknown as Family[]

        // loading every single family in the database into the report. This has to be different than families because families is paginated and thus lacks records
        familiesRaw.value.forEach((family: Family)  => { family.Pages?.forEach((pages) => {familyPages.value.push( { ...pages as unknown as Page[], ...family.AdvocateResponsible as any }) })}) //page_first_name: pages.first_name, page_last_name: pages.last_name

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

  const nextPage = async () => {
    if(currentPage.value < ((totalLength.value / dimensions.value) - 1)) {
      currentPage.value++
      awaitloadReports()
    }
  }

  const prevPage = async () => {
    if(currentPage.value != 0) {
      currentPage.value--
      await loadReports()
    }
  }

  // Invoke the initial data loading
  await loadReports();
</script>

<template>
  <div>
    <TitleComp class="border-1 border-black">
      Family Reports
    </TitleComp>
    <br>
    <div
      v-if="date_ranged"
      class="sm:grid-cols-3 py-4 grid"
    >
      <CVLabel>Date Field</CVLabel>
      <div class="sm:col-span-2 sm:mr-11 col-md-8 mx-9">
        <select
          v-model="date_field"
          class="rounded-md outline-0 border-box w-full p-2 bg-white"
          style="border: 1px solid #c4c4c4;"
        >
          Select User Role
          <option>deadline</option>
          <option>start_date</option>
          <option>goal_met_date</option>
        </select>
      </div>
    </div>
    <div
      v-if="date_ranged"
      class="flex gap-5 align-center justify-center"
    >
      <CVLabel>Date Range</CVLabel>
      <CVDatepicker
        v-model="date"
        range
        @update:model-value="currentPage=0; loadReports();"
      />
    </div>
    <h2 class="mt-4 ml-10 border-1 text-[23px] border-black underline">
      Table Dimensions
      <div class="flex flex-box flex-wrap gap-10 w-[450px]">
        <h1 class="ml-1 text-[18px]">
          Number of Table Rows
          <CVInputNumerical v-model="dimensions" />
        </h1>
      </div>
    </h2>
    <h2 class="mt-4 ml-10 text-[18px] underline">
      Fields to Show
    </h2>
    <div class="w-[700px] sm:grid-cols-3 flex flex-box flex-wrap gap-10 stretch grid ml-2">
      <label class="sm:mt-0 mt-4 ml-10 text-md tracking-[0.35px]">
        Duration
        <div class="w-full">
          <input
            v-model="display.duration"
            type="checkbox"
          >
        </div>
      </label>
      <label
        class="sm:mt-0 mt-4 ml-10 text-md"
        style="letter-spacing: 0.35px;"
      >
        Goal Met
        <div>
          <input
            v-model="display.goal_met"
            type="checkbox"
          >
        </div>
      </label>
      <label
        class="sm:mt-0 mt-4 ml-10 text-md"
        style="letter-spacing: 0.35px;"
      >
        Goal Met Date
        <div>
          <input
            v-model="display.goal_met_date"
            type="checkbox"
          >
        </div>
      </label>
      <label
        class="sm:mt-0 mt-4 ml-10 text-md"
        style="letter-spacing: 0.35px;"
      >
        Start Date
        <div>
          <input
            v-model="display.start_date"
            type="checkbox"
          >
        </div>
      </label>
      <label
        class="sm:mt-0 mt-4 ml-10 text-md"
        style="letter-spacing: 0.35px;"
      >
        Amount Owed
        <div>
          <input
            v-model="display.owed"
            type="checkbox"
          >
        </div>
      </label>
      <label class="sm:mt-0 mt-4 ml-10 text-md tracking-[0.35px]">
        Amount Paid Out
        <div>
          <input
            v-model="display.paid"
            type="checkbox"
          >
        </div>
      </label>
      <label class="sm:mt-0 mt-4 ml-10 text-md tracking-[0.35px]">
        Goal Date
        <div>
          <input
            v-model="display.goal_date"
            type="checkbox"
          >
        </div>
      </label>
      <label class="sm:mt-0 mt-4 ml-10 text-md tracking-[0.35px]">
        Donation Goal
        <div>
          <input
            v-model="display.donation_goal"
            type="checkbox"
          >
        </div>
      </label>
    </div>
    <div class="gap-2 justify-center cols-2 mt-16 ml-10 mr-6">
      <div class="flex justify-between">
        <div class="flex items-end pl-3 gap-8 font-bold">
          <div
            :class="{'text-orange-999 underline underline-offset-2 decoration-2': pageFilter === 'active'}"
            @click="pageFilter = 'active'"
          >
            Active
          </div>
          <div
            :class="{'text-orange-999 underline underline-offset-2 decoration-2': pageFilter === 'archived'}"
            @click="pageFilter = 'archived'"
          >
            Archived
          </div>
          <div
            :class="{'text-orange-999 underline underline-offset-2 decoration-2': pageFilter === 'all'}"
            @click="pageFilter = 'all'"
          >
            All
          </div>
        </div>
        <div class="flex justify-end gap-8 mr-16">
          <button
            class="transition h-[50px] text-white font-bold rounded-[125px] duration-300 bg-orange-999 hover:bg-green-600 p-6 px-6 pr-6 pt-3 pb-3 cursor-pointer bg-orange-999"
            @click="date_ranged=!date_ranged; currentPage=0; loadReports()"
          >
            {{ "Display In Date Range" }}
          </button>
          <a
            class="transition h-[50px] text-white font-bold rounded-[100px] duration-300 bg-orange-999 hover:bg-green-600 p-6 px-6 pr-6 pt-3 pb-3 cursor-pointer bg-orange-999"
            :href="filedownloadlink"
            :download="downloadName"
            :dataset.downloadurl="dataset"
          >
            Download
          </a>
        </div>
      </div>
      <table
        v-if="isAdminAdvocate"
        class="mt-[1.25rem] w-full border-spacing-[0] border-collapse"
      >
        <thead style="color: white;">
          <tr>
            <th style="padding: 1rem; background-color: #6eabbf; border-radius: 60px 0 0 0; width: 12%;">
              Page Name
            </th>
            <th style="padding: 1rem; background-color: #6eabbf; width: 12%;">
              Advocate
            </th>
            <th
              v-if="display.duration"
              style="padding: 1rem; background-color: #6eabbf; width: 10%;"
            >
              Duration
            </th>
            <th
              v-if="display.goal_met"
              style="padding: 1rem; background-color: #6eabbf; width: 7%;"
            >
              Goal Met
            </th>
            <th
              v-if="display.goal_met_date"
              style="padding: 1rem; background-color: #6eabbf; width: 10%;"
            >
              Goal Met Date
            </th>
            <th
              v-if="display.start_date"
              style="padding: 1rem; background-color: #6eabbf; width: 12%;"
            >
              Start Date
            </th>
            <th
              v-if="display.owed"
              style="padding: 1rem; background-color: #6eabbf; width: 5%;"
            >
              Owed
            </th>
            <th
              v-if="display.paid"
              style="padding: 1rem; background-color: #6eabbf; width: 5%"
            >
              Paid
            </th>
            <th
              v-if="display.donation_goal"
              style="padding: 1rem; background-color: #6eabbf; width: 5%"
            >
              Goal
            </th>
            <th
              v-if="display.goal_date"
              style="padding: 1rem; background-color: #6eabbf; width: 7%"
            >
              Goal Date
            </th>
            <th style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0; width: 9%;">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(page, i) in (pageFilter === 'all' ? families : families.filter(page => pageFilter === 'active' ? page.status === 'active' : page.status !== 'active'))"
            :key="listOfTagsLen"
            :class="{'bg-gray-200': (i+1) % 2}"
          >
            <td style="text-align: center;">
              {{ page.page_first_name + " " + page.page_last_name }}
            </td>
            <td style="text-align: center;">
              {{ page.Family.AdvocateResponsible ? (page.Family?.AdvocateResponsible?.first_name + " " + page.Family?.AdvocateResponsible?.last_name) : "No Advocate Assigned" }}
            </td>
            <td
              v-if="display.duration"
              style="text-align: center;"
            >
              {{ page.duration }}
            </td>
            <td
              v-if="display.goal_met"
              style="text-align: center;"
            >
              {{ page.donation_status }}
            </td>
            <td
              v-if="display.goal_met_date"
              style="text-align: center;"
            >
              {{ (page.goal_met_date) ? dateFormat(page.goal_met_date, true) : "Goal Not Reached" }}
            </td>
            <td
              v-if="display.start_date"
              style="text-align: center;"
            >
              {{ dateFormat(page.start_date, true) }}
            </td>
            <td
              v-if="display.owed"
              style="text-align: center;"
            >
              {{ donationFormat((page.amount_raised - page.amount_distributed)) }}
            </td>
            <td
              v-if="display.paid"
              style="text-align: center;"
            >
              {{ donationFormat(page.amount_distributed) }}
            </td>
            <td
              v-if="display.donation_goal"
              style="text-align: center;"
            >
              {{ donationFormat(page.donation_goal) }}
            </td>
            <td
              v-if="display.goal_date"
              style="text-align: center;"
            >
              {{ dateFormat(page.deadline) }}
            </td>
            <td style="text-align: center;">
              {{ page.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Pagination Controls -->
  <div class="mb-9 py-7 flex flex-wrap gap-2 place-content-center">
    <div class="col-md-10 px-2 mt-2">                    
      <button @click="prevPage">                         
        &lt;                                             
      </button>                                          
    </div>                                               
    <div class="col-md-10 px-2 mt-2">                    
      <p>{{ currentPage + 1 }}</p>                       
    </div>                                               
    <div class="col-md-10 px-2 mt-2">                    
      <button @click="nextPage">                         
        >                                                
      </button>                                          
    </div>                                               
  </div>                                                 
</template>
