<!-- src/components/contacts/ContactRecentActivityCard.vue -->
<template>
  <VaCard class="cra">
    <div class="cra__head">
      <VaIcon name="mso-history" size="18px" color="secondary" />
      <span class="cra__title">Recent Activity</span>
    </div>
    <ul class="cra__list">
      <li v-for="e in entries" :key="e.id" class="cra__row">
        <span class="cra__dot" />
        <div class="cra__body">{{ e.body }}</div>
        <span class="cra__when">{{ formatRelativeDateTime(e.at) }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import { formatRelativeDateTime } from '../../data/format'

defineProps<{
  entries: { id: string; body: string; at: string }[]
}>()
</script>

<style scoped lang="scss">
.cra {
  padding: 1.25rem;
}
.cra__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.cra__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.cra__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.cra__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.cra__row:last-child {
  border-bottom: none;
}
.cra__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--va-primary);
}
.cra__body {
  font-size: 0.875rem;
}
.cra__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
