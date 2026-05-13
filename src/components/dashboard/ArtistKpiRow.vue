<!-- src/components/dashboard/ArtistKpiRow.vue -->
<template>
  <div class="artist-kpi-row">
    <RouterLink v-for="kpi in kpis" :key="kpi.label" :to="{ name: kpi.routeName }" class="artist-kpi-row__link">
      <KpiTile :icon="kpi.icon" :label="kpi.label" :value="kpi.value" :sub="kpi.sub" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { GlobalKpi } from '../../data/types'
import KpiTile from '../KpiTile.vue'

defineProps<{
  kpis: GlobalKpi[]
}>()
</script>

<style scoped lang="scss">
.artist-kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.artist-kpi-row__link {
  display: block;
  color: inherit;
  text-decoration: none;
}
</style>
