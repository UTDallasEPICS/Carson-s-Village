<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{ 
    modelValue: string,
    id: string,
    maxlength?: number,
                         }>()

const emit = defineEmits(["update:modelValue"])
const value = computed({
    get(){
        return props.modelValue
    },
    set(v: string){
        emit("update:modelValue", v)
    },
})

const charCount = computed(() => props.modelValue?.length ?? 0)
const atLimit = computed(() => !!props.maxlength && charCount.value >= props.maxlength)
const nearLimit = computed(() => !!props.maxlength && charCount.value >= props.maxlength * 0.9)
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <textarea
      v-model="value"
      :class="[
        'rounded-md outline-0 border-box w-full p-2 border-r-2 border',
        atLimit
          ? '!border-red-500 ring-1 ring-red-500 focus:outline-none focus:!border-red-700 focus:ring-2 focus:ring-red-700'
          : 'border-grey-600'
      ]"
      :id="id"
      :maxlength="maxlength"
      :aria-describedby="maxlength ? `${id}-count` : undefined"
      v-bind="$attrs"
    />
    <span
      v-if="maxlength"
      :id="`${id}-count`"
      class="self-end text-xs font-medium"
      :class="atLimit ? 'text-red-500' : nearLimit ? 'text-orange-999' : 'text-gray-500'"
      aria-live="polite"
    >{{ charCount }} / {{ maxlength }}</span>
  </div>
</template>

<style scoped>
textarea:user-invalid {
  border-color:red;
}
</style>
