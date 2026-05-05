<!-- src/pages/Travel.vue -->
<template>
  <div class="page page--travel">
    <PageHeader title="Travel & Hotels">
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Travel']" />
      </template>
    </PageHeader>

    <KpiRow :kpis="travelKpis" />

    <section class="page--travel__body">
      <div class="page--travel__main">
        <TravelSegmentsTable :segments="travelSegments" :selected-id="travelSelectedId" />
        <TravelTripDetailsPanel :trip="travelSelectedTrip" />
      </div>

      <aside class="page--travel__rail">
        <TravelCheckInsCard :checkins="travelCheckIns" />
        <TravelIssuesCard :issues="travelIssues" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import KpiRow from '../components/KpiRow.vue'
import TravelSegmentsTable from '../components/travel/TravelSegmentsTable.vue'
import TravelTripDetailsPanel from '../components/travel/TravelTripDetailsPanel.vue'
import TravelCheckInsCard from '../components/travel/TravelCheckInsCard.vue'
import TravelIssuesCard from '../components/travel/TravelIssuesCard.vue'
import {
  travelKpis,
  travelSegments,
  travelSelectedId,
  travelSelectedTrip,
  travelCheckIns,
  travelIssues,
} from '../data/travel'
</script>

<style scoped lang="scss">
.page--travel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--travel__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--travel__body {
    grid-template-columns: 2fr 1fr;
  }
}
.page--travel__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--travel__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
