<!-- src/components/tasks/TaskKanbanColumn.vue -->
<template>
  <VaCard class="tkc">
    <header class="tkc__head">
      <span class="tkc__title">{{ title }}</span>
      <span class="tkc__count">{{ count }}</span>
    </header>
    <div class="tkc__body">
      <TaskCard v-for="t in tasks" :key="t.id" :task="t" />
    </div>
    <footer class="tkc__footer">
      <button type="button" class="tkc__add">+ Add task</button>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import type { TaskItem } from '../../data/types'
import TaskCard from './TaskCard.vue'

defineProps<{
  title: string
  count: number
  tasks: TaskItem[]
}>()
</script>

<style scoped lang="scss">
.tkc {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tkc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tkc__title {
  font-size: 0.875rem;
  font-weight: 600;
}
.tkc__count {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--va-background-element);
  color: var(--va-secondary);
}
.tkc__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4rem;
}
.tkc__footer {
  padding-top: 0.5rem;
  border-top: 1px dashed var(--va-background-border);
}
.tkc__add {
  background: transparent;
  border: 0;
  color: var(--va-secondary);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
}
</style>
