<template>
  <VaCard class="tic">
    <div class="tic__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="tic__title">Travel Issues</span>
    </div>
    <ul class="tic__list">
      <li v-for="i in issues" :key="i.id" class="tic__row">
        <span class="tic__dot" :class="severityTokens[i.severity].dot" />
        <div class="tic__body">
          <div class="tic__name">{{ i.title }}</div>
          <div class="tic__sub">{{ i.sub }}</div>
        </div>
        <span class="tic__pill" :class="[severityTokens[i.severity].bg, severityTokens[i.severity].text]">{{
          i.severity
        }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TravelIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: TravelIssue[] }>()
</script>

<style scoped lang="scss">
.tic {
  padding: 1.25rem;
}
.tic__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tic__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.tic__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tic__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.tic__row:last-child {
  border-bottom: none;
}
.tic__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}
.tic__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.tic__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
.tic__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
</style>
