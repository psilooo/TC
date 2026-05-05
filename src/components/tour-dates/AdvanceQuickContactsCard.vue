<!-- src/components/tour-dates/AdvanceQuickContactsCard.vue -->
<template>
  <VaCard class="aqc">
    <div class="aqc__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="aqc__title">Quick Contacts</span>
    </div>
    <ul class="aqc__list">
      <li v-for="c in contacts" :key="c.role" class="aqc__row">
        <div class="aqc__body">
          <div class="aqc__name">{{ c.name }}</div>
          <div class="aqc__sub">{{ c.role }}</div>
        </div>
        <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${c.name}`" />
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { QuickContact } from '../../data/types'

defineProps<{ contacts: QuickContact[] }>()
</script>

<style scoped lang="scss">
.aqc {
  padding: 1.25rem;
}
.aqc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.aqc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.aqc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.aqc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.aqc__row:last-child {
  border-bottom: none;
}
.aqc__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.aqc__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
