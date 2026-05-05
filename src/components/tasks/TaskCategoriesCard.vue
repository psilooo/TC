<template>
  <VaCard class="tcc">
    <div class="tcc__head">
      <VaIcon name="mso-category" size="18px" color="secondary" />
      <span class="tcc__title">Task Categories</span>
    </div>
    <ul class="tcc__list">
      <li v-for="c in categories" :key="c.name" class="tcc__row">
        <span class="tcc__name">{{ c.name }}</span>
        <span class="tcc__count">{{ c.count }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskCategory } from '../../data/types'

defineProps<{ categories: TaskCategory[] }>()
</script>

<style scoped lang="scss">
.tcc {
  padding: 1.25rem;
}
.tcc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tcc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tcc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tcc__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tcc__row:last-child {
  border-bottom: none;
}
.tcc__name {
  font-size: 0.875rem;
}
.tcc__count {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
</style>
