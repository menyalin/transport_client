<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="wrapper" v-if="total">
    <div>
      <b>Рейсы: {{ total }}</b>
    </div>
    <div>
      <b v-if="accepted" class="green--text">
        Приняты: {{ accepted }} <br />
      </b>

      <b v-if="needFix" class="orange--text">
        На исправлении: {{ needFix }}<br />
      </b>

      <b v-if="onCheck" class="blue--text">
        На проверке: {{ onCheck }}
        <br />
      </b>

      <b v-if="missing" class="red--text">
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
  justify-content: end;
  gap: 20px;
  margin: 10px;
  font-size: 0.8rem;
}
</style>
