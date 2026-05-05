<!-- src/pages/NotFound.vue -->
<template>
  <div class="not-found">
    <PageHeader title="Page not found" subtitle="404" />
    <p class="not-found__copy">The page you're looking for doesn't exist.</p>
    <RouterLink :to="{ name: 'dashboard' }" class="not-found__link"> ← Back to Dashboard </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
</script>

<style scoped lang="scss">
.not-found {
  padding: 2rem;
}

.not-found__copy {
  color: var(--va-secondary);
  margin: 0 0 1rem;
}

.not-found__link {
  color: var(--va-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
