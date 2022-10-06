<template>
  <div class="list-wrapper">
    <div>
      <v-btn icon>
        <v-icon>mdi-autorenew</v-icon>
      </v-btn>
    </div>
    тут будут рейсы для бухгалтера
  </div>
</template>
<script>
// import OrderService from '@/modules/order/services/order.service'

export default {
  name: 'OrdersListAccounting',
  data() {
    return {
      orders: [],
      settings: {},
    }
  },
}
</script>
<style scoped>
.list-wrapper {
  padding: 15px;
}
</style>
