<!-- src/components/dashboard/ArtistReadinessGrid.vue -->
<template>
  <VaCard class="readiness">
    <header class="readiness__head">
      <h2 class="readiness__title">Artist Readiness Overview</h2>
    </header>

    <div class="readiness__grid">
      <RouterLink
        v-for="card in cards"
        :key="card.artist.id"
        :to="{ name: 'artist-detail', params: { id: card.artist.id } }"
        class="readiness__card"
      >
        <div class="readiness__top">
          <div class="readiness__avatar">{{ card.artist.avatarInitials }}</div>
          <div class="readiness__identity">
            <div class="readiness__name">{{ card.artist.name }}</div>
            <div class="readiness__tour">{{ card.artist.tourName }}</div>
            <div class="readiness__today">{{ card.todayLabel }}</div>
          </div>
          <svg viewBox="0 0 36 36" class="readiness__ring" aria-hidden="true">
            <!-- track -->
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--va-background-element)" stroke-width="3" />
            <!-- progress: rotate -90° around center so the dash starts at 12 o'clock and fills clockwise -->
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="var(--va-primary)"
              stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="`${card.readinessPct} ${100 - card.readinessPct}`"
              transform="rotate(-90 18 18)"
            />
            <text x="18" y="20.5" text-anchor="middle" font-size="9" font-weight="700">{{ card.readinessPct }}%</text>
          </svg>
        </div>
        <div class="readiness__stats">
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.risks }}</div>
            <div class="readiness__stat-label">Risks</div>
          </div>
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.tasksDue }}</div>
            <div class="readiness__stat-label">Tasks Due</div>
          </div>
          <div class="readiness__stat">
            <div class="readiness__stat-value">{{ card.daysToShow }}</div>
            <div class="readiness__stat-label">Days to Show</div>
          </div>
        </div>
      </RouterLink>
    </div>

    <footer class="readiness__footer">
      <RouterLink :to="{ name: 'artists' }" class="readiness__footer-link"> View All Artist Details → </RouterLink>
    </footer>
  </VaCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ArtistReadiness } from '../../data/types'

defineProps<{
  cards: ArtistReadiness[]
}>()
</script>

<style scoped lang="scss">
.readiness {
  padding: 1.25rem;
}

.readiness__head {
  margin-bottom: 1rem;
}

.readiness__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.readiness__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.readiness__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  color: inherit;
  text-decoration: none;
  background: var(--va-background-secondary);

  &:hover {
    background: var(--va-background-element);
  }
}

.readiness__top {
  display: grid;
  grid-template-columns: 2.5rem 1fr 3.5rem;
  gap: 0.75rem;
  align-items: center;
}

.readiness__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--va-primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
}

.readiness__name {
  font-weight: 700;
  font-size: 0.9375rem;
}

.readiness__tour {
  font-size: 0.75rem;
  color: var(--va-secondary);
  margin-top: 0.125rem;
}

.readiness__today {
  font-size: 0.75rem;
  color: var(--va-secondary);
}

.readiness__ring {
  width: 3.5rem;
  height: 3.5rem;
}

.readiness__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.readiness__stat {
  text-align: center;
}

.readiness__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.readiness__stat-label {
  font-size: 0.6875rem;
  color: var(--va-secondary);
  letter-spacing: 0.02em;
}

.readiness__footer {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--va-background-border);
  text-align: right;
}

.readiness__footer-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--va-primary);
  text-decoration: none;
}
</style>
