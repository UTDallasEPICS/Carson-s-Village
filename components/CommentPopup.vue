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
.container.m-4.place-content-center.font-poppins(class="w-5/6 sm:m-auto sm:py-3")
  .relative
    .absolute(style='position: absolute; top: 10px; right: 10px;')
      button.align-center.justify-center.text-center(style="line-height: 2; color: rgba(0, 0, 0, 0.7) ; font-weight: 300;font-size: 24px; positon: absolute; top:0px; left: 0px; width: 60px; height: 60px; border-radius: 50%; padding-bottom: 4px;" @click="exitCommentPoppup") x
  .pb-8
  .text-s.text-center.ml-4.my-3(class="sm:my-6" style="letter-spacing: 0.35px; font-weight: 600; color: #646464;") {{ comment }}    
</template>

<style scoped></style>
