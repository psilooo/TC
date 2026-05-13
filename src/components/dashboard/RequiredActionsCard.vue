<!-- src/components/dashboard/RequiredActionsCard.vue -->
<template>
  <VaCard class="actions-card">
    <header class="actions-card__head">
      <VaIcon name="mso-checklist" size="20px" color="secondary" />
      <h2 class="actions-card__title">Today's Required Actions</h2>
    </header>

    <RouterLink v-for="action in actions" :key="action.id" :to="{ name: 'tasks' }" class="actions-card__row">
      <div class="actions-card__title-cell">{{ action.title }}</div>
      <div class="actions-card__artist">{{ action.artistName }}</div>
      <div class="actions-card__due">{{ action.due }}</div>
      <VaBadge :text="action.status" :color="vaBadgeTokens[action.status]" />
    </RouterLink>

    <footer class="actions-card__footer">
      <RouterLink :to="{ name: 'tasks' }" class="actions-card__footer-link"> View All Tasks → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RequiredAction } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  actions: RequiredAction[]
}>()
</script>

<style scoped lang="scss">
.actions-card {
  padding: 1.25rem 1.25rem 0.5rem;
}

.actions-card__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.actions-card__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.actions-card__row {
  display: grid;
  grid-template-columns: 1.5fr 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.actions-card__title-cell {
  font-weight: 600;
  font-size: 0.9375rem;
}

.actions-card__artist {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.actions-card__due {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  white-space: nowrap;
}

.actions-card__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.actions-card__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
