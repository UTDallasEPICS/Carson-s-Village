<script lang="ts" setup>
import CVTextArea from './CVTextArea.vue';
import CVInput from './CVInput.vue';
import ActionButton from './ActionButton.vue';

const replyList = ref('');
const name = ref('');
const replyData = ref('');



const submitComment = () => {
    if (!replyList.value || !name.value) {
        alert('Please fill in all fields');
        return;
    }
    // Handle submission logic here, like sending to a backend
    console.log('Comment:', replyList.value);
    console.log('Name:', name.value);
};
</script>

<template lang="pug">
.comment-system.flex.flex-col.items-center(class="sm:mx-4 sm:w-full sm:py-2")
      h2.text-center.mt-4.mb-6.font-bold Leave a Message
      CVTextArea(name='comment' v-model="comment" placeholder='Comments' class="font-normal h-40 w-full")
      .field-row.flex.mt-4.w-full
          CVInput(name='name' v-model="name" placeholder='Name' class="font-normal w-full")     
      .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center.mt-6
          ActionButton.mx-auto.text-md(@click="submitComment") Submit
</template>

<style scoped>
.comment-system {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
  