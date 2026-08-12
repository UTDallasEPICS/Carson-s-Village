<script setup lang="ts">
import { ref, provide } from 'vue';

const props = defineProps<{
  id?: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const isSubmitted = ref(false);
const registeredFields = new Set<{ validate: () => boolean }>();

function registerField(field: { validate: () => boolean }) {
  registeredFields.add(field);
  return () => registeredFields.delete(field);
}

function resetSubmitted() {
  isSubmitted.value = false;
}

provide('cvFormContext', {
  isSubmitted,
  registerField,
  resetSubmitted,
});

function handleSubmit() {
  isSubmitted.value = true;

  let isFormValid = true;
  for (const field of registeredFields) {
    const isValid = field.validate();
    if (!isValid) isFormValid = false;
  }

  if (isFormValid) {
    emit('submit');
  }
}

// Expose handleSubmit so external components can call formRef.value?.submit()
defineExpose({
  submit: handleSubmit,
});
</script>

<template>
  <form
    :id="props.id"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <slot />
  </form>
</template>
