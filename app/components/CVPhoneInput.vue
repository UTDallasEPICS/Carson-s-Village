<script setup lang="ts">
import CVInput from './CVInput.vue';

const model = defineModel<string>()
const props = defineProps<{
  id: string,
  required?: string,
}>()

const formattedValue = computed({
  get() {
    let digits = (model.value || '').replace(/\D/g, '');
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) {
      return '';
    }
    const parts = [match[1], match[2], match[3]].filter(Boolean);
    if (parts.length <= 1) {
        return parts.join('');
    }
    if (parts.length === 2) {
        if (match[1].length === 3) {
            return `(${match[1]}) ${match[2]}`;
        }
        return `(${match[1]}${match[2]}`;
    }
    if (parts.length === 3) {
        if (match[2].length === 3) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return `(${match[1]}) ${match[2]}${match[3]}`;
    }
    return '';
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
