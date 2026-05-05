<!-- src/components/shows/ShowScheduleCard.vue -->
<template>
  <VaCard class="show-sched">
    <div class="show-sched__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="show-sched__title">Schedule</span>
    </div>
    <ul class="show-sched__timeline">
      <li v-for="ev in events" :key="ev.id" class="show-sched__item">
        <div class="show-sched__rail"><span class="show-sched__dot" /></div>
        <div class="show-sched__time">{{ ev.time }}</div>
        <div class="show-sched__body">
          <div class="show-sched__name">{{ ev.title }}</div>
          <div class="show-sched__sub">{{ ev.sub }}</div>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { TimelineEvent } from '../../data/types'

defineProps<{ events: TimelineEvent[] }>()
</script>

<style scoped lang="scss">
.show-sched {
  padding: 1.25rem;
}
.show-sched__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-sched__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-sched__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.show-sched__item {
  display: grid;
  grid-template-columns: 1rem 4rem 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  position: relative;
}
.show-sched__rail {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
}
.show-sched__rail::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--va-background-border);
}
.show-sched__item:first-child .show-sched__rail::before {
  top: 0.5rem;
}
.show-sched__item:last-child .show-sched__rail::before {
  bottom: calc(100% - 0.5rem);
}
.show-sched__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--va-primary);
  margin-top: 0.5rem;
  z-index: 1;
}
.show-sched__time {
  font-size: 0.8125rem;
  font-weight: 600;
  padding-top: 0.25rem;
}
.show-sched__name {
  font-size: 0.875rem;
  font-weight: 600;
}
.show-sched__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}
</style>
