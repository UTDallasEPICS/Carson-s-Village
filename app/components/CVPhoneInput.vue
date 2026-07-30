<script setup lang="ts">
import { formatPhoneWhileTyping } from '~/utils/formatters';
import CVInput from './CVInput.vue';

const model = defineModel<string>()
const props = defineProps<{
  id: string,
  required?: string,
}>()

const formattedValue = computed({
  get() {
    return formatPhoneWhileTyping(model.value || '');
  },
  set(v: string) {
    const digits = v.replace(/\D/g, '');
    model.value = digits;
  }
});

</script>

<template lang="pug">
CVInput(
  :id="id"
  :required="required"
  type="tel"
  v-model="formattedValue"
)
</template>
