<!-- eslint-disable vue/html-self-closing -->
<template>
  <div v-if="total" class="wrapper">
    <div>
      <b>Рейсы: {{ total }}</b>
    </div>
    <div>
      <b v-if="accepted" class="text-green">
        Приняты: {{ accepted }}
        <br />
      </b>

      <b v-if="needFix" class="text-orange">
        На исправлении: {{ needFix }}
        <br />
      </b>

      <b v-if="onCheck" :style="{ color: 'blue' }">
        На проверке: {{ onCheck }}
        <br />
      </b>

      <b v-if="missing" class="text-red">
        Не получены: {{ missing }}
        <br />
      </b>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderListFooterDetails',
  props: {
    total: Number,
    accepted: Number,
    needFix: Number,
    onCheck: Number,
    missing: Number,
  },
}
</script>
<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
    margin: 10px;
    font-size: 0.8rem;
  }
</style>
