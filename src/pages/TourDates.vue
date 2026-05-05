<!-- src/pages/TourDates.vue -->
<template>
  <div class="page page--tour-dates">
    <PageHeader>
      <template #title>Advance Checklist</template>
      <template #subtitle>
        <div class="page--tour-dates__sub">
          <ShowSwitcher :name="advanceCurrentShow.label" />
          <span class="page--tour-dates__date">{{ advanceCurrentShow.date }}</span>
        </div>
      </template>
    </PageHeader>

    <KpiRow :kpis="advanceKpis" />

    <div class="page--tour-dates__body">
      <section class="page--tour-dates__main">
        <AdvanceSectionRow v-for="s in advanceSections" :key="s.id" v-bind="s" />
      </section>

      <aside class="page--tour-dates__rail">
        <AdvanceMissingCard :items="advanceMissing" />
        <AdvanceQuickContactsCard :contacts="advanceQuickContacts" />
        <AdvanceNotesCard :notes="advanceNotes" />
        <AdvanceUpdatesCard :updates="advanceUpdates" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ShowSwitcher from '../components/ShowSwitcher.vue'
import KpiRow from '../components/KpiRow.vue'
import AdvanceSectionRow from '../components/tour-dates/AdvanceSectionRow.vue'
import AdvanceMissingCard from '../components/tour-dates/AdvanceMissingCard.vue'
import AdvanceQuickContactsCard from '../components/tour-dates/AdvanceQuickContactsCard.vue'
import AdvanceNotesCard from '../components/tour-dates/AdvanceNotesCard.vue'
import AdvanceUpdatesCard from '../components/tour-dates/AdvanceUpdatesCard.vue'
import {
  advanceCurrentShow,
  advanceKpis,
  advanceSections,
  advanceMissing,
  advanceQuickContacts,
  advanceNotes,
  advanceUpdates,
} from '../data/tourDates'
</script>

<style scoped lang="scss">
.page--tour-dates {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page--tour-dates__sub {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.page--tour-dates__date {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.page--tour-dates__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .page--tour-dates__body {
    grid-template-columns: 2fr 1fr;
  }
}

.page--tour-dates__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
