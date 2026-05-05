<!-- src/components/contacts/ContactsTable.vue -->
<template>
  <VaCard class="ct">
    <div class="ct__filters">
      <VaInput class="ct__search" placeholder="Search contacts, venues, cities, emails…" aria-label="Search contacts">
        <template #prependInner><VaIcon name="mso-search" color="secondary" /></template>
      </VaInput>
      <VaSelect class="ct__select" placeholder="All Roles" :options="['All Roles']" />
      <VaSelect class="ct__select" placeholder="All Cities" :options="['All Cities']" />
      <VaSelect class="ct__select" placeholder="Show Type" :options="['Show Type']" />
      <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
      <VaButton preset="secondary" size="small">Clear All</VaButton>
    </div>

    <table class="ct__table">
      <thead>
        <tr>
          <th class="ct__th-check"><input type="checkbox" aria-label="Select all" /></th>
          <th>Role</th>
          <th>Name</th>
          <th>Company</th>
          <th>City</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Last Show</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in contacts" :key="c.id" :class="{ 'ct__row--selected': c.id === selectedId }">
          <td><input type="checkbox" :aria-label="`Select ${c.name}`" /></td>
          <td>
            <span class="ct__role">{{ c.role }}</span>
          </td>
          <td>{{ c.name }}</td>
          <td>{{ c.company }}</td>
          <td>{{ c.city }}</td>
          <td>{{ c.phones[0] }}</td>
          <td class="ct__email">{{ c.email }}</td>
          <td>{{ c.lastShowDate ? formatShortDate(c.lastShowDate) : '—' }}</td>
          <td><VaIcon name="mso-more_vert" size="18px" color="secondary" /></td>
        </tr>
      </tbody>
    </table>

    <div class="ct__footer">
      <span>Showing 1–{{ contacts.length }} of {{ total }}</span>
      <div class="ct__pages">
        <VaButton preset="secondary" size="small">‹</VaButton>
        <VaButton preset="primary" size="small">1</VaButton>
        <VaButton preset="secondary" size="small">2</VaButton>
        <VaButton preset="secondary" size="small">3</VaButton>
        <span>…</span>
        <VaButton preset="secondary" size="small">›</VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Contact } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{
  contacts: Contact[]
  selectedId: string
  total: string
}>()
</script>

<style scoped lang="scss">
.ct {
  padding: 1.25rem;
}
.ct__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}
.ct__search {
  flex: 1 1 16rem;
  min-width: 12rem;
}
.ct__select {
  width: 9rem;
}
.ct__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.ct__table th,
.ct__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.ct__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.ct__th-check {
  width: 2rem;
}
.ct__email {
  color: var(--va-secondary);
}
.ct__role {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
  white-space: nowrap;
}
.ct__row--selected {
  background: var(--va-background-element);
}
.ct__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.ct__pages {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
</style>
