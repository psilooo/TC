<template>
  <VaCard class="tci">
    <div class="tci__head">
      <VaIcon name="mso-hotel" size="18px" color="secondary" />
      <span class="tci__title">Upcoming Check-Ins</span>
    </div>
    <ul class="tci__list">
      <li v-for="c in checkins" :key="c.id" class="tci__row">
        <div class="tci__body">
          <div class="tci__name">{{ c.hotel }}</div>
          <div class="tci__sub">
            {{ c.city }} · {{ formatShortDate(c.arrival) }} – {{ formatShortDate(c.departure) }}
          </div>
        </div>
        <span class="tci__pill" :class="[statusTokens[c.status].bg, statusTokens[c.status].text]">{{ c.status }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelCheckIn } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ checkins: TravelCheckIn[] }>()
</script>

<style scoped lang="scss">
.tci {
  padding: 1.25rem;
}
.tci__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tci__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tci__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tci__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tci__row:last-child {
  border-bottom: none;
}
.tci__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.tci__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tci__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
