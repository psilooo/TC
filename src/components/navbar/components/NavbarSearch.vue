<!-- src/components/navbar/components/NavbarSearch.vue -->
<template>
  <VaInput
    class="navbar-search"
    placeholder="Search shows, dates, venues, contacts, tasks, and more…"
    aria-label="Global search"
  >
    <template #prependInner>
      <VaIcon name="mso-search" color="secondary" />
    </template>
  </VaInput>
</template>

<style scoped lang="scss">
.navbar-search {
  min-width: 16rem;
  flex: 1 1 auto;
}
</style>
