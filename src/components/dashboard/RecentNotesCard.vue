<!-- src/components/dashboard/RecentNotesCard.vue -->
<template>
  <VaCard class="notes">
    <div class="notes__head">
      <VaIcon name="mso-sticky_note_2" size="18px" color="secondary" />
      <span class="notes__title">Recent Notes</span>
    </div>

    <ul class="notes__list">
      <li v-for="note in notes" :key="note.id" class="notes__row">
        <div class="notes__body">{{ note.body }}</div>
        <div class="notes__meta">
          <span class="notes__when">{{ formatShortDate(note.at.slice(0, 10)) }}, {{ formatTimeFromIso(note.at) }}</span>
          <VaAvatar size="small" color="secondary">{{ note.authorInitials }}</VaAvatar>
        </div>
      </li>
    </ul>

    <div class="notes__footer">
      <VaButton preset="secondary" size="small">View all notes →</VaButton>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { NoteEntry } from '../../data/types'
import { formatShortDate, formatTimeFromIso } from '../../data/format'

defineProps<{ notes: NoteEntry[] }>()
</script>

<style scoped lang="scss">
.notes {
  padding: 1.25rem;
}

.notes__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.notes__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.notes__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notes__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--va-background-border);

  &:last-child {
    border-bottom: none;
  }
}

.notes__body {
  font-size: 0.875rem;
  line-height: 1.4;
}

.notes__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  white-space: nowrap;
}

.notes__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
}

.notes__footer {
  margin-top: 1rem;
}
</style>
