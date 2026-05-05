<!-- src/pages/Dashboard.vue (in-progress; widgets being composed one at a time) -->
<template>
  <div class="dashboard-page">
    <PageHeader title="Tour Dashboard" subtitle="Today / Command Center" />

    <section class="kpi-row">
      <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
    </section>

    <section class="row-2">
      <Next72HoursCard :shows="next72h" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiTile from '../components/dashboard/KpiTile.vue'
import Next72HoursCard from '../components/dashboard/Next72HoursCard.vue'
import { kpis, next72h } from '../data/dashboard'
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 1.5rem;
}

.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.row-2 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  margin-top: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
