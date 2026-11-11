<script setup lang="ts">
import type { Image } from '@/types.d.ts'

const props = withDefaults(defineProps<{
  images: Image[]
  /** Autoplay interval and idle resume delay, in ms */
  delay?: number
}>(), {
  delay: 5000
})

const carousel = useTemplateRef('carousel')
const previewOpen = ref(false)
const canNavigate = computed(() => props.images.length > 1)

let resumeTimer: ReturnType<typeof setTimeout> | null = null

function getAutoplay() {
  return carousel.value?.emblaApi?.plugins()?.autoplay
}

function clearResumeTimer() {
  if (resumeTimer !== null) {
    clearTimeout(resumeTimer)
    resumeTimer = null
  }
}

function scheduleResume() {
  if (!canNavigate.value) {
    return
  }
  clearResumeTimer()
  resumeTimer = setTimeout(() => {
    getAutoplay()?.play()
  }, props.delay)
}

function onUserInteract() {
  if (!canNavigate.value) {
    return
  }
  getAutoplay()?.stop()
  scheduleResume()
}

function openPreview() {
  previewOpen.value = true
}

function closePreview() {
  previewOpen.value = false
}

watch(previewOpen, (open) => {
  if (open) {
    clearResumeTimer()
    getAutoplay()?.stop()
    return
  }
  scheduleResume()
})

onBeforeUnmount(() => {
  clearResumeTimer()
})
</script>

<template>
  <div
    v-if="props.images.length > 0"
    class="w-full"
    @pointerdown="onUserInteract"
    @keydown="onUserInteract"
  >
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="props.images"
      :loop="canNavigate"
      :arrows="canNavigate"
      :duration="45"
      :autoplay="canNavigate ? { delay, stopOnInteraction: false } : false"
      :prev="{
        color: 'neutral',
        variant: 'solid',
        class: 'bg-black/70 text-white hover:bg-black/90 ring-0'
      }"
      :next="{
        color: 'neutral',
        variant: 'solid',
        class: 'bg-black/70 text-white hover:bg-black/90 ring-0'
      }"
      :ui="{
        item: 'basis-full ps-0',
        container: 'ms-0',
        prev: 'start-2 sm:start-2',
        next: 'end-2 sm:end-2'
      }"
      class="overflow-hidden rounded-lg"
    >
      <img
        :src="item.url"
        alt=""
        class="block w-full cursor-pointer object-cover bg-gray-100"
        style="aspect-ratio: 4 / 3;"
        loading="lazy"
        @click="openPreview"
      >
    </UCarousel>

    <div
      v-if="previewOpen"
      class="fixed inset-0 z-[1000] block h-full w-full overflow-auto bg-black/80"
      @click.self="closePreview"
    >
      <img
        v-for="image in props.images"
        :key="image.id"
        :src="image.url"
        alt=""
        class="mx-auto my-2 block max-h-[80%] max-w-[80%] py-2"
      >
      <button
        type="button"
        class="absolute top-[15px] right-[35px] cursor-pointer text-[30px] text-gray-400 transition duration-300 hover:text-white focus:text-white"
        aria-label="Close preview"
        @click="closePreview"
      >
        &times;
      </button>
    </div>
  </div>
</template>
