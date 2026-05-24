<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="wrapper">
    <div>
      <b>Рейсы: {{ total }}</b>
    </div>
    <div>
      <b class="text-green">Приняты: {{ accepted }} </b><br />
      <b class="text-orange">На исправлении: {{ needFix }}</b> <br />
      <b class="text-red">На проверке: {{ onCheck }} </b><br />
      <b class="text-red">Не получены: {{ missing }} </b><br />
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
