<script lang="ts" setup>
import type { Page, PageDonation } from '@/types.d.ts'

const emit = defineEmits(["ExitComment"])
const props = defineProps({
    comment: {
        type: String,
        default: ""
    }, 
})

const exitCommentPoppup = () => {
    emit("ExitComment")
}
</script>

<template lang="pug">
div(class="container m-4 place-content-center font-poppins w-5/6 sm:m-auto sm:py-3")
  div(class="relative")
    div(class="absolute top-2.5 right-2.5")
      button(class="flex items-center justify-center text-center leading-loose text-black/70 font-light text-2xl absolute top-0 left-0 w-15 h-15 rounded-full pb-1" @click="exitCommentPoppup") x
  div(class="pb-8")
  div(class="text-s text-center ml-4 my-3 sm:my-6 tracking-[0.35px] font-semibold text-[#646464]") {{ comment }}    
</template>

<style scoped></style>
