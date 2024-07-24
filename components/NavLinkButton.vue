<template lang="pug">
NuxtLink.items-center.pt-5.px-2.py-2.text-sm.font-medium.rounded-md.cursor-pointer.no-border.relative(style="text-align:center;" class='text-gray-999 hover:text-black transition duration-300' :to="to" active-class="active")
  span.button-content
    slot
</template>
        
<script setup lang="ts">
const props = defineProps<{ to: string }>()
</script>
        
<style scoped>
  .no-border {
    border: none;
  }

  .relative {
    position: relative;
  }

  .button-content::before {
    content: '';
    position: absolute;
    left: 0;
    top: 55%;
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
        