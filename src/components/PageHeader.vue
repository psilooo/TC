<!-- src/components/PageHeader.vue -->
<template>
  <header class="page-header">
    <div class="page-header__top">
      <div class="page-header__heading">
        <slot name="breadcrumb" />
        <h1 class="page-header__title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <slot name="subtitle">
          <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Invariant: callers must provide either the `title` prop OR a `#title` slot.
// Both omitted = empty <h1> rendered (caught by visual review, not by TS).
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 1.5rem;
}

.page-header__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
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

.page-header__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
