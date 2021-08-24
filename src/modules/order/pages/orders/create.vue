<template>
  <div>
    <app-order-form
      @submit="submit"
      @cancel="cancel"
    />
  </div>
</template>
<script>
import AppOrderForm from '@/modules/order/components/orderForm'
export default {
  name: 'CreateOrder',
  components: {
    AppOrderForm,
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    submit(order) {
      console.log('submit order', order)
    },
  },
}
</script>
<style></style>
