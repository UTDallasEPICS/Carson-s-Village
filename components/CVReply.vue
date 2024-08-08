
<template lang="pug">
// I removed the `for i` stuff because I want to make an individual Reply component here and will have a for loop that displays everything as it is in where the component is being called
div.reply-box(v-if="r.reply?.length > 0", class="reply-box", style="padding: 1rem; text-align: left; border-bottom: 1px solid black")
div.reply-header(style="font-size: 1rem; font-weight: bold; margin-bottom: 2.5rem; margin-left: 1rem"  ) {{ r.name }}
div.reply-body(style="font-size: 1rem; color: #666; margin-bottom: 2.5rem;") {{ r.reply }}
</template>
  
<script setup lang="ts">
import type {Reply} from '@/types.d.ts'
const props = defineProps<{ r: Reply }>()
</script>
