<!-- src/components/KpiRow.vue -->
<template>
  <section class="kpi-row" :class="{ 'kpi-row--three': kpis.length === 3 }">
    <KpiTile v-for="k in kpis" :key="k.label" v-bind="k" />
  </section>
</template>

<script setup lang="ts">
import type { Kpi } from '../data/types'
import KpiTile from './KpiTile.vue'

defineProps<{ kpis: Kpi[] }>()
</script>

<style scoped lang="scss">
.kpi-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kpi-row {
    grid-template-columns: repeat(4, 1fr);
  }

  .kpi-row--three {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
