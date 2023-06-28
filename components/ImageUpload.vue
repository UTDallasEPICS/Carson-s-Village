<script lang="ts" setup>
import type { Image } from '../types.d.ts';

// TODO: this component needs to handle getting the presigned url (which should also create an Image entry in the database), performing the upload, and then emitting the Image object (not the file) so that
// the parent component can add it to its list
// when saving a page, we ignore the images array
// page editor can select from currently uploaded images to pick the cuid of the one to use as profile image
// we dont need model value because we arent binding to a variable, we are emitting an event with the data
const emit = defineEmits(['imageUploaded']);

type imageLinkTypes = {
  uploadUrl: string,
  image: Image
}
// we need to know what page we are adding images to
const props = defineProps({
    page: {
        type: String,
        default: "",
    }
});


// actually uploads images using presigned url to s3 bucket
const onFile = async (event: Event) => {
  const file = event?.target?.files[0];

  // TODO: this needs to be modified so that the API call also creates an image in the database
  const { data: imageData } = await useFetch('/api/image_upload', {
    method: 'POST',
    body: { size: file.size, contentType: file.type, file }
  });
  const { uploadUrl, image} = imageData as unknown as imageLinkTypes;
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
    "Content-Length": file.size,
    "Content-Type": file.type,
  },
    body: file,
  })
  if (!response.ok) {
    throw new Error("Failed to upload data")
  }
  // TODO: parent component adds this image to its list of images
  emit('imageUploaded', image)
  } 
</script>


<template lang="pug">
input#images.rounded-md.outline-0.border-box.p-2(
  class="sm:ml-2" 
  style="border: 1px solid #c4c4c4;" 
  type="file"  
  @change="onFile"
  accept=".png,.jpeg,.jpg,.gif" multiple)
</template>