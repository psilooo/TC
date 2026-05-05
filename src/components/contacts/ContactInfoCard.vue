<!-- src/components/contacts/ContactInfoCard.vue -->
<template>
  <VaCard class="ci">
    <div class="ci__head">
      <span class="ci__title">Contact Information</span>
    </div>
    <dl class="ci__list">
      <div v-for="(p, i) in contact.phones" :key="`p-${i}`" class="ci__row">
        <dt>Phone {{ i === 0 ? '(primary)' : '' }}</dt>
        <dd>{{ p }}</dd>
      </div>
      <div class="ci__row">
        <dt>Email</dt>
        <dd>{{ contact.email }}</dd>
      </div>
      <div v-for="(e, i) in contact.altEmails" :key="`e-${i}`" class="ci__row">
        <dt>Alt Email</dt>
        <dd>{{ e }}</dd>
      </div>
      <div class="ci__row">
        <dt>Address</dt>
        <dd>{{ contact.address }}</dd>
      </div>
      <div v-if="contact.notes" class="ci__row">
        <dt>Notes</dt>
        <dd>{{ contact.notes }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ContactDetail } from '../../data/types'

defineProps<{ contact: ContactDetail }>()
</script>

<style scoped lang="scss">
.ci {
  padding: 1.25rem;
}
.ci__head {
  margin-bottom: 0.75rem;
}
.ci__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.ci__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.ci__row {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.ci__row:last-child {
  border-bottom: none;
}
.ci__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.ci__row dd {
  font-size: 0.875rem;
  margin: 0;
}
</style>
