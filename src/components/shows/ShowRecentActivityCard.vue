<!-- src/components/shows/ShowRecentActivityCard.vue -->
<template>
  <VaCard class="show-act">
    <div class="show-act__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="show-act__title">Recent Activity</span>
    </div>
    <ul class="show-act__list">
      <li v-for="e in entries" :key="e.id" class="show-act__row">
        <span class="show-act__dot" />
        <div class="show-act__body">{{ e.body }}</div>
        <span class="show-act__when">{{ formatRelativeDateTime(e.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowActivityEntry } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ entries: ShowActivityEntry[] }>()
</script>

<style scoped lang="scss">
.show-act {
  padding: 1.25rem;
}
.show-act__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-act__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-act__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-act__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-act__row:last-child {
  border-bottom: none;
}
.show-act__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.show-act__body {
  font-size: 0.875rem;
}
.show-act__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
