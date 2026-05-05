<!-- src/components/dashboard/QuickContactsCard.vue -->
<template>
  <VaCard class="contacts">
    <div class="contacts__head">
      <VaIcon name="mso-group" size="18px" color="secondary" />
      <span class="contacts__title">Quick Contacts</span>
    </div>

    <ul class="contacts__list">
      <li v-for="c in contacts" :key="c.role" class="contacts__row">
        <div class="contacts__role">{{ c.role }}</div>
        <div class="contacts__name">{{ c.name }}</div>
        <div class="contacts__phone">{{ c.phone }}</div>
        <div class="contacts__actions">
          <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${c.name}`" />
          <VaButton preset="secondary" size="small" icon="mso-mail" :aria-label="`Email ${c.name}`" />
        </div>
      </li>
    </ul>

    <div class="contacts__footer">
      <VaButton preset="secondary" size="small">View all contacts →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { QuickContact } from '../../data/types'

defineProps<{ contacts: QuickContact[] }>()
</script>

<style scoped lang="scss">
.contacts {
  padding: 1.25rem;
}

.contacts__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.contacts__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.contacts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contacts__row {
  display: grid;
  grid-template-columns: 7rem 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.contacts__role {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.contacts__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.contacts__phone {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.contacts__actions {
  display: flex;
  gap: 0.25rem;
}

.contacts__footer {
  margin-top: 1rem;
}
</style>
