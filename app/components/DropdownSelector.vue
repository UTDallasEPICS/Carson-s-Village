<script setup lang="ts">
import type { DropdownItem } from '~~/types.d.ts';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

const props = defineProps<{
  label: string,
  list: DropdownItem[]
}>()
const selectedItemId = defineModel()

const currentItem = computed<DropdownItem>(() => props.list.find((item: DropdownItem) => item.id === selectedItemId.value))
</script>

<template>
  <div class="flex mb-5 items-end gap-5 pr-5">
    <p class="self-center"> {{ props.label }} </p>
    <Listbox as='div' v-model="selectedItemId" class="shadow-sm border border-1 rounded-lg">
      <div class="relative">
        <Transition 
          leave-active-class='transition ease-in duration-100'
          leave-from-class='opacity-100'
          leave-to-class='opacity-0'
        >
          <ListboxOptions as='div' class='w-full absolute z-10 mt-10 bg-white shadow-lg max-h-60 rounded-md px-2 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm' >
            <ListboxOption as='div' v-for="listItem in props.list" :key="listItem.id" :value="listItem.value" class="px-2 border border-grey-500 py-1 my-1"> 
              {{ listItem.optionDisplay }}
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </div>
      <ListboxButton class='text-left bg-white relative rounded-md pl-2 pr-10 py-2 sm:text-sm w-96'> 
        {{ currentItem?.selectionDisplay }}
      </ListboxButton>
    </Listbox>
  </div>
</template>
