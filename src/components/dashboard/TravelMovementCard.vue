<!-- src/components/dashboard/TravelMovementCard.vue -->
<template>
  <VaCard class="travel-watch">
    <header class="travel-watch__head">
      <VaIcon name="mso-flight" size="20px" color="secondary" />
      <h2 class="travel-watch__title">Travel & Movement Watch</h2>
    </header>

    <RouterLink v-for="row in rows" :key="row.id" :to="{ name: 'travel' }" class="travel-watch__row">
      <div class="travel-watch__body">
        <div class="travel-watch__primary">{{ row.primary }}</div>
        <div class="travel-watch__sub">{{ row.sub }}</div>
      </div>
      <VaBadge :text="tagLabel(row.tag)" :color="vaBadgeTokens[row.tag]" class="travel-watch__chip" />
    </RouterLink>

    <footer class="travel-watch__footer">
      <RouterLink :to="{ name: 'travel' }" class="travel-watch__footer-link"> View All Travel → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { TravelWatchRow, TravelWatchTag } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  rows: TravelWatchRow[]
}>()

function tagLabel(tag: TravelWatchTag): string {
  return tag.toUpperCase()
}
</script>

<style scoped lang="scss">
.travel-watch {
  padding: 1.25rem 1.25rem 0.5rem;
}

.travel-watch__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.travel-watch__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.travel-watch__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.travel-watch__body {
  min-width: 0;
}

.travel-watch__primary {
  font-weight: 600;
  font-size: 0.875rem;
}

.travel-watch__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.travel-watch__chip {
  flex-shrink: 0;
}

.travel-watch__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
  margin-top: 0.5rem;
}

.travel-watch__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
