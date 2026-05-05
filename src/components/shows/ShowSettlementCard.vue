<!-- src/components/shows/ShowSettlementCard.vue -->
<template>
  <VaCard class="show-sett">
    <div class="show-sett__head">
      <VaIcon name="mso-attach_money" size="18px" color="secondary" />
      <span class="show-sett__title">Settlement Snapshot</span>
      <span class="show-sett__pill" :class="[pillClass.bg, pillClass.text]">{{ data.status }}</span>
    </div>
    <dl class="show-sett__list">
      <div class="show-sett__row">
        <dt>Gross</dt>
        <dd>{{ formatUsd(data.gross) }}</dd>
      </div>
      <div class="show-sett__row">
        <dt>Expenses</dt>
        <dd>{{ formatUsd(data.expenses) }}</dd>
      </div>
      <div class="show-sett__row show-sett__row--net">
        <dt>Net</dt>
        <dd>{{ formatUsd(data.net) }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ShowSettlementSnapshot } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatUsd } from '../../data/format'

const props = defineProps<{ data: ShowSettlementSnapshot }>()

const pillClass = computed(() => {
  // Map ShowSettlementSnapshot.status to nearest statusToken key
  const tokenKey = props.data.status === 'Settled' ? 'Confirmed' : 'Pending'
  return statusTokens[tokenKey]
})
</script>

<style scoped lang="scss">
.show-sett {
  padding: 1.25rem;
}
.show-sett__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-sett__title {
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
}
.show-sett__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
.show-sett__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-sett__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-sett__row:last-child {
  border-bottom: none;
}
.show-sett__row dt {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-sett__row dd {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
.show-sett__row--net dt,
.show-sett__row--net dd {
  font-size: 1rem;
  font-weight: 700;
}
</style>
