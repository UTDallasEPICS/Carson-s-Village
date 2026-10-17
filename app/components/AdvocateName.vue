<script setup lang="ts">
const props = withDefaults(defineProps<{
  name?: string | null
  isActive?: boolean | null
  emptyLabel?: string
}>(), {
  emptyLabel: 'Not assigned',
})

const displayName = computed(() => {
  const name = props.name?.trim()
  return name || props.emptyLabel
})

const isDeactivated = computed(() => !!props.name?.trim() && props.isActive === false)
</script>

<template>
  <span class="inline-flex items-center justify-center flex-wrap">
    <span :class="{ 'text-gray-500 opacity-70': isDeactivated }">
      {{ displayName }}
    </span>
    <span
      v-if="isDeactivated"
      class="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-red-600"
    >
      Deactivated
    </span>
  </span>
</template>
