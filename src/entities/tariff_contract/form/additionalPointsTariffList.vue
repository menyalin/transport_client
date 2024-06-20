<template>
  <v-data-table
    :headers="headers"
    :items="preparedItems"
    dense
    :items-per-page="-1"
    hide-default-footer
  >
    <template #[`item.truckKinds`]="{ item }">
      {{ formatTruckKinds(item.truckKinds) }}
    </template>
    <template #[`item.liftCapacities`]="{ item }">
      {{ formatLiftCapacities(item.liftCapacities) }}
    </template>
    <template #[`item.price`]="{ item }">
      {{ formatPrice(item.price) }}
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn icon small @click="updateHandler(item)">
        <v-icon small color="orange">mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon small @click="deleteHandler(item)">
        <v-icon small color="red">mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'
import { moneyFormatter } from '@/shared/utils'

/*
  truckKinds: TRUCK_KINDS_ENUM[]
  liftCapacities: number[]
  includedPoints: number
  price: number
  orderType: OrderType
*/

export default {
  props: {
    items: Array,
  },
  setup(props, ctx) {
    const headers = [
      { text: 'Тип ТС', value: 'truckKinds', sortable: false },
      { text: 'Грузоподъемность ', value: 'liftCapacities', sortable: false },
      { text: 'Тип рейса', value: 'orderTypes', sortable: true },
      { text: 'Кол-во точек', value: 'includedPoints', sortable: true },
      { text: 'Тариф', value: 'price', sortable: true, align: 'right' },
      { value: 'actions', align: 'right', sortable: false },
    ]
    function formatPrice(price) {
      return moneyFormatter(price)
    }
    function formatTruckKinds(kinds) {
      return (
        kinds?.map((i) => store.getters.truckKindsMap.get(i)).join('; ') || ''
      )
    }
    function formatLiftCapacities(items) {
      return items?.join('; ') || ''
    }

    function deleteHandler(item) {
      ctx.emit('deleteByIdx', item.idx)
    }
    function updateHandler(item) {
      ctx.emit('updateByIdx', item.idx)
    }

    const preparedItems = computed(() => {
      return props.items.map((i) => ({
        ...i,
        orderTypes: i.orderTypes
          .map((j) => (j === 'region' ? 'Регион' : 'Город'))
          .join(', '),
      }))
    })

    return {
      headers,
      formatPrice,
      formatTruckKinds,
      formatLiftCapacities,

      deleteHandler,
      updateHandler,
      preparedItems,
    }
  },
}
</script>
<style scoped>
.zone-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 180px;
}
</style>
