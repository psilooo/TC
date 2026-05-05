<!-- src/components/dashboard/TravelHotelCard.vue -->
<template>
  <VaCard class="travel">
    <div class="travel__head">
      <VaIcon name="mso-luggage" size="18px" color="secondary" />
      <span class="travel__title">Travel & Hotel</span>
    </div>

    <ul class="travel__list">
      <li v-for="leg in legs" :key="leg.kind" class="travel__row">
        <VaIcon :name="iconFor(leg.kind)" size="18px" color="secondary" />
        <div class="travel__kind">{{ leg.kind }}</div>
        <div class="travel__body">
          <div class="travel__primary">{{ leg.primary }}</div>
          <div class="travel__sub">{{ leg.sub }}</div>
        </div>
        <VaBadge :text="leg.status" :color="leg.status === 'Confirmed' ? 'success' : 'warning'" class="travel__badge" />
        <VaIcon name="mso-chevron_right" size="18px" color="secondary" />
      </li>
    </ul>

    <div class="travel__footer">
      <VaButton preset="secondary" size="small">View all travel →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelLeg } from '../../data/types'

defineProps<{ legs: TravelLeg[] }>()

function iconFor(kind: TravelLeg['kind']): string {
  switch (kind) {
    case 'Flight':
      return 'mso-flight'
    case 'Hotel':
      return 'mso-hotel'
    case 'Ground':
      return 'mso-directions_car'
  }
}
</script>

<style scoped lang="scss">
.travel {
  padding: 1.25rem;
}

.travel__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.travel__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.travel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.travel__row {
  display: grid;
  grid-template-columns: 1.5rem 4rem 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.travel__kind {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.travel__primary {
  font-size: 0.875rem;
  font-weight: 600;
}

.travel__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.travel__badge {
  font-size: 0.75rem;
}

.travel__footer {
  margin-top: 1rem;
}
</style>
