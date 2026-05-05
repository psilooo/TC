<!-- src/components/Breadcrumb.vue -->
<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, i) in items" :key="i">
        <span class="breadcrumb__crumb" :class="{ 'is-current': i === items.length - 1 }">
          {{ crumb }}
        </span>
        <VaIcon v-if="i < items.length - 1" name="mso-chevron_right" size="14px" color="secondary" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<style scoped lang="scss">
.breadcrumb ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.breadcrumb li {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb__crumb.is-current {
  color: var(--va-text-primary);
}
</style>
