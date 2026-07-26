<template>
  <v-data-table
    :items="preparedItems"
    :headers="tableHeaders"
    fixed-header
    v-model:options="options"
    height="75vh"
    :loading="loading"
    :items-per-page="-1"
    item-value="_id"
    @dblclick:row="dblClickRow"
    :style="{ boxSizing: 'border-box' }"
  >
    <template v-if="preparedItems.length" #[`body.append`]="{ items: tableItems }">
      <AppAppendPivorRow :headers="tableHeaders" :items="tableItems" />
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

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppAppendPivorRow from './appendPivotRow.vue'
import { PIVOT_HEADERS, DRIVER_DETAILS_HEADERS } from './headers.js'

defineOptions({ name: 'DriversSalaryTable' })

const store = useStore()
const router = useRouter()

const props = defineProps({
  items: Array,
  loading: Boolean,
  driver: String,
})

const emit = defineEmits(['chooseDriver'])

const options = defineModel('options', {
  type: Object,
  default: () => ({
    page: 1,
    itemsPerPage: -1,
    sortBy: [],
    sortDesc: [],
  }),
})

const headers = PIVOT_HEADERS
const headersForDriverMode = DRIVER_DETAILS_HEADERS

function chooseDriver(driverId) {
  emit('chooseDriver', driverId)
}

function dblClickRow(_, { item }) {
  if (item && props.driver) router.push(`/orders/${item._id}`)
}

const preparedItems = computed(() => {
  if (props.driver)
    return props.items.map((i, idx) => ({
      ...i,
      _paymentSum: i._paymentSum ? new Intl.NumberFormat().format(i._paymentSum) : 0,
      _totalSum: i.totalSum ? new Intl.NumberFormat().format(i.totalSum) : 0,
      _additionalPointsSum: i.additionalPointsSum,
      _rowNumber: idx + 1,
      _orderDate: i.orderDate ? new Date(i.orderDate).toLocaleString() : null,
    }))
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
</script>
