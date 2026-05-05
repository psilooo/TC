<!-- src/components/dashboard/UpcomingShowsTable.vue -->
<template>
  <VaCard class="ushows">
    <div class="ushows__head">
      <VaIcon name="mso-confirmation_number" size="18px" color="secondary" />
      <span class="ushows__title">Upcoming Shows</span>
    </div>

    <table class="ushows__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>City</th>
          <th>Venue</th>
          <th class="ushows__num">Advance</th>
          <th>Travel</th>
          <th>Settlement</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="show in shows" :key="show.id">
          <td>{{ formatShortDate(show.date) }}</td>
          <td>{{ show.city }}</td>
          <td>{{ show.venue }}</td>
          <td class="ushows__num">{{ show.advanceUsd != null ? formatUsd(show.advanceUsd) : '—' }}</td>
          <td>
            <VaBadge
              v-if="show.travel"
              :text="show.travel"
              :color="show.travel === 'Confirmed' ? 'success' : 'warning'"
            />
          </td>
          <td>{{ show.settlement }}</td>
        </tr>
      </tbody>
    </table>

    <div class="ushows__footer">
      <VaButton preset="secondary" size="small">View all shows →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowSummary } from '../../data/types'
import { formatShortDate, formatUsd } from '../../data/format'

defineProps<{ shows: ShowSummary[] }>()
</script>

<style scoped lang="scss">
.ushows {
  padding: 1.25rem;
}

.ushows__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ushows__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.ushows__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  th,
  td {
    text-align: left;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid var(--va-background-border);
  }

  th {
    color: var(--va-secondary);
    font-weight: 500;
    font-size: 0.75rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.ushows__num {
  text-align: right;
}

.ushows__footer {
  margin-top: 1rem;
}
</style>
