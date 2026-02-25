
<template lang="pug">
// I removed the `for i` stuff because I want to make an individual Reply component here and will have a for loop that displays everything as it is in where the component is being called
div(v-if="r.reply?.length > 0", class="reply-box p-4 text-left border-b border-black")
div(class="reply-header text-base font-bold mb-10 ml-4") {{ r.name }}
div(class="reply-body text-base text-[#666666] mb-10") {{ r.reply }}
</template>
  
<script setup lang="ts">
import type {Reply} from '@/types.d.ts'
const props = defineProps<{ r: Reply }>()
</script>
