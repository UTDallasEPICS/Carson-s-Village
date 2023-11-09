<script lang="ts" setup>
import CVTextArea from './CVTextArea.vue';
import CVInput from './CVInput.vue';
import ActionButton from './ActionButton.vue';
import type {Reply} from '@/types.d.ts'

const props = defineProps({
    pageCuid: {
        type: String,
        default: ""
    }, 
    familyCuid: {
        type: String,
        default: ""
    }
})

const replyData = ref<Reply>({
    cuid: "",
    pageCuid: props.pageCuid,
    familyCuid: "",
    name: "",
    reply:"",
})

const submitComment = async () => {
    const response = await useFetch('/api/replies', {
      method: 'POST',
      body: {
        pageCuid: replyData.value.pageCuid,
        familyCuid: replyData.value.familyCuid,
        replyData,
      },
    });
};
</script>

<template lang="pug">
.comment-system.flex.flex-col.items-center(class="sm:mx-4 sm:w-full sm:py-2")
      h2.text-center.mt-4.mb-6.font-bold Leave a Message
      CVTextArea(name='reply' v-model="replyData.reply" placeholder='Replies' class="font-normal h-40 w-full")
      .field-row.flex.mt-4.w-full
          CVInput(name='name' v-model="replyData.name" placeholder='Name' class="font-normal w-full")     
      .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center.mt-6
          ActionButton.mx-auto.text-md(@click="submitComment") Submit
</template>

<style scoped></style>
  