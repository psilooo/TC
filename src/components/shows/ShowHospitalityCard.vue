<!-- src/components/shows/ShowHospitalityCard.vue -->
<template>
  <VaCard class="show-hosp">
    <div class="show-hosp__head">
      <VaIcon name="mso-restaurant" size="18px" color="secondary" />
      <span class="show-hosp__title">Hospitality / Notes</span>
    </div>
    <p class="show-hosp__rider">{{ notes.rider }}</p>
    <ul class="show-hosp__bullets">
      <li v-for="(b, i) in notes.bullets" :key="i">{{ b }}</li>
    </ul>
  </VaCard>
</template>

<script setup lang="ts">
defineProps<{ notes: { rider: string; bullets: string[] } }>()
</script>

<style scoped lang="scss">
.show-hosp {
  padding: 1.25rem;
}
.show-hosp__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.show-hosp__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.show-hosp__rider {
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 0.75rem;
}
.show-hosp__bullets {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
}
.show-hosp__bullets li {
  margin-bottom: 0.25rem;
}
</style>
