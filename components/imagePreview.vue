<script lang="ts" setup>
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
.information.rounded-md.mx-9.my-2.text-center(class="sm:text-start text-white bg-blue-999")
    CVLegend Images
.grid.py-4.ml-10(class="sm:grid-cols-3")
    .relative.shrink-0(v-if="images.length !=0") 
        img.cursor-pointer.object-cover.align-middle.rounded-lg(class="w-56" :src = "previewImage?.url")
        .absolute.flex(class="top-2.5 left-44 sm:left-28 md:left-40 lg:left-44")
          button.bg-red-500(style="align-items: center; justify-content: center; line-height: 1;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px; background-color: red;" @click = "removeImage(previewImage, true)") x
    a.pt-1(class="sm:ml-3" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Image Upload
        ImageUpload(@imageUploaded="saveImage" :pageCuid="props.pageCuid")
.py-4.flex-box.flex-row.item-centered.gap-1.ml-10(v-if="images.length!= 0" style="line-height: 0px;text-align: center")
    div(style="width:1200px")
        div.flex(style="overflow-x: auto")
            .relative.shrink-0(v-for="(image,i) in images" :key="i") 
                img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-56" style="margin-right:5px" :src = "image.url" @click="previewCuid = image.cuid")
                .form-horizontal(style='position: absolute; top: 10px; right: 20px')
                    button.bg-red-500(style="align-items: center;justify-content: center;line-height: 2;text-align: center ; color: white; font-weight: 300; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px; background-color:red;" @click = "removeImage(image, false)") x
</template>

<style scoped></style>
