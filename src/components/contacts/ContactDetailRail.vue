<!-- src/components/contacts/ContactDetailRail.vue -->
<template>
  <aside class="cdr">
    <header class="cdr__header">
      <VaAvatar size="large" color="secondary">{{ initials }}</VaAvatar>
      <div class="cdr__heading">
        <div class="cdr__name">{{ contact.name }}</div>
        <div class="cdr__role">
          <span class="cdr__role-pill">{{ contact.role }}</span>
        </div>
        <div class="cdr__sub">{{ contact.company }} · {{ contact.city }}</div>
      </div>
      <div class="cdr__actions">
        <VaButton preset="secondary" size="small" icon="mso-call" :aria-label="`Call ${contact.name}`" />
        <VaButton preset="secondary" size="small" icon="mso-mail" :aria-label="`Email ${contact.name}`" />
        <VaButton preset="secondary" size="small" icon="mso-visibility" :aria-label="`View profile`" />
        <VaButton preset="secondary" size="small" icon="mso-more_horiz" :aria-label="`More actions`" />
      </div>
    </header>

    <ContactInfoCard :contact="contact" />
    <ContactShowHistoryCard :shows="contact.showHistory" />
    <ContactRecentActivityCard :entries="contact.recentActivity" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContactDetail } from '../../data/types'
import ContactInfoCard from './ContactInfoCard.vue'
import ContactShowHistoryCard from './ContactShowHistoryCard.vue'
import ContactRecentActivityCard from './ContactRecentActivityCard.vue'

const props = defineProps<{ contact: ContactDetail }>()

const initials = computed(() =>
  props.contact.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join(''),
)
</script>

<style scoped lang="scss">
.cdr {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cdr__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 1rem 1.25rem;
  background: var(--va-background-element);
  border-radius: 0.5rem;
}
.cdr__name {
  font-size: 1.125rem;
  font-weight: 700;
}
.cdr__role-pill {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-primary);
  color: var(--va-secondary);
  margin-top: 0.25rem;
}
.cdr__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin-top: 0.25rem;
}
.cdr__actions {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
