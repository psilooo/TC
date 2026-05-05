<!-- src/components/PagePlaceholder.vue -->
<template>
  <div class="page-placeholder">
    <PageHeader :title="name" />
    <div class="page-placeholder__panel">
      <p class="page-placeholder__copy">Coming soon — detailed design pending.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'

defineProps<{
  name: string
}>()
</script>

<style scoped lang="scss">
.page-placeholder {
  padding: 1.5rem;
}

.page-placeholder__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  padding: 2rem;
  border: 1px dashed var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-element);
}

.page-placeholder__copy {
  margin: 0;
  color: var(--va-secondary);
  font-size: 1rem;
}
</style>
