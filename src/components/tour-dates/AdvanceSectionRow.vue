<!-- src/components/tour-dates/AdvanceSectionRow.vue -->
<template>
  <VaCard class="advance-row">
    <div class="advance-row__icon">
      <VaIcon :name="icon" size="22px" color="secondary" />
    </div>
    <div class="advance-row__body">
      <div class="advance-row__name">{{ name }}</div>
      <div v-if="sub" class="advance-row__sub">{{ sub }}</div>
    </div>
    <div class="advance-row__progress">
      <div class="advance-row__progress-bar">
        <span class="advance-row__progress-fill" :style="{ width: pct + '%' }" />
      </div>
      <div class="advance-row__progress-label">{{ done }} / {{ total }}</div>
    </div>
    <span class="advance-row__pill" :class="[pillClass.bg, pillClass.text]">{{ status }}</span>
    <VaIcon name="mso-chevron_right" size="20px" color="secondary" />
  </VaCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdvanceStatus } from '../../data/types'
import { statusTokens } from '../../data/severity'

const props = defineProps<{
  id: string
  name: string
  icon: string
  sub?: string
  done: number
  total: number
  status: AdvanceStatus
}>()

const pct = computed(() => Math.round((props.done / Math.max(props.total, 1)) * 100))
const pillClass = computed(() => statusTokens[props.status])
</script>

<style scoped lang="scss">
.advance-row {
  display: grid;
  grid-template-columns: 2.5rem 1fr 12rem auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.5rem;
}

.advance-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: var(--va-background-element);
}

.advance-row__name {
  font-weight: 600;
  font-size: 0.95rem;
}

.advance-row__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.advance-row__progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advance-row__progress-bar {
  flex: 1;
  height: 0.5rem;
  background: var(--va-background-element);
  border-radius: 9999px;
  overflow: hidden;
}

.advance-row__progress-fill {
  display: block;
  height: 100%;
  background: var(--va-primary);
}

.advance-row__progress-label {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.advance-row__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
