<template>
  <div class="dropdown">
    <NuxtLink
      v-if="to && !submenus"
      class="items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer no-border relative"
      :class="buttonClasses"
      :to="to"
      :target="target"
      active-class="active"
      @mouseover="showDropdown"
      @mouseleave="hideDropdown"
    >
      <span class="button-content">
        <slot />
        <span class="caret" v-if="hasSubmenus">⌄</span> <!-- Main tab caret -->
      </span>
      <div
        class="dropdown-content"
        v-if="isDropdownVisible"
        :style="{ minWidth: dropdownMinWidth + 'px' }"
      >
        <template v-for="(submenu, index) in submenus" :key="index">
          <NuxtLink
            v-if="submenu.to"
            :to="submenu.to"
            class="submenu-item"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
          </NuxtLink>
          <div
            v-else
            class="submenu-item"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
            <div
              class="nested-dropdown-content"
              v-if="submenu.submenus && submenu.submenus.length > 0"
              :style="{ minWidth: nestedDropdownMinWidth + 'px', left: '100%', top: '0' }"
              @mouseover="showNestedDropdown(index)"
              @mouseleave="hideNestedDropdown(index)"
            >
              <template v-for="(nestedSubmenu, nestedIndex) in submenu.submenus" :key="nestedIndex">
                <NuxtLink
                  :to="nestedSubmenu.to"
                  class="submenu-item"
                >
                  {{ nestedSubmenu.title }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </template>
      </div>
    </NuxtLink>
    <div
      v-else
      class="items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer no-border relative"
      :class="buttonClasses"
      @mouseover="showDropdown"
      @mouseleave="hideDropdown"
    >
      <span class="button-content">
        <slot />
        <span class="caret" v-if="hasSubmenus">⌄</span> <!-- Main tab caret -->
      </span>
      <div
        class="dropdown-content"
        v-if="isDropdownVisible"
        :style="{ minWidth: dropdownMinWidth + 'px' }"
      >
        <template v-for="(submenu, index) in submenus" :key="index">
          <NuxtLink
            v-if="submenu.to"
            :to="submenu.to"
            class="submenu-item"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
          </NuxtLink>
          <div
            v-else
            class="submenu-item"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
            <div
              class="nested-dropdown-content"
              v-if="submenu.submenus && submenu.submenus.length > 0"
              :style="{ minWidth: nestedDropdownMinWidth + 'px', left: '100%', top: '0' }"
              @mouseover="showNestedDropdown(index)"
              @mouseleave="hideNestedDropdown(index)"
            >
              <template v-for="(nestedSubmenu, nestedIndex) in submenu.submenus" :key="nestedIndex">
                <NuxtLink
                  :to="nestedSubmenu.to"
                  class="submenu-item"
                >
                  {{ nestedSubmenu.title }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  to: String,
  target: String,
  hasSubmenus: Boolean,
  submenus: Array,
  dropdownMinWidth: Number,
  nestedDropdownMinWidth: Number
});

const buttonClasses = ref('text-gray-999 hover:text-black transition duration-300');
const isDropdownVisible = ref(false);
const highlightedSubmenu = ref(null);

const showDropdown = () => {
  if (props.hasSubmenus) {
    isDropdownVisible.value = true;
  }
};

const hideDropdown = () => {
  isDropdownVisible.value = false;
  resetHighlight();
};

const highlightSubmenu = (index) => {
  highlightedSubmenu.value = index;
};

const resetHighlight = () => {
  highlightedSubmenu.value = null;
};

const showNestedDropdown = (index) => {
  highlightedSubmenu.value = index;
};

const hideNestedDropdown = (index) => {
  if (highlightedSubmenu.value === index) {
    highlightedSubmenu.value = null;
  }
};
</script>

<style scoped>
/* Scoped styles for component */

.dropdown-content, .nested-dropdown-content {
  position: absolute;
  font-size: 12px;
  text-align: justify;
  background-color: #f1f1f1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border: 1px solid #ccc;
  display: none; /* Hide initially */
}

.dropdown-content > *, .nested-dropdown-content > * {
  padding: 12px 16px;
  cursor: pointer;
  display: block;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-content > *.submenu-item, .nested-dropdown-content > *.submenu-item {
  color: #333;
}

.dropdown-content > *.submenu-item:hover, .nested-dropdown-content > *.submenu-item:hover {
  background-color: #d3d3d3;
  color: rgb(70, 184, 67);
}

.dropdown-content > *:not(:last-child), .nested-dropdown-content > *:not(:last-child) {
  border-bottom: 1px solid #ccc;
}

.relative:hover .dropdown-content {
  display: block;
}

.submenu-item {
  position: relative; /* Ensure submenu item is positioned relative */
}

.caret {
  position: absolute;
  top: 4px; 
  right: -5px;
}

.submenu-item:hover .nested-dropdown-content {
  display: block;
  position: absolute;
  left: 100%; 
  top: 0; 
}

.highlighted {
  background-color: #333;
  color: rgb(70, 184, 67);
}

.button-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 55%;
  transform: translateY(-50%);
  width: 2px;
  height: 55%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.no-border:hover .button-content::before,
.active .button-content::before {
  background-color: rgb(70, 184, 67);
}
</style>
