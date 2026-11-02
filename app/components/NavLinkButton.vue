<template>
  <NuxtLink
    class="nav-trigger items-center px-2 py-1 text-base font-semibold uppercase rounded-md cursor-pointer no-border relative text-center text-gray-999 hover:text-black transition duration-300"
    :to="to"
    active-class="active"
  >
    <span class="button-content">
      <slot />
    </span>
  </NuxtLink>
</template>
        
<script setup lang="ts">
defineProps<{ to: string }>()
</script>
        
<style scoped>
.nav-trigger {
  display: inline-flex;
}

.no-border {
  border: none;
}

.relative {
  position: relative;
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
