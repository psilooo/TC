<!-- src/components/dashboard/TodayTimelineCard.vue -->
<template>
  <VaCard class="today">
    <div class="today__head">
      <VaIcon name="mso-schedule" size="18px" color="secondary" />
      <span class="today__title">Today — {{ formatShortDate(date) }}</span>
    </div>

    <ul class="today__timeline">
      <li v-for="ev in events" :key="ev.id" class="today__item">
        <div class="today__rail">
          <span class="today__dot" />
        </div>
        <div class="today__time">{{ ev.time }}</div>
        <div class="today__body">
          <div class="today__name">{{ ev.title }}</div>
          <div class="today__sub">{{ ev.sub }}</div>
        </div>
      </li>
    </ul>

    <div class="today__footer">
      <VaButton preset="secondary" size="small">View full day →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { TimelineEvent } from '../../data/types'
import { formatShortDate } from '../../data/format'

defineProps<{
  date: string
  events: TimelineEvent[]
}>()
</script>

<style scoped lang="scss">
.today {
  padding: 1.25rem;
}

.today__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.today__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.today__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.today__item {
  display: grid;
  grid-template-columns: 1.25rem 4rem 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  position: relative;
}

.today__rail {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--va-background-border);
  }
}

.today__item:first-child .today__rail::before {
  top: 0.5rem;
}

.today__item:last-child .today__rail::before {
  bottom: calc(100% - 0.5rem);
}

.today__dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--va-primary);
  margin-top: 0.5rem;
  z-index: 1;
}

.today__time {
  font-size: 0.8125rem;
  font-weight: 600;
  padding-top: 0.25rem;
}

.today__name {
  font-size: 0.875rem;
  font-weight: 600;
}

.today__sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today__footer {
  margin-top: 1rem;
}
</style>
