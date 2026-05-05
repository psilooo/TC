<!-- src/components/dashboard/OpenIssuesCard.vue -->
<template>
  <VaCard class="issues">
    <div class="issues__head">
      <VaIcon name="mso-warning" size="18px" color="secondary" />
      <span class="issues__title">Open Issues</span>
    </div>

    <ul class="issues__list">
      <li v-for="issue in issues" :key="issue.id" class="issues__row">
        <span class="issues__dot" :class="severityTokens[issue.severity].dot" />
        <div class="issues__body">
          <div class="issues__name">{{ issue.title }}</div>
          <div class="issues__sub">{{ issue.sub }}</div>
        </div>
        <span class="issues__pill" :class="[severityTokens[issue.severity].bg, severityTokens[issue.severity].text]">
          {{ issue.severity }}
        </span>
      </li>
    </ul>

    <div class="issues__footer">
      <VaButton preset="secondary" size="small">View all issues →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { Issue } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{ issues: Issue[] }>()
</script>

<style scoped lang="scss">
.issues {
  padding: 1.25rem;
}

.issues__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.issues__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.issues__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.issues__row {
  display: grid;
  grid-template-columns: 0.625rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.issues__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}

.issues__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.issues__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.issues__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.issues__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.issues__footer {
  margin-top: 1rem;
}
</style>
