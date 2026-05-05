<!-- src/components/documents/SettlementQueueTable.vue -->
<template>
  <VaCard class="sq">
    <div class="sq__head">
      <span class="sq__title">Settlement Queue</span>
    </div>
    <table class="sq__table">
      <thead>
        <tr>
          <th>Show</th>
          <th>Date</th>
          <th class="sq__num">Gross</th>
          <th class="sq__num">Expenses</th>
          <th class="sq__num">Net</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in settlements" :key="s.id">
          <td>{{ s.show }}</td>
          <td>{{ formatShortDate(s.date) }}</td>
          <td class="sq__num">{{ formatUsd(s.grossUsd) }}</td>
          <td class="sq__num">{{ formatUsd(s.expensesUsd) }}</td>
          <td class="sq__num">{{ formatUsd(s.netUsd) }}</td>
          <td>
            <span class="sq__pill" :class="[statusTokens[s.status].bg, statusTokens[s.status].text]">{{
              s.status
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { Settlement } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate, formatUsd } from '../../data/format'

defineProps<{ settlements: Settlement[] }>()
</script>

<style scoped lang="scss">
.sq {
  padding: 1.25rem;
}
.sq__head {
  margin-bottom: 1rem;
}
.sq__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.sq__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.sq__table th,
.sq__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.sq__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.sq__table tbody tr:last-child td {
  border-bottom: none;
}
.sq__num {
  text-align: right;
}
.sq__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
