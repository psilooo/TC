<template>
  <VaCard class="tud">
    <div class="tud__head">
      <VaIcon name="mso-event" size="18px" color="secondary" />
      <span class="tud__title">Upcoming Deadlines</span>
    </div>
    <ul class="tud__list">
      <li v-for="d in deadlines" :key="d.id" class="tud__row">
        <div class="tud__date">{{ formatShortDate(d.date) }}</div>
        <div class="tud__body">{{ d.title }}</div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskDeadline } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{ deadlines: TaskDeadline[] }>()
</script>

<style scoped lang="scss">
.tud {
  padding: 1.25rem;
}
.tud__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tud__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tud__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tud__row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tud__row:last-child {
  border-bottom: none;
}
.tud__date {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tud__body {
  font-size: 0.875rem;
}
</style>
