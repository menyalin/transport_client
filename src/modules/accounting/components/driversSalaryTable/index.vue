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
    :style="{ boxSizing: 'border-box' }"
  >
    <template
      v-if="preparedItems.length"
      v-slot:body.append="{ headers, items: tableItems }"
    >
      <app-append-pivor-row :headers="headers" :items="tableItems" />
    </template>

    <template v-slot:[`item.totalSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.totalSum) || 0 }}
    </template>
    <template v-slot:[`item.base`]="{ item }">
      {{ new Intl.NumberFormat().format(item.base) || 0 }}
    </template>
    <template v-slot:[`item.waiting`]="{ item }">
      {{ new Intl.NumberFormat().format(item.waiting) || 0 }}
    </template>
    <template v-slot:[`item.payment`]="{ item }">
      {{ new Intl.NumberFormat().format(item.payment) || 0 }}
    </template>
    <template v-slot:[`item.returnSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.returnSum) || 0 }}
    </template>

    <template v-slot:[`item.additionalPointsSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.additionalPointsSum) || 0 }}
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
import { PIVOT_HEADERS, DRIVER_DETAILS_HEADERS } from './headers.js'

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
        // Детализация по Водителю
        return props.items.map((i, idx) => ({
          ...i,
          _paymentSum: i._paymentSum
            ? new Intl.NumberFormat().format(i._paymentSum)
            : 0,
          _totalSum: i.totalSum
            ? new Intl.NumberFormat().format(i.totalSum)
            : 0,
          _additionalPointsSum: i.additionalPointsSum,
          _rowNumber: idx + 1,
          _orderDate: i.orderDate
            ? new Date(i.orderDate).toLocaleString()
            : null,
        }))
      // Сводная информация
      else
        return props.items.map((i, idx) => ({
          ...i,
          _rowNumber: idx + 1,
          _driverName: store.getters.driversMap.get(i._id)?.fullName,
          _count: i?.totalCount,

          avgGrade: i?.avgGrade
            ? new Intl.NumberFormat('ru', {
                minimumFractionDigits: 2,
              }).format(i.avgGrade)
            : null,
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
<style></style>
