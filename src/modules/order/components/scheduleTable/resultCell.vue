<template>
  <div class="result-wrapper">
    <div class="first-row">
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </div>

    <div class="second-row text-center">
      {{ new Date(date).toLocaleDateString() }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResultCell',
  props: {
    date: String,
  },
}
</script>
<style scoped>
.result-wrapper {
  background-color: white;
  margin: 1px;
}
.first-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.first-row > div {
  width: 25%;
  text-align: center;
  font-size: 10px;
}
</style>
