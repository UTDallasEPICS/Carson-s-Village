<script lang="ts" setup>
import type { Image } from '../types.d.ts';

// This component handles getting the presigned url (which should also create an Image entry in the database), performing the upload, and then emitting the Image object (not the file) so that
// the parent component can add it to its list
// when saving a page, we ignore the images array
// page editor can select from currently uploaded images to pick the cuid of the one to use as profile image
// we dont need model value because we arent binding to a variable, we are emitting an event with the data
const emit = defineEmits(['imageUploaded']);

type imageLinkTypes = {
  uploadUrl: string,
  image: Image
}

const props = defineProps<{pageCuid: string}>()
console.log(props.pageCuid)
// uploads images using presigned url to S3 bucket
const onFile = async (event: Event) => {
  const Files = event?.target?.files
  for(let i = 0 ; i < Files.length; i++){
    const file = Files[i];
    // Creates the presigned url and enters the image into the database
    // todo: change to $fetch
    const imageDataObj = {
      contentLength: file.size, 
      contentType: file.type, 
      pageCuid: props.pageCuid
    }
    const imageData = await $fetch('/api/image_upload', {
      method: 'POST',
      body: imageDataObj
    });
  const { uploadUrl, image } = imageData as unknown as imageLinkTypes;

  // Executing the image upload by using the presigned url and file as well as its size and type in the request
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
    "Content-Length": file.size,
    "Content-Type": file.type,
  },
    body: file,
  })
  if (!response.ok) {
    console.log("Failed to upload a file")
    throw new Error("Failed to upload data")  
  }

  emit('imageUploaded', image)
  }
} 
</script>


<template lang="pug">
input#images.rounded-md.outline-0.border-box.p-2( 
  style="border: 1px solid #c4c4c4;" 
  type="file"  
  @change="onFile"
  accept=".png,.jpeg,.jpg,.gif" multiple)
</template>
