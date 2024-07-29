<script lang="ts" setup>
import CVTextArea from './CVTextArea.vue';
import CVInput from './CVInput.vue';
import ActionButton from './ActionButton.vue';
import type {Reply} from '@/types.d.ts'

const emit = defineEmits(["displayReply"]);

const props = defineProps<{
    pageCuid: string
    familyCuid: string
    replies: Reply[]
}>()

console.log(props.familyCuid)
const replyData = ref<Partial<Reply>>({
    name: "",
    reply:"",
    pageCuid: props.pageCuid,
    familyCuid: props.familyCuid,
    date: undefined
})

const clearSuccessMessage = () => {
    successMessage.value = '';
    replyData.value.name = ""; // Clear name field
    replyData.value.reply = ""; // Clear reply field
}

const successMessage = ref("");
const submitComment = async () => {
    replyData.value.date = new Date()
    const response = await $fetch('/api/replies', {  // look at nuxt documentation for $fetch
      method: 'POST',
      body: {
        pageCuid: props.pageCuid,
        familyCuid: props.familyCuid,
        replyData,
      },
    });
    
    if (response) {
        replyData.value.pageCuid = props.pageCuid;
        replyData.value.familyCuid = props.familyCuid;
        emit('displayReply', {...replyData.value });
        
        //successMessage.value = "Comment submitted successfully!"; // Set success message
        //clearSuccessMessage()
        setTimeout(clearSuccessMessage, 800);
    }
    
};

</script>

<template lang="pug">
.comment-system.flex.flex-col.items-center(class="sm:mx-4 sm:w-full sm:py-2")

      h2.text-center.mt-4.mb-6.font-bold Leave a Message
      .w-full.flex.justify-center
        CVTextArea(name='reply' v-model="replyData.reply" placeholder='Replies' class="font-normal h-40 w-2/3")
      .field-row.flex.justify-center.mt-4.w-full
          CVInput(name='name' v-model="replyData.name" placeholder='Name' class="font-normal w-2/3" )     
      .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center.mt-6
          ActionButton.mx-auto.text-md(@click="submitComment" class="transition duration-300 bg-orange-999 hover:bg-green-600") Submit
      .div(v-if="successMessage" class="mt-4 text-green-500") {{ successMessage }}

</template>

<style scoped></style>
  