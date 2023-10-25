<template>
  <div>
    <h2 class="mt-10">Family Reports</h2>

    <div v-if="isLoading" class="spinner-container">
      <!-- spinner goes here, could be a custom component or an image -->
    </div>

    <div v-if="error" class="text-center text-red-600 py-5">
      {{ error }}
    </div>

    <!-- The table for displaying data -->
    <div v-if="!isLoading && !error">
      <table class="mt-5 table table-striped w-full">
        <!-- ... thead and tbody here ... -->
      </table>
    </div>

    <!-- Pagination controls -->
    <div v-if="!isLoading && !error && !isInfiniteScroll" class="pagination-controls">
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage >= totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { fetchData } from "@/services/familyService"; // adjust path as necessary
// ... other imports ...

const familyReports = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0); // server should return this value
const isInfiniteScroll = ref(false); // set to true if I want infinite scrolling

const loadReports = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await fetchData({ page: currentPage.value });
    familyReports.value = currentPage.value === 1 ? data.reports : [...familyReports.value, ...data.reports];
    totalPages.value = data.totalPages; // server should return the total pages
  } catch (err) {
    error.value = err.response?.data?.message || 'An unexpected error occurred.';
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
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }
};

watch(currentPage, () => {
  if (currentPage.value > 1) {
    await loadReports();
  }
});

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onUnmounted(() => {
  if (isInfiniteScroll.value) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
/* styles for pagination-controls and spinner-container */
</style>
