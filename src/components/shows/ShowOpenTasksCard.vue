<!-- src/components/shows/ShowOpenTasksCard.vue -->
<template>
  <VaCard class="show-tasks">
    <div class="show-tasks__head">
      <VaIcon name="mso-task_alt" size="18px" color="secondary" />
      <span class="show-tasks__title">Open Tasks</span>
    </div>
    <ul class="show-tasks__list">
      <li v-for="t in tasks" :key="t.id" class="show-tasks__row">
        <span class="show-tasks__check"><VaIcon name="mso-radio_button_unchecked" size="16px" /></span>
        <div class="show-tasks__body">{{ t.title }}</div>
        <span
          v-if="t.severity"
          class="show-tasks__pill"
          :class="[severityTokens[t.severity].bg, severityTokens[t.severity].text]"
        >
          {{ t.due }}
        </span>
        <span v-else class="show-tasks__due">{{ t.due }}</span>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { Severity } from '../../data/types'
import { severityTokens } from '../../data/severity'

defineProps<{
  tasks: { id: string; title: string; due: string; severity?: Severity }[]
}>()
</script>

<style scoped lang="scss">
.show-tasks {
  padding: 1.25rem;
}
.show-tasks__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-tasks__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-tasks__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-tasks__row {
  display: grid;
  grid-template-columns: 1.25rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-tasks__row:last-child {
  border-bottom: none;
}
.show-tasks__body {
  font-size: 0.875rem;
}
.show-tasks__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
.show-tasks__due {
  font-size: 0.75rem;
  color: var(--va-secondary);
  white-space: nowrap;
}
</style>
