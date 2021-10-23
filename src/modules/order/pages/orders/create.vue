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
import orderService from '@/modules/order/services/order.service'
export default {
  name: 'CreateOrder',
  components: {
    AppOrderForm,
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    async submit(order) {
      const newOrder = await orderService.create(order)
    },
  },
}
</script>
<style></style>
