<script setup>
defineProps({ formattedPeriodDates: Array })
</script>

<template>
  <div class="dates-row">
    <div>
      c:
      <div class="date-span">{{ formattedPeriodDates[0] }}</div>
    </div>
    <div>
      по:
      <div class="date-span">{{ formattedPeriodDates[1] }}</div>
    </div>
  </div>
</template>
<style scoped>
.dates-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  cursor: pointer;
}
.date-span {
  display: inline-block;
  font-weight: 600;
  min-width: 5rem;
  text-align: center;
}
</style>
