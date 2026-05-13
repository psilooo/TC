<!-- src/pages/Dashboard.vue -->
<template>
  <div class="global-dashboard">
    <PageHeader title="Global Dashboard" subtitle="Overview across all artists and tours">
      <template #actions>
        <VaButton preset="secondary" icon="mso-tune" disabled>Customize Dashboard</VaButton>
      </template>
    </PageHeader>

    <section class="global-dashboard__kpi-row">
      <ArtistKpiRow :kpis="kpis" />
    </section>

    <div class="global-dashboard__body">
      <div class="global-dashboard__main">
        <section class="global-dashboard__today">
          <TodayAcrossArtistsTable :rows="todayAcrossArtists" />
        </section>
        <div class="global-dashboard__main-row">
          <section class="global-dashboard__critical">
            <CriticalIssuesCard :issues="criticalIssues" />
          </section>
          <section class="global-dashboard__actions">
            <RequiredActionsCard :actions="requiredActions" />
          </section>
        </div>
      </div>

      <div class="global-dashboard__rail">
        <section class="global-dashboard__next72">
          <GlobalNext72HoursCard :groups="next72h" />
        </section>
        <section class="global-dashboard__travel">
          <TravelMovementCard :rows="travelWatch" />
        </section>
        <section class="global-dashboard__waiting">
          <WaitingOnCard :rows="waitingOn" />
        </section>
      </div>
    </div>

    <section class="global-dashboard__readiness">
      <ArtistReadinessGrid :cards="artistReadiness" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ArtistKpiRow from '../components/dashboard/ArtistKpiRow.vue'
import TodayAcrossArtistsTable from '../components/dashboard/TodayAcrossArtistsTable.vue'
import GlobalNext72HoursCard from '../components/dashboard/GlobalNext72HoursCard.vue'
import CriticalIssuesCard from '../components/dashboard/CriticalIssuesCard.vue'
import RequiredActionsCard from '../components/dashboard/RequiredActionsCard.vue'
import TravelMovementCard from '../components/dashboard/TravelMovementCard.vue'
import WaitingOnCard from '../components/dashboard/WaitingOnCard.vue'
import ArtistReadinessGrid from '../components/dashboard/ArtistReadinessGrid.vue'
import {
  kpis,
  todayAcrossArtists,
  next72h,
  criticalIssues,
  requiredActions,
  travelWatch,
  waitingOn,
  artistReadiness,
} from '../data/globalDashboard'
</script>

<style scoped lang="scss">
.global-dashboard {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.global-dashboard__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
}

.global-dashboard__main,
.global-dashboard__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.global-dashboard__main-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
