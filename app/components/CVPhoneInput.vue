<script setup lang="ts">
import type { ValidationRule } from './CVInput.vue';
import { formatPhoneWhileTyping } from '~/utils/formatters';

const model = defineModel<string>();

const props = withDefaults(
  defineProps<{
    required?: boolean;
  }>(),
  {
    required: false,
  }
);

const formattedValue = computed(() => {
  return formatPhoneWhileTyping(model.value || '');
});

function onInput(event: Event) {
  const inputEl = event.target as HTMLInputElement;

  // 1. Extract up to 10 raw digits
  const digits = inputEl.value.replace(/\D/g, '').slice(0, 10);

  // 2. Update model
  model.value = digits;

  // 3. Force the DOM input value to update immediately, wiping away non-digits
  inputEl.value = formatPhoneWhileTyping(digits);
}

const validatePhone: ValidationRule = (val) => {
  const digits = (val || '').replace(/\D/g, '');

  if (props.required && digits.length === 0) {
    return 'Phone number is required.';
  }

  if (digits.length === 0) {
    return true;
  }

  return digits.length === 10 || 'Phone number must have 10 digits.';
};

const phoneRules = computed(() => [validatePhone]);
</script>

<template>
  <CVInput
    v-model="formattedValue"
    type="tel"
    maxlength="14"
    :rules="phoneRules"
    v-bind="$attrs"
    @input="onInput"
  />
</template>
