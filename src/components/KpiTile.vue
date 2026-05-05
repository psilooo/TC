<!-- src/components/KpiTile.vue -->
<template>
  <VaCard class="kpi-tile">
    <div class="kpi-tile__head">
      <VaIcon :name="icon" size="20px" color="secondary" />
      <span class="kpi-tile__label">{{ label }}</span>
    </div>
    <div class="kpi-tile__value">{{ value }}</div>
    <div class="kpi-tile__sub">{{ sub }}</div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Kpi } from '../data/types'

defineProps<Kpi>()
</script>

<style scoped lang="scss">
.kpi-tile {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kpi-tile__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kpi-tile__label {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.kpi-tile__value {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.kpi-tile__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
