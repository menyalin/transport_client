<template>
  <div
    class="order-wrapper"
    @dblclick.stop="dblclickHandler"
  >
    <div class="row-text">
      {{ firstRow }}
    </div>
    <div class="row-text">
      {{ secondRow }}
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'OrderCell',
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  computed: {
    order() {
      return this.$store.getters.ordersMap.get(this.orderId)
    },
    firstRow() {
      const addressId = this.order.route[0].address
      const hours = moment(this.order.route[0].plannedDate).format('hh')
      const addressName =
        this.$store.getters.addressMap.get(addressId).shortName || ' ---- '
      return `${addressName} - ${hours}`
    },
    secondRow() {
      let point
      let resRow = []
      const tmpPoints = this.order.route
        .slice(1)
        .filter((item) => !item.departureDate)

      if (tmpPoints.length) point = tmpPoints[0]
      else point = this.order.route.slice().reverse()[0]

      const addressId = point.address
      resRow.push(
        this.$store.getters.addressMap.get(addressId).shortName || ' ---- '
      )
      if (point.plannedDate) resRow.push(moment(point.plannedDate).format('hh'))
      return resRow.join(' - ')
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
.row-text {
  font-size: 11px;
  line-height: 11px;
  letter-spacing: -0.023em;
  font-weight: 300;
  overflow: hidden;
}
</style>
