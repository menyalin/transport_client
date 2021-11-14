<template>
  <div
    class="order-wrapper"
    @dblclick.stop="dblclickHandler"
  >
    <div>row1</div>
    <div>row2</div>
  </div>
</template>
<script>
export default {
  name: 'OrderCell',
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  methods: {
    dblclickHandler() {
      this.$router.push('/orders/' + this.orderId)
    },
  },
}
</script>
<style scoped>
.order-wrapper {
  height: 100%;
  width: 100%;
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
