<template>
  <v-data-table
    :headers="headers"
    :items="preparedItems"
    dense
    :items-per-page="-1"
    hide-default-footer
  >
    <template #[`item.price`]="{ item }">
      {{ formatPrice(item.price) }}
    </template>
    <template #[`item.pointPrice`]="{ item }">
      {{ formatPrice(item.pointPrice) }}
    </template>
    <template #[`item.truckKinds`]="{ item }">
      {{ formatTruckKinds(item.truckKinds) }}
    </template>
    <template #[`item.liftCapacities`]="{ item }">
      {{ formatLiftCapacities(item.liftCapacities) }}
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

export default {
  name: 'ZoneBaseTariffList',
  props: {
    items: Array,
  },
  setup(props, ctx) {
    const headers = [
      { text: 'Тип ТС', value: 'truckKinds', sortable: false },
      { text: 'Грузоподъемность ', value: 'liftCapacities', sortable: false },
      {
        text: 'Включено точек',
        value: 'includedPoints',
        align: 'right',
        sortable: true,
      },
      {
        text: 'Стоимость доп.точки',
        value: 'pointPrice',
        align: 'right',
        sortable: true,
      },
      { text: 'Зона погрузки', value: 'loadingZone', sortable: true },
      { text: 'Зоны разгрузки', value: 'unloadingZones', sortable: true },
      { text: 'Тариф', value: 'price', align: 'right', sortable: true },

      { value: 'actions', align: 'right', sortable: false },
    ]
    function formatPrice(price) {
      return moneyFormatter(price)
    }
    function formatTruckKinds(kinds) {
      return kinds.map((i) => store.getters.truckKindsMap.get(i)).join('; ')
    }
    function formatLiftCapacities(items) {
      return items.join('; ')
    }
    function formatZone(zoneId) {
      return store.getters.zonesMap.get(zoneId)?.name || '-'
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
        loadingZone: formatZone(i.loadingZone),
        unloadingZones: i.unloadingZones
          .map((zone) => formatZone(zone))
          .join('; '),
      }))
    })
    return {
      headers,
      formatPrice,
      formatTruckKinds,
      formatLiftCapacities,
      formatZone,
      deleteHandler,
      updateHandler,
      preparedItems,
    }
  },
}
</script>
