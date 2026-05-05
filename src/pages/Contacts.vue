<!-- src/pages/Contacts.vue -->
<template>
  <div class="page page--contacts">
    <PageHeader title="Contacts" />

    <KpiRow :kpis="contactsKpis" />

    <section class="page--contacts__body">
      <ContactsTable :contacts="contactsDirectory" :selected-id="contactsSelectedId" :total="contactsKpis[0].value" />
      <ContactDetailRail :contact="contactsSelectedContact" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiRow from '../components/KpiRow.vue'
import ContactsTable from '../components/contacts/ContactsTable.vue'
import ContactDetailRail from '../components/contacts/ContactDetailRail.vue'
import { contactsKpis, contactsDirectory, contactsSelectedId, contactsSelectedContact } from '../data/contacts'
</script>

<style scoped lang="scss">
.page--contacts {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--contacts__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--contacts__body {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
