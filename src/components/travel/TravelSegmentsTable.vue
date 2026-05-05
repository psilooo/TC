<!-- src/components/travel/TravelSegmentsTable.vue -->
<template>
  <VaCard class="tst">
    <div class="tst__head">
      <span class="tst__title">Travel Segments</span>
      <div class="tst__actions">
        <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
        <VaButton preset="secondary" size="small" icon="mso-download">Export</VaButton>
      </div>
    </div>
    <table class="tst__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Trip #</th>
          <th>Route</th>
          <th>Mode</th>
          <th>Hotel</th>
          <th>Status</th>
          <th>Confirmation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in segments" :key="s.id" :class="{ 'tst__row--selected': s.id === selectedId }">
          <td>{{ formatShortDate(s.date) }}</td>
          <td>{{ s.tripNumber }}</td>
          <td>{{ s.origin }} → {{ s.destination }}</td>
          <td>{{ s.mode }}</td>
          <td>{{ s.hotel ?? '—' }}</td>
          <td>
            <span class="tst__pill" :class="[statusTokens[s.status].bg, statusTokens[s.status].text]">{{
              s.status
            }}</span>
          </td>
          <td>{{ s.confirmation ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelSegment } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{
  segments: TravelSegment[]
  selectedId: string
}>()
</script>

<style scoped lang="scss">
.tst {
  padding: 1.25rem;
}
.tst__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.tst__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tst__actions {
  display: flex;
  gap: 0.5rem;
}
.tst__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.tst__table th,
.tst__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.tst__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.tst__table tbody tr:last-child td {
  border-bottom: none;
}
.tst__row--selected {
  background: var(--va-background-element);
}
.tst__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
