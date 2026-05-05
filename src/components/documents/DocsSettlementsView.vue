<!-- src/components/documents/DocsSettlementsView.vue -->
<template>
  <div class="page page--docs">
    <PageHeader title="Documents & Settlements">
      <template #breadcrumb>
        <Breadcrumb :items="['Tour Dashboard', 'Documents & Settlements']" />
      </template>
    </PageHeader>

    <KpiRow :kpis="docsKpis" />

    <section class="page--docs__body">
      <div class="page--docs__main">
        <div class="page--docs__tables">
          <DocumentsTable :files="docsFiles" :selected-id="docsSelectedId" />
          <SettlementQueueTable :settlements="docsSettlements" />
        </div>
        <SelectedFilePanel :file="docsSelectedFile" />
      </div>

      <aside class="page--docs__rail">
        <DocsQuickActionsCard />
        <DocsMissingCard :items="docsMissing" />
        <DocsSettlementIssuesCard :issues="docsIssues" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../PageHeader.vue'
import Breadcrumb from '../Breadcrumb.vue'
import KpiRow from '../KpiRow.vue'
import DocumentsTable from './DocumentsTable.vue'
import SettlementQueueTable from './SettlementQueueTable.vue'
import SelectedFilePanel from './SelectedFilePanel.vue'
import DocsQuickActionsCard from './DocsQuickActionsCard.vue'
import DocsMissingCard from './DocsMissingCard.vue'
import DocsSettlementIssuesCard from './DocsSettlementIssuesCard.vue'
import {
  docsKpis,
  docsFiles,
  docsSelectedId,
  docsSelectedFile,
  docsSettlements,
  docsMissing,
  docsIssues,
} from '../../data/documents'
</script>

<style scoped lang="scss">
.page--docs {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--docs__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page--docs__body {
    grid-template-columns: 3fr 1fr;
  }
}
.page--docs__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page--docs__tables {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1280px) {
  .page--docs__tables {
    grid-template-columns: 1fr 1fr;
  }
}
.page--docs__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
