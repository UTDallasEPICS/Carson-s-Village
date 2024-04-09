<script lang="ts" setup>
import type { Image } from '@/types.d.ts'
const props = defineProps<{ images: Image[], profileImage: Image, pageCuid: string }>()
const emit = defineEmits(["images","update:images","profileImage"])
console.log(props.pageCuid)
const previewCuid = ref("")
onMounted(() => {
  previewCuid.value = props.images[0]?.cuid || ""
})

watch(previewCuid, async () => {
  
  if(previewCuid.value == "" && props.images.length != 0){
    previewCuid.value = props.images[0]?.cuid
  }
})

watch(props.images, async () => {
  if(previewCuid.value == "" && props.images.length != 0){
    previewCuid.value = props.images[0]?.cuid
  }
})
const previewImage = computed(() => props.images.find((i:Image)=> i.cuid == previewCuid.value))

const emptyImage = ref<Image>({
  cuid: "",
  url: "",
  pageCuid: ""
})

// Method to remove a single image
const removeImage = async (cuid: string, isPreview: boolean) => {
  if(cuid == previewCuid.value){
    isPreview = true;
  }

  // Confirmation of image deletetion. If no is pressed nothing happens
  if(confirm('Are you sure you want to delete this image?')){
    const theImage = props.images.find((i:Image)=> i.cuid == cuid)
    // todo: change to $fetch
    await useFetch('/api/image', {
    method: 'delete',
    body: (theImage as Image)
    });
    let imagesTemp = props.images.filter((i: Image) => i.cuid != cuid) //todo: replace emit on "images" with this?
    emit("images", props.images.filter((i: Image) => i.cuid != cuid));
    if(isPreview && imagesTemp.length !=0){
        previewCuid.value =  imagesTemp[0].cuid
    } else if(imagesTemp.length === 0){
        emit("profileImage", emptyImage)
        previewCuid.value = ""
    }
    if(theImage?.url === props.profileImage.url &&  imagesTemp.length !=0){
      emit("profileImage", imagesTemp[0])
    }
  }
}

// Method that saves images to the frontend on image upload.
const saveImage = async (theImage: Image) => {
  //emit("update:images", [...props.images, theImage]);
  emit("images", [...props.images, theImage]);
  previewCuid.value = theImage.cuid
  // Creates a profile image for the first image uploaded
  if (props.profileImage.cuid == "") {
    emit("profileImage", theImage);
  }
}
</script>

<template lang="pug">
.information.rounded-md.my-2.text-center(class="sm:text-start text-white bg-blue-999")
    CVLegend Images   
.py-4.grid(class="sm:grid-cols-3") 
    div(v-if="images.length !=0" style='position: relative;') 
        img.cursor-pointer.object-cover.align-middle.rounded-lg(class="w-40 sm:w-64" :src = "previewImage?.url")
        .absolute(style='top: 10px; right: 150px')
            button.bg-red-500(class='w-40 sm:64' style="align-items: center;justify-content: center; line-height: 1;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(previewCuid, true)") x
    a.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Upload
        ImageUpload(@imageUploaded="saveImage" :pageCuid="props.pageCuid")
.py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="images.length!= 0" class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
    div(style="width:1200px" class="")
        div(class="flex" style="overflow-x: auto")
            .div(v-for="(image,i) in images" :key="i" style="flex-shrink: 0; position: relative;") 
                img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-40 sm:w-64" style="margin-right:5px" :src = "image.url" @click="previewCuid = image.cuid")
                .form-horizontal(style='position: absolute; top: 10px; right: 10px')
                    button.bg-red-500(style="align-items: center;justify-content: center;line-height: 2;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(image.cuid, false)") x
</template>

<style scoped></style>
