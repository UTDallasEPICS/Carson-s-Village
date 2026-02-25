<script lang="ts" setup>
import { dateFormat, donationFormat } from '@/utils'
import type { User, Page, Image } from '@/types.d.ts'
const props = defineProps<{ images: Image[], profileImage: Image, pageCuid: string }>()
const emit = defineEmits(["images","update:images","profileImage"])
const previewCuid = ref("")
type UserWithFamily = {
    cuid: string
    first_name: string,
    last_name: string,
    user_role: string,
    email: string,
    middle_name: string,
    phone: string,
    Pages: Page[],
    Family: {
        cuid: string,
        family_name: string,
        stripe_account_id: string,
        created_at: string,
        updated_at: string,
        FamilyMembers: [],
        FamilyDonationPayouts: [],
        Pages: [],
        AdvocateResponsible: User,
        FamilyDonations: [],
        advocateCuid: ""
    }
}
const cvuser = useCookie<UserWithFamily>('cvuser')

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
const previewImage = computed(() => props.images.find((i:Image) => i.cuid == previewCuid.value))

const emptyImage = ref<Image>({
  cuid: "",
  url: "",
  pageCuid: ""
})

// Method to remove a single image
const removeImage = async (image: Image, isPreview: boolean) => {
  if(image.cuid == previewCuid.value){
    isPreview = true;
  }
  // move imagesTemp declaration outside of the confirm block for performance?

  // Confirmation of image deletetion. If no is pressed nothing happens
  if(confirm('Are you sure you want to delete this image?')){
    await $fetch('/api/image', {
    method: 'delete',
    body: (image as Image)
    });
    let imagesTemp = props.images.filter((i: Image) => i.cuid != image.cuid)
     //todo: replace emit on "images" with this?
    emit("images", props.images.filter((i: Image) => i.cuid != image.cuid));
    if(isPreview && imagesTemp.length != 0){
        previewCuid.value =  imagesTemp[0].cuid
    } else if(imagesTemp.length === 0){
        emit("profileImage", emptyImage)
        previewCuid.value = ""
    }
    if(image?.url === props.profileImage.url &&  imagesTemp.length !=0){
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
div(class="information rounded-md mx-9 my-2 text-center sm:text-start text-white bg-blue-999")
    CVLegend Images
div(class="grid py-4 ml-10 sm:grid-cols-3")
    div(class="relative shrink-0" v-if="images.length !=0") 
        img(class="cursor-pointer object-cover align-middle rounded-lg w-56" :src = "previewImage?.url")
        div(class="absolute flex top-2.5 left-44 sm:left-28 md:left-40 lg:left-44")
          button(class="bg-red-500 flex items-center justify-center leading-none text-center text-white font-[450] absolute top-0 left-0 w-[30px] h-8 rounded-full pb-1" @click = "removeImage(previewImage, true)") x
    a(class="pt-1 sm:ml-3 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.25)]") Image Upload
        ImageUpload(@imageUploaded="saveImage" :pageCuid="props.pageCuid")
div(class="py-4 flex flex-row items-center gap-1 ml-10 leading-none text-center" v-if="images.length!= 0")
    div(class="w-[1200px]")
        div(class="flex overflow-x-auto")
            div(class="relative shrink-0" v-for="(image,i) in images" :key="i") 
                img(class="object-cover align-middle rounded-lg cursor-pointer w-56 mr-1.5" :src = "image.url" @click="previewCuid = image.cuid")
                div(class="form-horizontal absolute top-2.5 right-5")
                    button(class="bg-red-500 flex items-center justify-center leading-loose text-center text-white font-light absolute top-0 left-0 w-[30px] h-8 rounded-full pb-1" @click = "removeImage(image, false)") x
</template>

<style scoped></style>
