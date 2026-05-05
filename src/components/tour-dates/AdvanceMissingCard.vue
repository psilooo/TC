<!-- src/components/tour-dates/AdvanceMissingCard.vue -->
<template>
  <VaCard class="amc">
    <div class="amc__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="amc__title">Missing Items</span>
    </div>
    <ul class="amc__list">
      <li v-for="item in items" :key="item.id" class="amc__row">
        <div class="amc__body">
          <div class="amc__name">{{ item.title }}</div>
          <div class="amc__sub">{{ item.sub }}</div>
        </div>
        <span class="amc__pill" :class="[severityTokens[item.severity].bg, severityTokens[item.severity].text]">
          {{ item.severity }}
        </span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { AdvanceMissingItem } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ items: AdvanceMissingItem[] }>()
</script>

<style scoped lang="scss">
.amc {
  padding: 1.25rem;
}
.amc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.amc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.amc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.amc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.amc__row:last-child {
  border-bottom: none;
}
.amc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.amc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.amc__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
