<!-- src/components/shows/ShowContactsCard.vue -->
<template>
  <VaCard class="show-contacts">
    <div class="show-contacts__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="show-contacts__title">Contacts</span>
    </div>
    <ul class="show-contacts__list">
      <li v-for="c in contacts" :key="c.role" class="show-contacts__row">
        <div class="show-contacts__role">{{ c.role }}</div>
        <div class="show-contacts__name">{{ c.name }}</div>
        <div class="show-contacts__phone">{{ c.phone }}</div>
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
.show-contacts {
  padding: 1.25rem;
}
.show-contacts__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-contacts__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-contacts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.show-contacts__row {
  display: grid;
  grid-template-columns: 6rem 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-contacts__row:last-child {
  border-bottom: none;
}
.show-contacts__role {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.show-contacts__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.show-contacts__phone {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
