<!-- src/components/dashboard/Next72HoursCard.vue -->
<template>
  <VaCard class="next72">
    <div class="next72__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="next72__title">Next 72 Hours</span>
    </div>

    <ul class="next72__list">
      <li v-for="show in shows" :key="show.id" class="next72__row">
        <div class="next72__when">
          <div class="next72__date">{{ formatShortDate(show.date) }}</div>
          <div class="next72__time">{{ show.time }}</div>
        </div>
        <div class="next72__where">
          <div class="next72__city">{{ show.city }}</div>
          <div class="next72__venue">{{ show.venue }}</div>
        </div>
        <VaIcon name="mso-chevron_right" size="18px" color="secondary" />
      </li>
    </ul>

    <div class="next72__footer">
      <VaButton preset="secondary" size="small">View all shows →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSummary } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{ shows: ShowSummary[] }>()
</script>

<style scoped lang="scss">
.next72 {
  padding: 1.25rem;
}

.next72__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.next72__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.next72__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.next72__row {
  display: grid;
  grid-template-columns: minmax(7rem, auto) 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.next72__date {
  font-weight: 600;
  font-size: 0.875rem;
}

.next72__time {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.next72__city {
  font-weight: 600;
  font-size: 0.875rem;
}

.next72__venue {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.next72__footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}
</style>
