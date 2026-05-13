<!-- src/components/dashboard/TodayAcrossArtistsTable.vue -->
<template>
  <VaCard class="today-artists">
    <header class="today-artists__head">
      <h2 class="today-artists__title">Today Across Artists</h2>
    </header>

    <RouterLink
      v-for="row in rows"
      :key="row.artist.id"
      :to="{ name: 'artist-detail', params: { id: row.artist.id } }"
      class="today-artists__row"
    >
      <div class="today-artists__avatar">{{ row.artist.avatarInitials }}</div>
      <div class="today-artists__artist">
        <div class="today-artists__artist-name">{{ row.artist.name }}</div>
        <div class="today-artists__artist-tour">{{ row.artist.tourName }}</div>
      </div>
      <div class="today-artists__city">{{ row.city }}</div>
      <VaBadge :text="row.dayStatus" :color="vaBadgeTokens[row.dayStatus]" />
      <div class="today-artists__next">
        <div class="today-artists__next-title">{{ row.nextUp.title }}</div>
        <div class="today-artists__next-sub">{{ row.nextUp.sub }}</div>
      </div>
      <VaBadge :text="row.track" :color="vaBadgeTokens[row.track]" class="today-artists__track" />
    </RouterLink>

    <footer class="today-artists__footer">
      <RouterLink :to="{ name: 'tour-dates' }" class="today-artists__footer-link">
        View Full Run Overview →
      </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ArtistTodayRow } from '../../data/types'
import { vaBadgeTokens } from '../../data/severity'

defineProps<{
  rows: ArtistTodayRow[]
}>()
</script>

<style scoped lang="scss">
.today-artists {
  padding: 1.25rem 1.25rem 0.5rem;
}

.today-artists__head {
  margin-bottom: 0.75rem;
}

.today-artists__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.today-artists__row {
  display: grid;
  grid-template-columns: 2.25rem 1.5fr 1fr auto 1.5fr auto;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  color: inherit;
  text-decoration: none;

  &:hover {
    background: var(--va-background-element);
  }
}

.today-artists__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: var(--va-primary);
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
}

.today-artists__artist-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.today-artists__artist-tour {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today-artists__city {
  font-size: 0.875rem;
  color: var(--va-secondary);
}

.today-artists__next-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.today-artists__next-sub {
  font-size: 0.8125rem;
  color: var(--va-secondary);
}

.today-artists__track {
  justify-self: end;
}

.today-artists__footer {
  padding: 0.875rem 0;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.today-artists__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
