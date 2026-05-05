<!-- src/components/documents/DocumentsTable.vue -->
<template>
  <VaCard class="dt">
    <div class="dt__head">
      <span class="dt__title">Documents</span>
      <div class="dt__actions">
        <VaInput class="dt__search" placeholder="Search files…" aria-label="Search files">
          <template #prependInner><VaIcon name="mso-search" color="secondary" /></template>
        </VaInput>
        <VaButton preset="secondary" size="small" icon="mso-filter_list">Filters</VaButton>
      </div>
    </div>
    <table class="dt__table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Category</th>
          <th>Show</th>
          <th>Uploaded By</th>
          <th>Date</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in files" :key="f.id" :class="{ 'dt__row--selected': f.id === selectedId }">
          <td><VaIcon :name="iconFor(f.type)" size="18px" color="secondary" /></td>
          <td>{{ f.name }}</td>
          <td>{{ f.category }}</td>
          <td>{{ f.show }}</td>
          <td>{{ f.uploadedBy }}</td>
          <td>{{ formatShortDate(f.uploadedDate) }}</td>
          <td>
            <span class="dt__pill" :class="[statusTokens[f.status].bg, statusTokens[f.status].text]">{{
              f.status
            }}</span>
          </td>
          <td><VaIcon name="mso-more_vert" size="18px" color="secondary" /></td>
        </tr>
      </tbody>
    </table>
  </VaCard>
</template>

<script setup lang="ts">
import type { FileEntry, FileType } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ files: FileEntry[]; selectedId: string }>()

function iconFor(t: FileType): string {
  switch (t) {
    case 'PDF':
      return 'mso-picture_as_pdf'
    case 'Doc':
      return 'mso-description'
    case 'Image':
      return 'mso-image'
    case 'Sheet':
      return 'mso-table_chart'
  }
}
</script>

<style scoped lang="scss">
.dt {
  padding: 1.25rem;
}
.dt__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.dt__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dt__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}
.dt__search {
  max-width: 16rem;
  flex: 1;
}
.dt__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.dt__table th,
.dt__table td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--va-background-border);
}
.dt__table th {
  color: var(--va-secondary);
  font-weight: 500;
  font-size: 0.75rem;
}
.dt__table tbody tr:last-child td {
  border-bottom: none;
}
.dt__row--selected {
  background: var(--va-background-element);
}
.dt__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}
</style>
