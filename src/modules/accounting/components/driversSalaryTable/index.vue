<template>
  <v-data-table
    :items="preparedItems"
    :headers="tableHeaders"
    dense
    fixed-header
    :options.sync="options"
    height="75vh"
    :loading="loading"
    :items-per-page="-1"
    @dblclick:row="dblClickRow"
  >
    <template
      v-if="preparedItems.length && !driver"
      v-slot:body.append="{ headers, items: tableItems }"
    >
      <app-append-pivor-row :headers="headers" :items="tableItems" />
    </template>
    <template v-slot:[`item._driverName`]="{ item }">
      <a @click="chooseDriver(item._id)"> {{ item._driverName }} </a>
    </template>
  </v-data-table>
</template>
<script>
import { computed, ref, watch } from 'vue'
import store from '@/store'
import router from '@/router'
import AppAppendPivorRow from './appendPivotRow.vue'
import { PIVOT_HEADERS, DRIVER_DETAILS_HEADERS } from './constants.js'

export default {
  name: 'DriversSalaryTable',
  components: {
    AppAppendPivorRow,
  },
  props: {
    items: Array,
    loading: Boolean,
    driver: String,
    listSettings: Object,
    setListSettings: Function,
  },
  setup(props, ctx) {
    const headers = PIVOT_HEADERS
    const options = ref({})

    watch(options, () => {
      // props.setListSettings(options.value)
    })

    const headersForDriverMode = DRIVER_DETAILS_HEADERS

    function chooseDriver(driverId) {
      ctx.emit('chooseDriver', driverId)
    }

    function dblClickRow(_, { item }) {
      if (item && props.driver) router.push(`/orders/${item._id}`)
    }

    const preparedItems = computed(() => {
      if (props.driver)
        return props.items.map((i, idx) => ({
          ...i,
          // _payment: i._payment ? new Intl.NumberFormat().format(i._payment) : 0,
          _rowNumber: idx + 1,
          _orderDate: i.orderDate
            ? new Date(i.orderDate).toLocaleString()
            : null,
        }))
      else
        return props.items.map((i, idx) => ({
          ...i,
          _rowNumber: idx + 1,
          _driverName: store.getters.driversMap.get(i._id)?.fullName,
          _count: i?.totalCount,
          _base: i?.base ? new Intl.NumberFormat().format(i.base) : 0,
          _waiting: i?.base ? new Intl.NumberFormat().format(i.waiting) : 0,
          _payment: i?.payment ? new Intl.NumberFormat().format(i.payment) : 0,
        }))
    })

    const tableHeaders = computed(() => {
      return props.driver ? headersForDriverMode : headers
    })

    return {
      chooseDriver,
      preparedItems,
      tableHeaders,
      dblClickRow,
      options,
    }
  },
}
</script>
<style scoped></style>
