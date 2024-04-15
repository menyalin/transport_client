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
    <template #[`item.zones`]="{ item }">
      <div v-for="(zone, idx) of item.zones" :key="idx" class="my-1 zone-row">
        <div>
          до <b>{{ zone.distance }}</b> км.
        </div>
        <div>
          <b>{{ formatPrice(zone.price) }}</b>
        </div>
      </div>
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
import { computed, watch } from 'vue'
import store from '@/store'
import { moneyFormatter } from '@/shared/utils'

export default {
  props: {
    items: Array,
  },
  setup(props, ctx) {
    const headers = [
      { text: 'Тип ТС', value: 'truckKinds', sortable: false },
      { text: 'Грузоподъемность ', value: 'liftCapacities', sortable: false },
      { text: 'Зона погрузки', value: 'loadingZone', sortable: true },
      { text: 'Зоны', value: 'zones', sortable: false },
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
    function formatZone(zoneId) {
      return store.getters.zonesMap.get(zoneId)?.name || '-'
    }
    function deleteHandler(item) {
      ctx.emit('deleteByIdx', item.idx)
    }
    function updateHandler(item) {
      ctx.emit('updateByIdx', item.idx)
    }
    watch(
      () => props.items,
      (arr) => {
        console.log('list updated: ', arr)
      },
      { deep: true, immediate: true }
    )

    const preparedItems = computed(() => {
      return props.items.map((i) => ({
        ...i,
        loadingZone: formatZone(i.loadingZone),
        // zones: i.zones.splice(),
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
<style scoped>
.zone-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 180px;
}
</style>
