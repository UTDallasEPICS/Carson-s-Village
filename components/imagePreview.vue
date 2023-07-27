<script lang="ts" setup>
import type { Image } from '@/types.d.ts'
const props = defineProps<{ images: Image[], selectedImageObject: Image, profileImage: String }>()
/*const props = defineProps({
    images:{
        type: Image[],
        default: []
    },
    selectedImageObject:{
        type: ref<Image>,
        default: ref<Image>({
            cuid: "",
            url: "",
            pageCuid: ""
        })
    },
    profileImage:{
        type: String,
        default: ""
    }
})*/
// create an emit
/*
// Method that calls the backend to handle uploading the image urls to the database
const saveImage = async (theImage: Image) => {
    await useFetch('/api/image', {
        method: 'post',
        body: ({ url: theImage.url, page_cuid: pageCuid.value as string})
    }
    )
    // TODO: Taz look at this
    //props.images.value?.push(theImage)
    emit("update:images", [...props.images, theImage])
    // Creates a selected image for the first image uploaded
    if(props.selectedImageObject.cuid === ""){
        props.selectedImageObject.value = theImage as unknown as Image
        
        //emit("update:images", [...props.images, theImage])
        selectedImageObjCopy = {...props.selectedImageObject.value}
        //emit("update:images", [...props.images, theImage])
    }
    // Creates a profile image for the first image uploaded
    if(props.profileImage === ""){
        props.profileImage = theImage.url 
    }
}

// Method to remove a single image
const removeImage = async (theImage: Image) => {
    // Confirmation of image deletetion. If no is pressed nothing happens
    if(confirm('Are you sure you want to delete this image?')){
    
    for(let i = 0 ; i < (props.images.value?.length as number); i++){
        if((props.images.value?[i].cuid)=== theImage.cuid){
            console.log(i)
            props.images.value?.splice(i, 1)
            if(props.selectedImageObject.value?.cuid === theImage.cuid && props.images.value?.length !=0 ){
                props.selectedImageObject.value.url = props.images.value?[0].url
                props.selectedImageObject.value.cuid = props.images.value?[0].cuid
                props.selectedImageObject.value.pageCuid = props.images.value?[0].pageCuid
                profile_image.value = props.images.value?[0].url
            } else if(props.images.value?.length === 0){
                profile_image.value = ""
                props.selectedImageObject.value?.cuid = ""
                props.selectedImageObject.value?.url = ""
                props.selectedImageObject.value?.pageCuid = ""
            }
            await useFetch('/api/image', {
            method: 'delete',
            body: ({ image : theImage })
            })
            if(theImage.url === props.profileImage && props.images.value?.length !=0){
                props.profileImage = props.images.value[0].url
                data.value.profileImageCuid = props.images.value[0].cuid
            }
            return selectedImageObjCopy = {...props.selectedImageObject.value};
            }
    }
}
}

/*
// Method that uploads an image to replace the image that is on the left, the selected image, and replaces it.
const replaceImage = async (theImage: Image) => {
    console.log(theImage.url)
    console.log("console 1")
    console.log(selectedImageObj.value.url) 
    await useFetch('/api/image', {
        method: 'put',
        body: ({ imageUploaded: theImage, replacedImage: selectedImageObj, page_cuid: pageCuid.value as string })
    }
    )
    if(props.images.value.length === 0){
        props.images.value[0] = theImage
        selectedImageObj.value = theImage
        selectedImageObjCopy = {...selectedImageObj.value}
        data.value.profileImageCuid = theImage.cuid
        profile_image.value = theImage.url
        return;
    }
    for(let i = 0 ; i < props.images.value.length; i++){
        if(props.images.value[i].cuid == selectedImageObj.value.cuid){
            props.images.value[i] = theImage
            break;
        }
    }
    if(selectedImageObj.value.url === profile_image.value){
        data.value.profileImageCuid = props.images.value[0].cuid
        profile_image.value = imageData.value[0].url
    }
    selectedImageObj.value = theImage   
    selectedImageObjCopy = {...selectedImageObj.value}
}

const selectImage = function(theImage: Image){
    props.selectedImageObject.value = theImage as unknown as Image
    selectedImageObjCopy = {...props.selectedImageObject.value}
}*/
</script>

<template lang="pug">
.information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
    CVLegend Image Preview
.py-4.grid.flex-box.flex-row.item-centered.gap-1(v-if="images.length!= 0" class="sm:grid-cols-3" style="line-height: 0px;text-align: center")
    .div(style='position: relative;') 
        img.cursor-pointer.object-cover.align-middle.rounded-lg(class="hover:opacity-1/2 w-40 sm:w-64" :src = "`${selectedImageObject.url}`")
        .form-horizontal(style='position: absolute; top: 10px; right: 150px')
            button.bg-red-500(style="flex;align-items: center;justify-content: center;line-height: 2;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(selectedImageObjCopy)") x
    
    .col-md-8(class="sm:col-span-2 sm:mr-11")
        div(style="width:750px" class="")
            div(class="flex" style="overflow-x: auto")
                .div(v-for="(image,i) in images" :key="i" style="flex-shrink: 0; position: relative;") 
                    img.object-cover.align-middle.rounded-lg.cursor-pointer(class="w-40 sm:w-64" style="margin-right:5px" :src = "`${image.url}`" @click="selectImage(image)")
                    .form-horizontal(style='position: absolute; top: 10px; right: 10px')
                        button.bg-red-500(style="flex;align-items: center;justify-content: center;line-height: 2;text-align: center; color: white; font-weight: 450; positon: absolute; top:0px; left: 0px; width: 30px; height: 2rem; border-radius: 50%; padding-bottom: 4px;" @click = "removeImage(image)") x
</template>

<style scoped></style>
