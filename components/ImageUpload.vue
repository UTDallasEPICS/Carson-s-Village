<script lang="ts" setup>
const emit = defineEmits([])
const getSignedUrl = async (file: File) => {
  // perform the request to get the presigned url from server (image_upload) and return it
  // the api returns {uploadUrl, contentURl} from image_upload.post.ts
  // upload url gets used to upload the file, the content URL is going to be used to 
  // create an image entry in the database (This is a third api call to image.post.ts)
  try {
    const { data } = await useFetch('/api/image_upload', {
        method: 'POST',
        body: { size:file.size, contentType: file.type }
      }).then((res) => res.json())
      const { uploadUrl, contentUrl } = data
      return { uploadUrl, contentUrl }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get signed URL')
  }
}
// actually uploads images using presigned url to s3 bucket
const uploadFile = async (data, ContentLength, ContentType, presignedUrl, imageLink: string)  => {
  const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
        "Content-Length": ContentLength,
        "Content-Type": ContentType,
      },
        body: data,
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload data")
      }
      emit('image-uploaded', imageLink)
  // do actual upload, after upload finished, emit imageURL*/
  } 
</script>


<template lang ="pug">
input#images.rounded-md.outline-0.border-box.p-2(class="sm:ml-2" style="border: 1px solid #c4c4c4;" type="file"  accept=".png,.jpeg,.jpg,.gif" multiple)
</template>

<script lang = "ts">
export default {
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      console.log(`File type: ${file.type}`);
      console.log(`File size: ${file.size} bytes`);
    },
  },
};
</script>