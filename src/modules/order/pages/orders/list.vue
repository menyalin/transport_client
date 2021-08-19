<template>
  <div>
    <div class="filter-wrapper">
      <app-date-time-input
        hidePrependIcon
        hideTimeInput
        label="Начало периода"
      />
      <app-date-time-input
        hidePrependIcon
        hideTimeInput
        label="Конец периода"
      />
    </div>
  </div>
</template>
<script>
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'ListOrder',
  components: {
    AppDateTimeInput,
  },
  data: () => ({
    dialog: false,
  }),
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
}
.filter-wrapper > * {
  padding: 0px 10px;
}
</style>
