<!-- src/components/documents/DocsSettlementIssuesCard.vue -->
<template>
  <VaCard class="dsi">
    <div class="dsi__head">
      <VaIcon name="mso-priority_high" size="18px" color="secondary" />
      <span class="dsi__title">Settlement Issues</span>
    </div>
    <ul class="dsi__list">
      <li v-for="i in issues" :key="i.id" class="dsi__row">
        <span class="dsi__dot" :class="severityTokens[i.severity].dot" />
        <div class="dsi__body">
          <div class="dsi__name">{{ i.title }}</div>
          <div class="dsi__sub">{{ i.sub }}</div>
        </div>
        <span class="dsi__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: TravelIssue[] }>()
</script>

<style scoped lang="scss">
.dsi {
  padding: 1.25rem;
}
.dsi__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dsi__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dsi__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dsi__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.dsi__row:last-child {
  border-bottom: none;
}
.dsi__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}
.dsi__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.dsi__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.dsi__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
