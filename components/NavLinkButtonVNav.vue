<template lang="pug">
NuxtLink.items-center.text-sm.font-medium.rounded-md.cursor-pointer.no-border.relative(style="text-align: center; overflow: visible;" class='text-gray-999 hover:text-black transition duration-300' :to="to" active-class="active")
  span.button-content
    slot
</template>
        
<script setup lang="ts">
const props = defineProps<{ to: string }>()
</script>
        
<style scoped>
  .button-content::before {
    content: '';
    position: absolute;
    left: 80px;
    top: 12px;
    transform: translateY(-16px);
    width: 2px;
    height: 25px;
    background-color: transparent;
    transition: background-color 0.3s;
  }

  .no-border:hover .button-content::before,
  .active .button-content::before {
    background-color: rgb(70, 184, 67);
  } 
</style>
        