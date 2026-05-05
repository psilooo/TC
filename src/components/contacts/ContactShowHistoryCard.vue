<!-- src/components/contacts/ContactShowHistoryCard.vue -->
<template>
  <VaCard class="csh">
    <div class="csh__head">
      <VaIcon name="mso-confirmation_number" size="18px" color="secondary" />
      <span class="csh__title">Show History</span>
    </div>
    <ul class="csh__list">
      <li v-for="s in shows" :key="s.id" class="csh__row">
        <div class="csh__date">{{ formatShortDate(s.date) }}</div>
        <div class="csh__body">
          <div class="csh__venue">{{ s.venue }}</div>
          <div class="csh__city">{{ s.city }}</div>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import { formatShortDate } from '../../data/format'

defineProps<{
  shows: { id: string; date: string; venue: string; city: string }[]
}>()
</script>

<style scoped lang="scss">
.csh {
  padding: 1.25rem;
}
.csh__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.csh__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.csh__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.csh__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.5rem;
  align-items: start;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.csh__row:last-child {
  border-bottom: none;
}
.csh__date {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.csh__venue {
  font-size: 0.875rem;
  font-weight: 600;
}
.csh__city {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
