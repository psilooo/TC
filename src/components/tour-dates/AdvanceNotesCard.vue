<!-- src/components/tour-dates/AdvanceNotesCard.vue -->
<template>
  <VaCard class="anc">
    <div class="anc__head">
      <VaIcon name="mso-sticky_note_2" size="18px" color="secondary" />
      <span class="anc__title">Notes</span>
    </div>
    <ul class="anc__list">
      <li v-for="note in notes" :key="note.id" class="anc__row">
        <div class="anc__body">{{ note.body }}</div>
        <div class="anc__meta">
          <span class="anc__when">{{ formatRelativeDateTime(note.at) }}</span>
          <VaAvatar size="small" color="secondary">{{ note.authorInitials }}</VaAvatar>
        </div>
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { NoteEntry } from '../../data/types'
import { formatRelativeDateTime } from '../../data/format'

defineProps<{ notes: NoteEntry[] }>()
</script>

<style scoped lang="scss">
.anc {
  padding: 1.25rem;
}
.anc__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.anc__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.anc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.anc__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.anc__row:last-child {
  border-bottom: none;
}
.anc__body {
  font-size: 0.875rem;
  line-height: 1.4;
}
.anc__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  white-space: nowrap;
}
.anc__when {
  font-size: 0.75rem;
  color: var(--va-secondary);
}
</style>
