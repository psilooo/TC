<!-- src/components/documents/SelectedFilePanel.vue -->
<template>
  <VaCard class="sfp">
    <div class="sfp__layout">
      <div class="sfp__icon">
        <VaIcon name="mso-picture_as_pdf" size="64px" color="secondary" />
      </div>
      <div class="sfp__body">
        <div class="sfp__head">
          <span class="sfp__name">{{ file.name }}</span>
          <span class="sfp__pill" :class="[statusTokens[file.status].bg, statusTokens[file.status].text]">{{
            file.status
          }}</span>
        </div>
        <dl class="sfp__meta">
          <div class="sfp__row">
            <dt>Category</dt>
            <dd>{{ file.category }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Show</dt>
            <dd>{{ file.show }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Uploaded</dt>
            <dd>{{ file.uploadedBy }} · {{ formatShortDate(file.uploadedDate) }}</dd>
          </div>
          <div class="sfp__row">
            <dt>Size</dt>
            <dd>{{ file.sizeKb }} KB</dd>
          </div>
          <div v-if="file.signers && file.signers.length" class="sfp__row">
            <dt>Signers</dt>
            <dd>{{ file.signers.join(' · ') }}</dd>
          </div>
        </dl>
        <p class="sfp__preview">{{ file.preview }}</p>
        <div class="sfp__actions">
          <VaButton preset="secondary" size="small" icon="mso-visibility">View</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-download">Download</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-swap_horiz">Replace</VaButton>
          <VaButton preset="secondary" size="small" icon="mso-delete">Delete</VaButton>
        </div>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import type { DocsSelectedFile } from '../../data/types'
import { statusTokens } from '../../data/severity'
import { formatShortDate } from '../../data/format'

defineProps<{ file: DocsSelectedFile }>()
</script>

<style scoped lang="scss">
.sfp {
  padding: 1.25rem;
}
.sfp__layout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
}
.sfp__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 7rem;
  background: var(--va-background-element);
  border-radius: 0.5rem;
}
.sfp__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.sfp__name {
  font-size: 1rem;
  font-weight: 700;
}
.sfp__pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}
.sfp__meta {
  margin: 0 0 0.75rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.sfp__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 0.5rem;
  padding: 0.125rem 0;
}
.sfp__row dt {
  font-size: 0.8125rem;
  color: var(--va-secondary);
  margin: 0;
}
.sfp__row dd {
  font-size: 0.875rem;
  margin: 0;
}
.sfp__preview {
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 0.75rem;
  color: var(--va-secondary);
}
.sfp__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
