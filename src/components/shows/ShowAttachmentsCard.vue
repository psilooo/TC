<!-- src/components/shows/ShowAttachmentsCard.vue -->
<template>
  <VaCard class="show-att">
    <div class="show-att__head">
      <VaIcon name="mso-attach_file" size="18px" color="secondary" />
      <span class="show-att__title">Attachments / Documents</span>
    </div>
    <ul class="show-att__list">
      <li v-for="f in files" :key="f.id" class="show-att__row">
        <VaIcon name="mso-description" size="18px" color="secondary" />
        <div class="show-att__body">
          <div class="show-att__name">{{ f.name }}</div>
          <div class="show-att__sub">{{ f.type }} · {{ f.sizeKb }} KB</div>
        </div>
        <VaIcon name="mso-download" size="18px" color="secondary" />
      </li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowAttachment } from '../../data/types'

defineProps<{ files: ShowAttachment[] }>()
</script>

<style scoped lang="scss">
.show-att {
  padding: 1.25rem;
}
.show-att__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-att__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-att__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-att__row {
  display: grid;
  grid-template-columns: 1.25rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-att__row:last-child {
  border-bottom: none;
}
.show-att__name {
  font-size: 0.875rem;
  font-weight: 500;
}
.show-att__sub {
  font-size: 0.75rem;
  color: var(--va-secondary);
}
</style>
