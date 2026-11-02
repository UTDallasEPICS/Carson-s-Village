<template>
  <div
    class="dropdown"
    @mouseleave="hideDropdown"
    @mouseover="showDropdown"
  >
    <NuxtLink
      v-if="to && !submenus"
      class="nav-trigger items-center px-2 py-1 text-base font-semibold uppercase rounded-md cursor-pointer relative no-border text-gray-999"
      :class="buttonClasses"
      :to="to"
      target="_blank"
      active-class="active"
    >
      <span class="button-content">
        <slot />
        <ChevronDownIcon
          v-if="hasSubmenus"
          class="caret"
          aria-hidden="true"
        />
      </span>
      <div
        v-if="isDropdownVisible"
        class="dropdown-content"
        :style="{ minWidth: dropdownMinWidth + 'px' }"
      >
        <template
          v-for="(submenu, index) in submenus"
          :key="index"
        >
          <NuxtLink
            v-if="submenu.to && !hasNested(submenu)"
            class="submenu-item"
            :to="submenu.to"
            target="_blank"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
          </NuxtLink>
          <div
            v-else
            class="submenu-item has-children"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            <span class="submenu-label">{{ submenu.title }}</span>
            <ChevronRightIcon
              class="submenu-caret"
              aria-hidden="true"
            />
            <div
              v-if="hasNested(submenu)"
              class="nested-dropdown-content"
              :style="{ minWidth: nestedDropdownMinWidth + 'px' }"
              @mouseover="showNestedDropdown(index)"
              @mouseleave="hideNestedDropdown(index)"
            >
              <NuxtLink
                v-for="(nestedSubmenu, nestedIndex) in submenu.submenus"
                :key="nestedIndex"
                class="submenu-item"
                :to="nestedSubmenu.to"
                target="_blank"
              >
                {{ nestedSubmenu.title }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </NuxtLink>
    <div
      v-else
      class="nav-trigger items-center px-2 py-1 text-base font-semibold uppercase rounded-md cursor-pointer relative no-border text-gray-999"
      :class="buttonClasses"
      @mouseover="showDropdown"
      @mouseleave="hideDropdown"
    >
      <span class="button-content text-nowrap">
        <slot />
        <ChevronDownIcon
          v-if="hasSubmenus"
          class="caret"
          aria-hidden="true"
        />
      </span>
      <div
        v-if="isDropdownVisible"
        class="dropdown-content"
        :style="{ minWidth: dropdownMinWidth + 'px' }"
      >
        <template
          v-for="(submenu, index) in submenus"
          :key="index"
        >
          <NuxtLink
            v-if="submenu.to && !hasNested(submenu)"
            class="submenu-item"
            :to="submenu.to"
            target="_blank"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            {{ submenu.title }}
          </NuxtLink>
          <div
            v-else
            class="submenu-item has-children"
            @mouseover="highlightSubmenu(index)"
            @mouseleave="resetHighlight"
          >
            <span class="submenu-label">{{ submenu.title }}</span>
            <ChevronRightIcon
              class="submenu-caret"
              aria-hidden="true"
            />
            <div
              v-if="hasNested(submenu)"
              class="nested-dropdown-content"
              :style="{ minWidth: nestedDropdownMinWidth + 'px' }"
              @mouseover="showNestedDropdown(index)"
              @mouseleave="hideNestedDropdown(index)"
            >
              <NuxtLink
                v-for="(nestedSubmenu, nestedIndex) in submenu.submenus"
                :key="nestedIndex"
                class="submenu-item"
                :to="nestedSubmenu.to"
                target="_blank"
              >
                {{ nestedSubmenu.title }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

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

const hasNested = (submenu) => Array.isArray(submenu?.submenus) && submenu.submenus.length > 0;

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
.nav-trigger {
  display: inline-flex;
}

.dropdown-content, .nested-dropdown-content {
  position: absolute;
  font-size: 12px;
  text-align: left;
  text-transform: none;
  font-weight: 400;
  background-color: #f1f1f1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 50;
  border: 1px solid #ccc;
  display: none;
  top: 100%;
  left: 0;
}

.dropdown-content > .submenu-item,
.nested-dropdown-content > .submenu-item {
  padding: 10px 14px;
  cursor: pointer;
  display: block;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-content > .submenu-item.has-children {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.submenu-label {
  flex: 1;
  min-width: 0;
}

.submenu-caret {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #666;
  transition: color 0.3s;
}

.dropdown-content > .submenu-item:hover,
.nested-dropdown-content > .submenu-item:hover {
  background-color: #d3d3d3;
  color: rgb(70, 184, 67);
}

.dropdown-content > .submenu-item:hover .submenu-caret {
  color: rgb(70, 184, 67);
}

.dropdown-content > .submenu-item:not(:last-child),
.nested-dropdown-content > .submenu-item:not(:last-child) {
  border-bottom: 1px solid #ccc;
}

.relative:hover .dropdown-content {
  display: block;
}

.submenu-item {
  position: relative;
}

.caret {
  width: 1em;
  height: 1em;
  margin-left: 4px;
  flex-shrink: 0;
}

.submenu-item:hover > .nested-dropdown-content {
  display: block;
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: -1px;
}

.highlighted {
  background-color: #333;
  color: rgb(70, 184, 67);
}

.button-content {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.button-content::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background-color: transparent;
  transition: background-color 0.3s;
}

.no-border:hover .button-content::before,
.active .button-content::before {
  background-color: rgb(70, 184, 67);
}
</style>
