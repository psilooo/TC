<!-- src/components/ShowSwitcher.vue -->
<template>
  <button class="show-switcher" type="button" :aria-label="`Switch show (currently ${name})`">
    <span>{{ name }}</span>
    <VaIcon name="mso-expand_more" size="20px" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<style scoped lang="scss">
.show-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
