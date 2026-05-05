<template>
  <div class="page page--tasks">
    <PageHeader title="Tasks & Follow-Ups" subtitle="Stay on top of your responsibilities" />

    <KpiRow :kpis="tasksKpis" />

    <section class="page--tasks__body">
      <div class="page--tasks__columns">
        <TaskKanbanColumn title="To Do" :count="tasksTodo.length" :tasks="tasksTodo" />
        <TaskKanbanColumn title="Waiting" :count="tasksWaiting.length" :tasks="tasksWaiting" />
        <TaskKanbanColumn title="Due Soon" :count="tasksDueSoon.length" :tasks="tasksDueSoon" />
        <TaskKanbanColumn title="Done" :count="tasksDone.length" :tasks="tasksDone" />
      </div>

      <aside class="page--tasks__rail">
        <TaskUpcomingDeadlinesCard :deadlines="tasksDeadlines" />
        <TaskCategoriesCard :categories="tasksCategories" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue'
import KpiRow from '../components/KpiRow.vue'
import TaskKanbanColumn from '../components/tasks/TaskKanbanColumn.vue'
import TaskUpcomingDeadlinesCard from '../components/tasks/TaskUpcomingDeadlinesCard.vue'
import TaskCategoriesCard from '../components/tasks/TaskCategoriesCard.vue'
import {
  tasksKpis,
  tasksTodo,
  tasksWaiting,
  tasksDueSoon,
  tasksDone,
  tasksDeadlines,
  tasksCategories,
} from '../data/tasks'
</script>

<style scoped lang="scss">
.page--tasks {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--tasks__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--tasks__body {
    grid-template-columns: 3fr 1fr;
  }
}
.page--tasks__columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .page--tasks__columns {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1280px) {
  .page--tasks__columns {
    grid-template-columns: repeat(4, 1fr);
  }
}
.page--tasks__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
