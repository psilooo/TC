<!-- src/components/PageHeader.vue -->
<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
}

.page-header__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
}

.page-header__subtitle {
  margin: 0.25rem 0 0;
  color: var(--va-secondary);
  font-size: 0.875rem;
}
</style>
