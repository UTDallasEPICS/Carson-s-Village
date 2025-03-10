<script setup lang="ts">
import multiselect from 'vue-multiselect'
import type { User, Family } from '@/types.d.ts'
const props = defineProps<{ modelValue: Family[], options: Family[] }>()
const emit = defineEmits(["update:modelValue"])

const value = computed<Family[]>({
    get(): Family[] {
        return props.modelValue
    },
    set(v: Family[]) {
        emit("update:modelValue", v)
    },
})

const family_name_with_has_advocate = (family: Family) => {

    return `${family.family_name} (${family.AdvocateResponsible ? 'assigned' : 'unassigned'})`
}
</script>

<template lang="pug">
multiselect.p-2(placeholder="Select Families" :multiple="true" open-direction="bottom" track-by="family_name" :custom-label="family_name_with_has_advocate" :close-on-select="false" :clear-on-select="false" :options="props.options" v-model="value")
    template(#selection="{ values, search, isOpen }")
        span(class="multiselect__single"
              v-if="values.length"
              v-show="!isOpen") {{ values.length }} Families
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>