<!-- src/components/dashboard/CriticalIssuesCard.vue -->
<template>
  <VaCard class="critical">
    <header class="critical__head">
      <VaIcon name="mso-warning" size="20px" color="danger" />
      <h2 class="critical__title">Critical Issues</h2>
    </header>

    <div v-for="issue in issues" :key="issue.id" class="critical__row">
      <span class="critical__dot" :class="severityTokens[issue.severity].dot" />
      <div class="critical__body">
        <div class="critical__row-title">{{ issue.title }}</div>
        <div class="critical__row-sub">{{ issue.artistName }} — {{ issue.due }}</div>
      </div>
      <VaButton :to="{ name: 'issues' }" size="small" preset="secondary" class="critical__resolve"> Resolve </VaButton>
    </div>

    <footer class="critical__footer">
      <RouterLink :to="{ name: 'issues' }" class="critical__footer-link"> View All Issues & Risks → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CriticalIssue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{
  issues: CriticalIssue[]
}>()
</script>

<style scoped lang="scss">
.critical {
  padding: 1.25rem 1.25rem 0.5rem;
}

.critical__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.critical__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.critical__row {
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--va-background-border);
}

.critical__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  display: inline-block;
}

.critical__row-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.critical__row-sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.critical__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.critical__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
