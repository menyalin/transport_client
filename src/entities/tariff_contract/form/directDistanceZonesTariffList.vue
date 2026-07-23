<template>
  <v-data-table :headers="headers" :items="preparedItems" :items-per-page="-1" hide-default-footer>
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
      <v-btn icon size="small" @click="updateHandler(item)">
        <v-icon size="small" color="orange">mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" @click="deleteHandler(item)">
        <v-icon size="small" color="red">mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script setup>
import { computed } from 'vue'
import store from '@/store'
import { moneyFormatter } from '@/shared/utils'

defineOptions({ name: 'DirectDistanceZonesTariffList' })

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['deleteByIdx', 'updateByIdx'])

const headers = [
  { title: 'Тип ТС', key: 'truckKinds', sortable: false },
  { title: 'Грузоподъемность ', key: 'liftCapacities', sortable: false },
  { title: 'Зона погрузки', key: 'loadingZone', sortable: true },
  {
    title: 'Включено точек',
    key: 'includedPoints',
    align: 'end',
    sortable: true,
  },
  {
    title: 'Стоимость доп.точки',
    key: 'pointPrice',
    align: 'end',
    sortable: true,
  },
  { title: 'Зоны', key: 'zones', sortable: false },
  { key: 'actions', align: 'end', sortable: false },
]
function formatPrice(price) {
  return moneyFormatter(price)
}
function formatTruckKinds(kinds) {
  return kinds?.map((i) => store.getters.truckKindsMap.get(i)).join('; ') || ''
}
function formatLiftCapacities(items) {
  return items?.join('; ') || ''
}
function formatZone(zoneId) {
  return store.getters.zonesMap.get(zoneId)?.name || '-'
}
function deleteHandler(item) {
  emit('deleteByIdx', item.idx)
}
function updateHandler(item) {
  emit('updateByIdx', item.idx)
}

const preparedItems = computed(() => {
  return props.items.map((i) => ({
    ...i,
    loadingZone: formatZone(i.loadingZone),
  }))
})
</script>
<style scoped>
.zone-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 180px;
}
</style>
