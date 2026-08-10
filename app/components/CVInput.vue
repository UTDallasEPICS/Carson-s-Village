<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

export type ValidationRule = (val: string | undefined) => string | boolean;

const model = defineModel<string>();

const props = withDefaults(
  defineProps<{
    rules?: ValidationRule[];
  }>(),
  {
    rules: () => [],  // factory function to avoid globally shared memory across all CVInput components
  }
);

// Inject form context provided by CVForm
const form = inject<{
  isSubmitted: Ref<boolean>;
  registerField: (field: { validate: () => boolean }) => () => void;
}>('cvFormContext', null);

// Runs rules against current model value
const validationError = computed(() => {
  for (const rule of props.rules) {
    const result = rule(model.value);
    if (typeof result === 'string') return result;
    if (result === false) return 'Invalid value.';
  }
  return '';
});

// Display error ONLY when CVForm submit was attempted
const displayError = computed(() => {
  if (!form?.isSubmitted.value) return '';
  return validationError.value;
});

// Register field with parent CVForm
let unregister: (() => void) | undefined;

onMounted(() => {
  if (form) {
    unregister = form.registerField({
      validate: () => validationError.value === '',
    });
  }
});

onUnmounted(() => {
  unregister?.();
});
</script>

<template lang="pug">
div(class="flex flex-col gap-1 w-full")
  span(
    :style="{ visibility: displayError ? 'visible' : 'hidden' }"
    class="text-red-500 text-xs font-medium"
    role="alert"
  ) {{ displayError }}

  input(
    :class="[
      'rounded-md outline-0 border-box w-full p-2 border-r-2 border',
      displayError ? '!border-red-500 ring-1 ring-red-500' : 'border-grey-600'
    ]"
    v-model="model"
    v-bind="$attrs"
  )
</template>
