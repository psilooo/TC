<!-- src/components/travel/TravelTripDetailsPanel.vue -->
<template>
  <VaCard class="ttd">
    <div class="ttd__head">
      <VaIcon name="mso-info" size="18px" color="secondary" />
      <span class="ttd__title">Selected Trip Details</span>
    </div>
    <div class="ttd__grid">
      <div class="ttd__col">
        <div class="ttd__label">Origin</div>
        <div class="ttd__primary">{{ trip.origin.city }} ({{ trip.origin.airport }})</div>
        <div class="ttd__sub">{{ trip.origin.date }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Destination</div>
        <div class="ttd__primary">{{ trip.destination.city }} ({{ trip.destination.airport }})</div>
        <div class="ttd__sub">{{ trip.destination.date }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Hotel</div>
        <div class="ttd__primary">{{ trip.hotel.name }}</div>
        <div class="ttd__sub">{{ trip.hotel.address }}</div>
        <div class="ttd__sub">{{ trip.hotel.checkIn }} – {{ trip.hotel.checkOut }}</div>
      </div>
      <div class="ttd__col">
        <div class="ttd__label">Confirmations</div>
        <ul class="ttd__list">
          <li v-for="c in trip.confirmations" :key="c.kind">
            <span>{{ c.kind }}</span
            ><code>{{ c.code }}</code>
          </li>
        </ul>
      </div>
      <div class="ttd__col ttd__col--wide">
        <div class="ttd__label">Travel Party</div>
        <ul class="ttd__list ttd__party">
          <li v-for="p in trip.party" :key="p.name">
            <span>{{ p.name }}</span
            ><span class="ttd__sub">{{ p.role }}</span>
          </li>
        </ul>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelTrip } from '../../data/types'

defineProps<{ trip: TravelTrip }>()
</script>

<style scoped lang="scss">
.ttd {
  padding: 1.25rem;
}
.ttd__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.ttd__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.ttd__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) {
  .ttd__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.ttd__col--wide {
  grid-column: 1 / -1;
}
.ttd__label {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-bottom: 0.25rem;
}
.ttd__primary {
  font-size: 0.875rem;
  font-weight: 600;
}
.ttd__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.ttd__list {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
}
.ttd__list li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
.ttd__list code {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: var(--va-secondary);
}
.ttd__party li {
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
