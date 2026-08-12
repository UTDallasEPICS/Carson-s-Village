<script setup lang="ts">
import type { ValidationRule } from './CVInput.vue';

const model = defineModel<string>();

const props = withDefaults(
  defineProps<{
    required?: boolean;
  }>(),
  {
    required: false,
  }
);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail: ValidationRule = (val) => {
  const value = (val || '').trim();

  if (props.required && !value) {
    return 'Email address is required.';
  }

  // return true if not required and no value is passed
  if (!value) {
    return true;
  }

  return EMAIL_REGEX.test(value) || 'Please enter a valid email address.';
};

const emailRules = computed(() => [validateEmail]);
</script>

<template>
  <!-- Passes native attributes (placeholder, id, autocomplete, etc.) down to CVInput -->
  <CVInput
    v-model="model"
    type="email"
    :rules="emailRules"
    v-bind="$attrs"
  />
</template>
