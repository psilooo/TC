<!-- src/components/dashboard/WaitingOnCard.vue -->
<template>
  <VaCard class="waiting-on">
    <header class="waiting-on__head">
      <VaIcon name="mso-pending" size="20px" color="secondary" />
      <h2 class="waiting-on__title">Waiting On</h2>
    </header>

    <RouterLink v-for="row in rows" :key="row.id" :to="{ name: 'tasks' }" class="waiting-on__row">
      <div class="waiting-on__body">
        <div class="waiting-on__title-cell">{{ row.title }}</div>
        <div class="waiting-on__sub">{{ row.sub }}</div>
      </div>
      <VaBadge :text="row.waitingOn" color="secondary" class="waiting-on__chip" />
    </RouterLink>

    <footer class="waiting-on__footer">
      <RouterLink :to="{ name: 'tasks' }" class="waiting-on__footer-link"> View All Waiting On → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { WaitingOnRow } from '../../data/types'

defineProps<{
  rows: WaitingOnRow[]
}>()
</script>

<style scoped lang="scss">
.waiting-on {
  padding: 1.25rem 1.25rem 0.5rem;
}

.waiting-on__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.waiting-on__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.waiting-on__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.waiting-on__body {
  min-width: 0;
}

.waiting-on__title-cell {
  font-weight: 600;
  font-size: 0.875rem;
}

.waiting-on__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.waiting-on__chip {
  flex-shrink: 0;
}

.waiting-on__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.5rem;
}

.waiting-on__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
