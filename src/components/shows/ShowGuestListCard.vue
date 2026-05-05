<!-- src/components/shows/ShowGuestListCard.vue -->
<template>
  <VaCard class="show-gl">
    <div class="show-gl__head">
      <VaIcon name="mso-list_alt" size="18px" color="secondary" />
      <span class="show-gl__title">Guest List & Holds</span>
    </div>
    <dl class="show-gl__list">
      <div class="show-gl__row">
        <dt>Capacity</dt>
        <dd>{{ data.capacity.toLocaleString() }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Sold</dt>
        <dd>{{ data.sold.toLocaleString() }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Holds</dt>
        <dd>{{ data.holds }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>Comps</dt>
        <dd>{{ data.comps }}</dd>
      </div>
      <div class="show-gl__row">
        <dt>On List</dt>
        <dd>{{ data.onList }}</dd>
      </div>
    </dl>
  </VaCard>
</template>

<script setup lang="ts">
import type { ShowGuestListData } from '../../data/types'

defineProps<{ data: ShowGuestListData }>()
</script>

<style scoped lang="scss">
.show-gl {
  padding: 1.25rem;
}
.show-gl__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.show-gl__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-gl__list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.show-gl__row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--va-background-border);
}
.show-gl__row:last-child {
  border-bottom: none;
}
.show-gl__row dt {
  font-size: 0.875rem;
  color: var(--va-secondary);
  margin: 0;
}
.show-gl__row dd {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}
</style>
