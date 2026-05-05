<!-- src/components/shows/ShowSnapshotCard.vue -->
<template>
  <VaCard class="show-snap">
    <div class="show-snap__head">
      <VaIcon name="mso-stadium" size="18px" color="secondary" />
      <span class="show-snap__title">Show Snapshot</span>
    </div>
    <dl class="show-snap__list">
      <div class="show-snap__row">
        <dt>Venue</dt>
        <dd>{{ venue }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Address</dt>
        <dd>{{ address }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Capacity</dt>
        <dd>{{ capacity.toLocaleString() }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Doors</dt>
        <dd>{{ doors }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Show Start</dt>
        <dd>{{ showStart }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Set Length</dt>
        <dd>{{ setLength }}</dd>
      </div>
      <div class="show-snap__row">
        <dt>Support</dt>
        <dd>{{ support }}</dd>
      </div>
      <div v-if="ageRestriction" class="show-snap__row">
        <dt>Age</dt>
        <dd>{{ ageRestriction }}</dd>
      </div>
      <div v-if="ticketSales" class="show-snap__row">
        <dt>Sold</dt>
        <dd>{{ ticketSales.sold.toLocaleString() }} / {{ ticketSales.capacity.toLocaleString() }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSnapshot } from '../../data/types'

defineProps<ShowSnapshot>()
</script>

<style scoped lang="scss">
.show-snap {
  padding: 1.25rem;
}
.show-snap__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-snap__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-snap__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.show-snap__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.75rem;
  padding: 0.25rem 0;
}
.show-snap__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-snap__row dd {
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}
</style>
