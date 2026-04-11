<script lang="ts" setup>
import type {Reply} from '@/types.d.ts'

const emit = defineEmits(["displayReply"]);

const props = defineProps<{
    pageCuid: string
    familyCuid: string
    replies: Reply[]
}>()

const replyData = ref<Partial<Reply>>({
    name: "",
    reply:"",
    date: undefined,
    pageCuid: props.pageCuid,
    familyCuid: props.familyCuid,
})

const clearSuccessMessage = () => {
    replyData.value.date = undefined
    successMessage.value = '';
    replyData.value.name = ""; // Clear name field
    replyData.value.reply = ""; // Clear reply field
}

const successMessage = ref("");
const submitComment = async () => {
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
        replyData.value.date = response.date
        emit('displayReply', {...replyData.value });
        
        //successMessage.value = "Comment submitted successfully!"; // Set success message
        //clearSuccessMessage()
        setTimeout(clearSuccessMessage, 800);
    }
    
};

</script>

<template lang="pug">
div(class="comment-system flex flex-col items-center sm:mx-4 sm:w-full sm:py-2")

      h2(class="text-center mt-4 mb-6 font-bold") Leave a Message
      div(class="flex justify-center w-2/3")
        CVTextArea(id="reply" name='reply' v-model="replyData.reply" placeholder='Replies' class="font-normal h-40 w-full")
      div(class="field-row flex justify-center mt-4 w-2/3")
          CVInput(id="name" name='name' v-model="replyData.name" placeholder='Name' class="font-normal w-2/3" )     
      div(class="ml-4 pt-6 pr-5 flex items-center justify-center mt-6")
          ActionButton(class="mx-auto text-md transition duration-300 bg-orange-999 hover:bg-green-600" @click="submitComment") Submit
      div(v-if="successMessage" class="mt-4 text-green-500") {{ successMessage }}

</template>

<style scoped></style>
  
