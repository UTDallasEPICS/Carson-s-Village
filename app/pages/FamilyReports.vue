<script setup lang='ts'>
  // todo: add number of family family pages an advocate is responsible, total amount raised by the families an advocate is responsible for
  //import { Family } from '@prisma/client'; 
  import type { Family, User } from '@/types.d.ts'
  import type { Page } from '~~/prisma/generated/models'
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { authClient } from '~/utils/auth-client';
  import { downloadFamilyReport } from '~/utils/reports';

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
  
  const listOfTags = ref(["donation_goal", "amount_raised", "deadline", "donation_status", "duration", "start_date", "goal_met_date", "page_first_name", "page_last_name", "first_name", "middle_name", "last_name"])
  // computed variable used as a key for each element of the table so that the striping of the table re-renders when the table is resized.
  const listOfTagsLen = computed(() => listOfTags.value?.length)
  const rowCountOptions = [20, 50, 100]
  const dimensions = ref(20)
  const columnOptions = [
    { key: 'duration', label: 'Duration' },
    { key: 'goal_met', label: 'Goal Met' },
    { key: 'goal_met_date', label: 'Goal Met Date' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'donated', label: 'Amount Donated' },
    { key: 'goal_date', label: 'Goal Date' },
    { key: 'donation_goal', label: 'Donation Goal' },
  ] as const
  const date_ranged = ref(false)
  const date = ref([startDate, endDate])
  date.value = [startDate, endDate]
  const date_field = ref("start_date")
  type DisplayReport = {
    duration: boolean,
    goal_date: boolean,
    goal_met: boolean,
    goal_met_date: boolean,
    donated: boolean,
    donation_goal: boolean,
    start_date: boolean,
  }

  const display = ref<DisplayReport>({
    duration: true,
    goal_met: true,
    goal_met_date: true,
    goal_date: true,
    start_date: true,
    donated: true,
    donation_goal: true
  })

  // todo: improve performance (we do not want to rebuild the list everytime).
  // selects the list of tags to show in the report
  watch(display, () => {
    listOfTags.value = []
    if(display.value.donation_goal) {
      listOfTags.value.push("donation_goal")
    }
    if(display.value.donated) {
      listOfTags.value.push("amount_raised")
    }
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
    console.log(listOfTagsLen.value)
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

  // loads family report data from the families database table and joins pages to the advocate responsible
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

        familyPages.value = []
        // loading every single family in the database into the report. This has to be different than families because families is paginated and thus lacks records
        familiesRaw.value?.forEach((family: Family)  => { family.Pages?.forEach((pages) => {familyPages.value.push( { ...pages as unknown as Page[], ...family.AdvocateResponsible as any }) })}) //page_first_name: pages.first_name, page_last_name: pages.last_name
    }
  }

  const nextPage = async () => {
    if(currentPage.value < ((totalLength.value / dimensions.value) - 1)) {
      currentPage.value++
      await loadReports()
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
    <div class="gap-2 justify-center cols-2 mt-6 ml-10 mr-6">
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
        <div class="flex justify-end items-center gap-4 mr-16">
          <Popover class="relative">
            <PopoverButton class="rounded-md border border-[#c4c4c4] bg-white px-3 py-2 text-sm font-bold">
              Columns
            </PopoverButton>
            <PopoverPanel class="absolute right-0 z-20 mt-2 w-56 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5">
              <label
                v-for="option in columnOptions"
                :key="option.key"
                class="flex items-center gap-2 py-1 text-sm"
              >
                <input
                  v-model="display[option.key]"
                  type="checkbox"
                >
                {{ option.label }}
              </label>
            </PopoverPanel>
          </Popover>
          <button
            class="transition text-white font-bold rounded-[125px] duration-300 bg-orange-999 hover:bg-green-600 px-6 py-2 cursor-pointer bg-orange-999"
            @click="date_ranged=!date_ranged; currentPage=0; loadReports()"
          >
            Date Range
          </button>
          <button
            type="button"
            class="transition text-white font-bold rounded-[100px] duration-300 bg-orange-999 hover:bg-green-600 px-6 py-2 cursor-pointer border-0 bg-orange-999"
            @click="downloadFamilyReport(familyPages)"
          >
            Download
          </button>
        </div>
      </div>
      <div
        v-if="isAdminAdvocate"
        class="report-scroll mt-[1.25rem]"
      >
      <table
        class="w-full border-spacing-[0] border-collapse"
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
              v-if="display.donated"
              style="padding: 1rem; background-color: #6eabbf; width: 5%;"
            >
              Donated
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
            v-for="(page, i) in (pageFilter === 'all' ? families : families?.filter(page => pageFilter === 'active' ? page.status === 'active' : page.status !== 'active'))"
            :key="listOfTagsLen"
            :class="{'bg-gray-200': (i+1) % 2}"
          >
            <td style="text-align: center;">
              {{ page.page_first_name + " " + page.page_last_name }}
            </td>
            <td style="text-align: center;">
              <AdvocateName
                :name="page.Family?.AdvocateResponsible?.name"
                :is-active="page.Family?.AdvocateResponsible?.isActive"
                empty-label="No Advocate Assigned"
              />
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
              {{ page.donation_goal > 0 ? page.donation_status : "No Goal" }}
            </td>
            <td
              v-if="display.goal_met_date"
              style="text-align: center;"
            >
              {{ page.donation_goal > 0
                ? (page.goal_met_date ? dateFormat(page.goal_met_date, true) : "Not Met")
                : "No Goal" }}
            </td>
            <td
              v-if="display.start_date"
              style="text-align: center;"
            >
              {{ dateFormat(page.start_date, true) }}
            </td>
            <td
              v-if="display.donated"
              style="text-align: center;"
            >
              {{ donationFormat(page.amount_raised) }}
            </td>
            <td
              v-if="display.donation_goal"
              style="text-align: center;"
            >
              {{ donationGoalFormat(page.donation_goal) }}
            </td>
            <td
              v-if="display.goal_date"
              style="text-align: center;"
            >
              {{ dateFormat(page.deadline, true) }}
            </td>
            <td style="text-align: center;">
              {{ page.status }}
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
  
  <!-- Pagination Controls -->
  <div class="mb-9 py-7 flex flex-wrap items-center gap-4 place-content-center">
    <label class="flex items-center gap-2 text-sm">
      Rows
      <select
        v-model.number="dimensions"
        class="rounded-md border border-[#c4c4c4] bg-white px-2 py-1"
      >
        <option
          v-for="count in rowCountOptions"
          :key="count"
          :value="count"
        >
          {{ count }}
        </option>
      </select>
    </label>
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

<style scoped>
.report-scroll {
  max-height: 32rem;
  overflow: auto;
}

.report-scroll thead th {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
