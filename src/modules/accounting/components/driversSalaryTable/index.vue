<template>
  <v-data-table
    :items="preparedItems"
    :headers="tableHeaders"
    dense
    fixed-header
    height="75vh"
    :loading="loading"
    :items-per-page="-1"
    @dblclick:row="dblClickRow"
  >
    <template v-slot:[`item._driverName`]="{ item }">
      <a @click="chooseDriver(item._id)">
        {{ item._driverName }}
      </a>
    </template>
  </v-data-table>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'
import router from '@/router'

export default {
  name: 'DriversSalaryTable',
  props: {
    items: Array,
    loading: Boolean,
    driver: String,
  },
  setup(props, ctx) {
    const headers = [
      { text: 'Водитель', value: '_driverName', sortable: false },
      { text: 'Кол-во рейсов', value: '_count', sortable: false },
      { text: 'База', value: '_base', sortable: false },
      { text: 'Доплата', value: '_payment', sortable: false },
      { text: 'Средняя оценка', value: 'avgGrade', sortable: false },
    ]

    const headersForDriverMode = [
      { text: 'Дата рейса', value: '_orderDate', sortable: false },
      { text: 'Клиент', value: '_client.name', sortable: false },
      { text: 'Погрузка', value: '_loadingAddressesStr', sortable: false },
      { text: 'Выгрузка', value: '_unloadingAddressesStr', sortable: false },
      { text: 'Грузовик', value: '_truckRegNum', sortable: false },
      { text: 'Прицеп', value: '_trailerRegNum', sortable: false },

      { text: 'База', value: 'baseTariff.tariff.sum', sortable: false },
      {
        text: 'Тип базового тарифа',
        value: '_baseTariffTypeStr',
        sortable: false,
      },
      { text: 'Доплата', value: '_paymentSum', sortable: false },
      { text: 'Прод-ть рейса, ч', value: '_routeDuration', sortable: false },
      { text: 'Оценка', value: 'grade.grade', sortable: false },
      { text: 'Комментарий к оценке', value: 'grade.note', sortable: false },
    ]
    function chooseDriver(driverId) {
      ctx.emit('chooseDriver', driverId)
    }

    function dblClickRow(_, { item }) {
      if (item && props.driver) router.push(`/orders/${item._id}`)
    }

    const preparedItems = computed(() => {
      if (props.driver)
        return props.items.map((i) => ({
          ...i,
          _orderDate: i.orderDate
            ? new Date(i.orderDate).toLocaleString()
            : null,
        }))
      else
        return props.items.map((i) => ({
          ...i,
          _driverName: store.getters.driversMap.get(i._id)?.fullName,
          _count: i?.totalCount,
          _base: i?.base ? new Intl.NumberFormat().format(i.base) : null,
          _payment: i?.payment
            ? new Intl.NumberFormat().format(i.payment)
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
    }
  },
}
</script>
<style></style>
