<!-- src/components/documents/DocsMissingCard.vue -->
<template>
  <VaCard class="dmc">
    <div class="dmc__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="dmc__title">Missing Required Documents</span>
    </div>
    <ul class="dmc__list">
      <li v-for="i in items" :key="i.id" class="dmc__row">
        <div class="dmc__body">
          <div class="dmc__name">{{ i.title }}</div>
          <div class="dmc__sub">{{ i.show }}</div>
        </div>
        <span class="dmc__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { DocsMissingItem } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ items: DocsMissingItem[] }>()
</script>

<style scoped lang="scss">
.dmc {
  padding: 1.25rem;
}
.dmc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dmc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dmc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dmc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.dmc__row:last-child {
  border-bottom: none;
}
.dmc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.dmc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.dmc__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
