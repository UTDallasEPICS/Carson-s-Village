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

const replyData = ref<Partial<Reply>>({
    name: "",
    reply:"",
    pageCuid: "",
    familyCuid:"",
})

const clearSuccessMessage = () => {
    successMessage.value = '';
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
        emit('displayReply', replyData.value);
        // replyData.value.name = ""; // Clear name field
        // replyData.value.reply = ""; // Clear reply field
        // need to find a way to clear fields after submitting a response without messing up the emitted data
        
        successMessage.value = "Comment submitted successfully!"; // Set success message

        setTimeout(clearSuccessMessage, 3000);
    }
    
};

</script>

      CVTextArea(name='reply' v-model="replyData.reply" placeholder='Replies' class="font-normal h-40 w-full")
      .field-row.flex.mt-4.w-full
          CVInput(name='name' v-model="replyData.name" placeholder='Name' class="font-normal w-full")     
      .col-md-8.ml-4.pt-6.pr-5.flex.items-center.justify-center.mt-6
          ActionButton.mx-auto.text-md(@click="submitComment") Submit
      .div(v-if="successMessage" class="mt-4 text-green-500") {{ successMessage }}
</template>

<style scoped></style>
  