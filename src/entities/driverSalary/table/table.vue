<template>
  <v-data-table
    v-model:options="options"
    :items="preparedItems"
    :headers="tableHeaders"
    density="compact"
    fixed-header
    height="75vh"
    :loading="loading"
    :items-per-page="-1"
    :style="{ boxSizing: 'border-box' }"
    @dblclick:row="dblClickRow"
  >
    <template
      v-if="preparedItems.length"
      #[`body.append`]="{ headers, items: tableItems }"
    >
      <app-append-pivor-row :headers="headers" :items="tableItems" />
    </template>

    <template #[`item.totalSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.totalSum) || 0 }}
    </template>
    <template #[`item.base`]="{ item }">
      {{ new Intl.NumberFormat().format(item.base) || 0 }}
    </template>
    <template #[`item.waiting`]="{ item }">
      {{ new Intl.NumberFormat().format(item.waiting) || 0 }}
    </template>
    <template #[`item.payment`]="{ item }">
      {{ new Intl.NumberFormat().format(item.payment) || 0 }}
    </template>
    <template #[`item.returnSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.returnSum) || 0 }}
    </template>

    <template #[`item.additionalPointsSum`]="{ item }">
      {{ new Intl.NumberFormat().format(item.additionalPointsSum) || 0 }}
    </template>
    <template #[`item._driverName`]="{ item }">
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
