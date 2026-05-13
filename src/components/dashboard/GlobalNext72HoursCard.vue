<!-- src/components/dashboard/GlobalNext72HoursCard.vue -->
<template>
  <VaCard class="next72">
    <header class="next72__head">
      <VaIcon name="mso-schedule" size="20px" color="secondary" />
      <h2 class="next72__title">Next 72 Hours</h2>
    </header>

    <div v-for="group in groups" :key="group.label" class="next72__group">
      <div class="next72__day-label">{{ group.label }}</div>

      <RouterLink v-for="ev in group.events" :key="ev.id" :to="routeFor(ev.kind)" class="next72__row">
        <div class="next72__row-body">
          <div class="next72__row-title">{{ ev.title }}</div>
          <div v-if="ev.sub && ev.sub !== '—'" class="next72__row-sub">{{ ev.sub }}</div>
        </div>
        <VaBadge :text="kindLabel(ev.kind)" :color="timelineKindColor[ev.kind]" class="next72__row-chip" />
      </RouterLink>
    </div>

    <footer class="next72__footer">
      <RouterLink :to="{ name: 'itinerary' }" class="next72__footer-link"> View Full Timeline → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { GlobalTimelineGroup, TimelineKind } from '../../data/types'
import { timelineKindColor } from '../../data/severity'

defineProps<{
  groups: GlobalTimelineGroup[]
}>()

function routeFor(kind: TimelineKind): RouteLocationRaw {
  if (kind === 'Show') return { name: 'shows' }
  if (kind === 'Travel') return { name: 'travel' }
  return { name: 'tasks' } // Deadline
}

function kindLabel(kind: TimelineKind): string {
  return kind.toUpperCase()
}
</script>

<style scoped lang="scss">
.next72 {
  padding: 1.25rem 1.25rem 0.5rem;
}

.next72__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.next72__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.next72__group + .next72__group {
  margin-top: 1rem;
}

.next72__day-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--va-secondary);
  padding: 0.5rem 0 0.25rem;
  border-top: 1px solid var(--va-background-border);
}

.next72__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.next72__row-body {
  min-width: 0;
}

.next72__row-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.next72__row-sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.next72__row-chip {
  flex-shrink: 0;
}

.next72__footer {
  padding: 0.875rem 0 0.25rem;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.75rem;
}

.next72__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
