<script setup lang="ts">
import { formatPhoneWhileTyping } from '~/utils/formatters';
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

// Two-way binding: converts raw digits to formatted text for display and back
const formattedValue = computed({
  get() {
    return formatPhoneWhileTyping(model.value || '');
  },
  set(v: string) {
    const digits = v.replace(/\D/g, '');
    model.value = digits;
  },
});

const validatePhone: ValidationRule = (val) => {
  // Strip non-digits since CVInput receives the formatted string (e.g. "(123) 456-7890")
  const digits = (val || '').replace(/\D/g, '');

  if (props.required && digits.length === 0) {
    return 'Phone number is required.';
  }

  // return true if not required and no value is passed
  if (digits.length === 0) {
    return true;
  }

  return digits.length === 10 || 'Phone number must have 10 digits.';
};

const phoneRules = computed(() => [validatePhone]);
</script>

<template lang="pug">
CVInput(
  type="tel"
  :rules="phoneRules"
  v-model="formattedValue"
  v-bind="$attrs"
)
</template>
