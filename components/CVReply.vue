<template lang="pug">
div
      div(v-for="(reply, i) in replies", :key="i", class="reply-box", v-if="!(reply.suspended) || isAdvocateAdmin")
        div(v-if="reply.reply.length > 0", class="reply-box", style="padding: 1rem; text-align: left; border-bottom: 1px solid black")
          div.reply-header(style="font-size: 1rem; font-weight: bold; margin-bottom: 2.5rem; margin-left: 1rem") {{ reply.name }}
          div.reply-body(style="font-size: 1rem; color: #666; margin-bottom: 2.5rem;") {{ reply.reply }}
      div(v-for="(reply, i) in replies", :key="i")
</template>
  
<script setup lang="ts">

  defineProps({
    replies: Array,
    isAdvocateAdmin: Boolean, //something with cvuser.role
  })

</script>