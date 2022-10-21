<template>
  <v-data-table
    :items="preparedItems"
    :headers="headers"
    dense
    :loading="loading"
    :items-per-page="-1"
  />
</template>
<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'DriversSalaryTable',
  props: {
    items: Array,
    loading: Boolean,
  },
  setup(props) {
    const headers = [
      { text: 'Водитель', value: '_driverName', sortable: false },
      { text: 'Кол-во рейсов', value: '_count', sortable: false },
      { text: 'База', value: '_base', sortable: false },
      { text: 'Доплата', value: '_payment', sortable: false },
    ]

    const preparedItems = computed(() => {
      return props.items.map((i) => ({
        ...i,
        _driverName: store.getters.driversMap.get(i._id)?.fullName,
        _count: i?.totalCount,
        _base: i?.base ? new Intl.NumberFormat().format(i.base) : null,
        _payment: i?.payment ? new Intl.NumberFormat().format(i.payment) : null,
      }))
    })

    return {
      preparedItems,
      headers,
    }
  },
}
</script>
<style></style>
