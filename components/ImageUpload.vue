<script lang="ts" setup>

const emit = defineEmits(['update:image-uploaded'])
type imageObject = {
  size: number,
  contentType: string,

}

type imageLinkTypes = {
  uploadUrl: string,
  contentURl: string
}

const imageLinks = ref<imageLinkTypes>({
  uploadUrl: "",
  contentURl: ""
})

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    }
});

const getSignedUrl = async (file: File) => {
  // perform the request to get the presigned url from server (image_upload) and return it
  // the api returns {uploadUrl, contentURl} from image_upload.post.ts
  // upload url gets used to upload the file, the content URL is going to be used to 
  // create an image entry in the database (This is a third api call to image.post.ts)
  try {
    const { data: imageData } = await useFetch('/api/image_upload', {
        method: 'POST',
        body: { size:file.size, contentType: file.type, file }
      })
      imageLinks.value = imageData as unknown as imageLinkTypes
      return imageLinks // return {content-url,}
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get signed URL')
  }
}
// actually uploads images using presigned url to s3 bucket
const uploadFile = async (data: BodyInit, ContentLength:string, ContentType:string, presignedUrl:string, imageLink: string)  => {
  const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
        "Content-Length": ContentLength,
        "Content-Type": ContentType,
      },
        body: data,
      }).then((res) => {
      return res.json()
      })
      //const { uploadUrl, contentUrl } = data
      //return { uploadUrl, contentUrl }

      
      if (!response.ok) {
        throw new Error("Failed to upload data")
      }
      emit('update:image-uploaded', imageLink)
  // do actual upload, after upload finished, emit imageURL*/
  } 
</script>


<template lang ="pug">
input#images.rounded-md.outline-0.border-box.p-2(class="sm:ml-2" style="border: 1px solid #c4c4c4;" type="file"  :value="modelValue" @input="$emit('update:modelValue',$event.target.value)" accept=".png,.jpeg,.jpg,.gif" multiple)
</template>

<script lang = "ts">
export default {
  methods: {
    handleFileUpload(event) {
      const file = event.target?.files[0] as unknown as File;
      //const presign = getSignedUrl(file)
      //const upload = (async() => await uploadFile(file,file.size+"",file.type,(await presign).value.uploadUrl,(await presign).value.contentURl ))
      console.log(`File type: ${file.type}`);
      console.log(`File size: ${file.size} bytes`);
    },
  },
};
</script>