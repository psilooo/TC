<!-- src/components/tasks/TaskCard.vue -->
<template>
  <div class="tcard">
    <div class="tcard__title">{{ task.title }}</div>
    <div class="tcard__meta">
      <span v-if="task.due" class="tcard__due">{{ task.due }}</span>
      <span v-for="t in task.tags" :key="t" class="tcard__tag">{{ t }}</span>
      <VaAvatar size="small" color="secondary">{{ task.assigneeInitials }}</VaAvatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskItem } from '../../data/types'

defineProps<{ task: TaskItem }>()
</script>

<style scoped lang="scss">
.tcard {
  padding: 0.75rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-primary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tcard__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
}
.tcard__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}
.tcard__due {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
.tcard__tag {
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
</style>
