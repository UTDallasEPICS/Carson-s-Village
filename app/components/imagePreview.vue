<script lang="ts" setup>
import { dateFormat, donationFormat } from '@/utils'
import type { User, Page, Image } from '@/types.d.ts'
import { authClient } from '~/utils/auth-client';

const { data } = await authClient.useSession(useFetch);
const user = computed(() => data.value?.user || null)

const props = defineProps<{ images: Image[], pageCuid: string }>()
const emit = defineEmits(["update:images"])

// Method to remove a single image
const removeImage = async (image: Image) => {
  // Confirmation of image deletetion. If no is pressed nothing happens
  if(confirm('Are you sure you want to delete this image?')){
    await $fetch('/api/image', {
      method: 'delete',
      body: (image as Image)
    });
    let imagesTemp = props.images.filter((i: Image) => i.id != image.id)
   //todo: replace emit on "images" with this?
    emit("update:images", props.images.filter((i: Image) => i.id != image.id));
  }
}

// Method that saves images to the frontend on image upload.
const saveImage = async (theImage: Image) => {
  emit("update:images", [...props.images, theImage]);
}
</script>

<template lang="pug">
div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
    CVLegend Images
div(class="grid py-4 ml-10 sm:grid-cols-3")
  a(class="pt-1 sm:ml-3 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Image Upload
      ImageUpload(@imageUploaded="saveImage" :pageCuid="props.pageCuid")
div(
  class="py-4 flex flex-row items-center gap-1 ml-10 leading-none text-center"
  v-if="images.length!= 0"
)
    div(class="w-[1200px]")
        div(class="flex overflow-x-auto")
            div(
              class="relative shrink-0" 
              v-for="(image,i) in images" :key="i"
            ) 
                img(
                  class="object-cover align-middle rounded-lg cursor-pointer w-56 mr-1.5" 
                  :src = "image.url" 
                )
                div(class="form-horizontal absolute top-2.5 right-5")
                    button(class="bg-red-500 flex items-center justify-center leading-loose text-center text-white font-light absolute top-0 left-0 w-[30px] h-8 rounded-full pb-1" @click = "removeImage(image)") x
</template>
