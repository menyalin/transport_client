<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="wrapper">
    <div>
      <b>Рейсы: {{ total }}</b>
    </div>
    <div>
      <b class="green--text">Приняты: {{ accepted }} </b><br />
      <b class="orange--text">На исправлении: {{ needFix }}</b> <br />
      <b class="red--text">На проверке: {{ onCheck }} </b><br />
      <b class="red--text">Не получены: {{ missing }} </b><br />
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
  margin: 20px;
}
</style>
