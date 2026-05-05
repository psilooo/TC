<!-- src/components/documents/DocsQuickActionsCard.vue -->
<template>
  <VaCard class="dqa">
    <div class="dqa__head">
      <VaIcon name="mso-bolt" size="18px" color="secondary" />
      <span class="dqa__title">Quick Actions</span>
    </div>
    <div class="dqa__list">
      <button type="button" class="dqa__action"><VaIcon name="mso-upload" size="18px" />Upload File</button>
      <button type="button" class="dqa__action"><VaIcon name="mso-draw" size="18px" />Request Signature</button>
      <button type="button" class="dqa__action">
        <VaIcon name="mso-folder_zip" size="18px" />Bundle for Settlement
      </button>
      <button type="button" class="dqa__action"><VaIcon name="mso-share" size="18px" />Share with Promoter</button>
    </div>
  </VaCard>
</template>

<style scoped lang="scss">
.dqa {
  padding: 1.25rem;
}
.dqa__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.dqa__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.dqa__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.dqa__action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--va-background-border);
  border-radius: 0.5rem;
  background: var(--va-background-primary);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
}
.dqa__action:hover {
  background: var(--va-background-element);
}
</style>
