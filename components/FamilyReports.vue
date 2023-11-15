<template>
  <!-- <div>
    <h2 class="mt-10">Family Reports</h2>
    <div v-if="isLoading" class="spinner-container">
       spinner goes here 
    </div>
    <div v-if="error" class="text-center text-red-600 py-5">
      {{ error }}
    </div>
    <div v-if="!isLoading && !error">
      <table class="mt-5 table table-striped w-full">
         ... thead and tbody here ...
      </table>
    </div>
    <div v-if="!isLoading && !error && !isInfiniteScroll" class="pagination-controls">
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage >= totalPages">Next</button>
    </div>
  </div> -->
</template>

<script lang="ts" setup>
/*import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Family } from '@/types.d.ts';
 //import { fetchData } from '@/services/familyService'; // adjust path as necessary

const familyReports = ref<Family[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(0);
const isInfiniteScroll = ref(false);

const loadReports = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // const data = await fetchData({ page: currentPage.value });
    familyReports.value = currentPage.value === 1 
      ? (data.reports as unknown as Family[]) 
      : [...familyReports.value, ...(data.reports as unknown as Family[])];
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadReports();
  if (isInfiniteScroll.value) {
    window.addEventListener('scroll', handleScroll);
  }
});

const handleScroll = () => {
  // Scroll handling logic
};

watch(currentPage, async () => {
  if (currentPage.value > 1) {
    await loadReports();
  }
});

const goToNextPage = () => {
  // Pagination logic
};

const goToPreviousPage = () => {
  // Pagination logic
};

onUnmounted(() => {
  if (isInfiniteScroll.value) {
    window.removeEventListener('scroll', handleScroll);
  }
}); */
</script>

<style scoped>
/* styles for pagination-controls and spinner-container */
</style>
