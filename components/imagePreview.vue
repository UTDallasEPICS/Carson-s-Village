<script lang="ts" setup>
import type { Image } from '@/types.d.ts'
const props = defineProps<{ images: Image[], profileImage: Image }>()
const emit = defineEmits(["update:images","update:profileImage"])


const previewCuid = ref("")
onMounted(() => {
  previewCuid.value = props.images[0]?.cuid || ""
})

const previewImage = computed(() => props.images.find((i:Image)=> i.cuid == previewCuid.value))

const emptyImage = ref<Image>({
  cuid: "",
  url: "",
  pageCuid: ""
})

const removeImage = async (cuid:string, isPreview: boolean) => {
  if(previewImage.value?.cuid === cuid && props.images.length !=0){
      previewCuid.value =  props.images[0].cuid
  } else if(props.images.length === 0){
      emit("update:profileImage", emptyImage)
      previewCuid.value = ""
  }
  const theImage = computed(() => props.images.find((i:Image)=> i.cuid == cuid))
  if(theImage.value?.url === props.profileImage.url && props.images.length !=0){
    emit("update:profileImage", props.images[0])
                //data.value.profileImageCuid = imageData.value[0].cuid
      }
  await useFetch('/api/image', {
    method: 'delete',
    body: ({ cuid })
  });
  // if(previewImage ){ previewCuid.value = props.images[0]}
  // add filter for preview image
  emit("update:images", props.images.filter((i:Image) => i.cuid != cuid));

}

// Method that saves images to the frontend on image upload.
const saveImage = async (theImage: Image) => {
  emit("update:images", props.images.push(theImage));
  // Creates a profile image for the first image uploaded
  if (!props.profileImage) {
    emit("update:profileImage", theImage.cuid);
  }
}
</script>

<template lang="pug">
.information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
    CVLegend Image Preview
.py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="images.length!= 0" class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
    .div(style='position: relative;') 
        img.cursor-pointer.object-cover.align-middle.rounded-lg(class="hover:opacity-1/2 w-40 sm:w-64" :src="previewImage?.url")
        .form-horizontal(style='position: absolute; top: 10px; right: 150px')
            button.bg-red-500(style="align-items: center;justify-content: center;line-height: 2;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click="removeImage(previewCuid)") x
    
    .col-md-8(class="sm:col-span-2 sm:mr-11")
        div(style="width:750px" class="")
            div(class="flex" style="overflow-x: auto")
                .div(v-for="(image,i) in images" :key="i" style="flex-shrink: 0; position: relative;") 
                    img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-40 sm:w-64" style="margin-right:5px" :src="image.url" @click="previewCuid = image.cuid")
                    .form-horizontal(style='position: absolute; top: 10px; right: 10px')
                        button.bg-red-500(style="align-items: center;justify-content: center;line-height: 2;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click="removeImage(image.cuid)") x

.information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
    CVLegend Images   
.py-4.grid(class="sm:grid-cols-3") 
    div(v-if="images.length !=0" style='position: relative;') 
        img.cursor-pointer.object-cover.align-middle.rounded-lg(class="hover:opacity-1/2 w-40 sm:w-64" :src = "previewImage?.url")
        .absolute(style='top: 10px; right: 150px')
            button.bg-red-500(class='w-40 sm:64' style="align-items: center;justify-content: center;line-height: 1;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(previewCuid)") x
    a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") image upload
        ImageUpload(@imageUploaded="saveImage")
.py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="images.length!= 0" class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
    div(style="width:1200px" class="")
        div(class="flex" style="overflow-x: auto")
            .div(v-for="(image,i) in images" :key="i" style="flex-shrink: 0; position: relative;") 
                img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-40 sm:w-64" style="margin-right:5px" :src = "image.url" @click="previewCuid = image.cuid")
                .form-horizontal(style='position: absolute; top: 10px; right: 10px')
                    button.bg-red-500(style="align-items: center;justify-content: center;line-height: 2;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(image.cuid)") x
</template>

<style scoped></style>
