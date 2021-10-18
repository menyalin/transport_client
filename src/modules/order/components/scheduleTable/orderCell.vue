<template>
  <div class="order-wrapper">
    <div>row1</div>
    <div>row2</div>
  </div>
</template>
<script>
export default {
  name: 'OrderCell',
}
</script>
<style scoped>
.order-wrapper {
  background-color: goldenrod;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 0em;
  font-weight: 300;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
