<template>
  <div class="page page--shows">
    <PageHeader>
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Shows', 'May 20']" />
      </template>
      <template #title>
        <ShowSwitcher :name="showDetail.title" />
      </template>
      <template #subtitle>
        <span class="page--shows__date">{{ showDetail.dateLong }}</span>
      </template>
      <template #actions>
        <VaButton preset="secondary" size="small" icon="mso-edit">Edit Show</VaButton>
        <VaButton preset="secondary" size="small" icon="mso-more_horiz">Show Actions</VaButton>
      </template>
    </PageHeader>

    <section class="page--shows__row">
      <ShowSnapshotCard v-bind="showDetail.snapshot" />
      <ShowScheduleCard :events="showDetail.schedule" />
      <ShowContactsCard :contacts="showDetail.contacts" />
    </section>

    <section class="page--shows__row">
      <ShowGuestListCard :data="showDetail.guestList" />
      <ShowHospitalityCard :notes="showDetail.hospitality" />
      <ShowOpenTasksCard :tasks="showDetail.openTasks" />
    </section>

    <section class="page--shows__row">
      <ShowSettlementCard :data="showDetail.settlement" />
      <ShowAttachmentsCard :files="showDetail.attachments" />
      <ShowRecentActivityCard :entries="showDetail.recentActivity" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import ShowSwitcher from '../components/ShowSwitcher.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import ShowSnapshotCard from '../components/shows/ShowSnapshotCard.vue'
import ShowScheduleCard from '../components/shows/ShowScheduleCard.vue'
import ShowContactsCard from '../components/shows/ShowContactsCard.vue'
import ShowGuestListCard from '../components/shows/ShowGuestListCard.vue'
import ShowHospitalityCard from '../components/shows/ShowHospitalityCard.vue'
import ShowOpenTasksCard from '../components/shows/ShowOpenTasksCard.vue'
import ShowSettlementCard from '../components/shows/ShowSettlementCard.vue'
import ShowAttachmentsCard from '../components/shows/ShowAttachmentsCard.vue'
import ShowRecentActivityCard from '../components/shows/ShowRecentActivityCard.vue'
import { showDetail } from '../data/shows'
</script>

<style scoped lang="scss">
.page--shows {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--shows__date {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin-top: 0.25rem;
  display: inline-block;
}
.page--shows__row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .page--shows__row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
