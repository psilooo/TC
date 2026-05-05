<!-- src/components/tour-dates/AdvanceUpdatesCard.vue -->
<template>
  <VaCard class="auc">
    <div class="auc__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="auc__title">Recent Updates</span>
    </div>
    <ul class="auc__list">
      <li v-for="u in updates" :key="u.id" class="auc__row">
        <span class="auc__dot" />
        <div class="auc__body">{{ u.body }}</div>
        <span class="auc__when">{{ formatRelativeDateTime(u.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { AdvanceUpdate } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ updates: AdvanceUpdate[] }>()
</script>

<style scoped lang="scss">
.auc {
  padding: 1.25rem;
}
.auc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.auc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.auc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.auc__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.auc__row:last-child {
  border-bottom: none;
}
.auc__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.auc__body {
  font-size: 0.875rem;
}
.auc__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
