<template>
  <v-data-table :headers="headers" :items="preparedItems" :items-per-page="-1" hide-default-footer>
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

defineOptions({ name: 'IdleTimeTariffList' })

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['deleteByIdx', 'updateByIdx'])

const headers = [
  { title: 'Тип ТС', key: 'truckKinds', sortable: false },
  { title: 'Грузоподъемность ', key: 'liftCapacities', sortable: false },
  { title: 'Тип рейса', key: 'orderTypes', sortable: true },
  { title: 'Включено часов', key: 'includeHours', sortable: true },
  { title: 'Округлять до', key: 'roundingInterval', sortable: true },
  { title: 'Тариф за', key: 'tariffBy', sortable: true },
  { title: 'Тариф', key: 'price', sortable: true, align: 'end' },
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

function deleteHandler(item) {
  emit('deleteByIdx', item.idx)
}
function updateHandler(item) {
  emit('updateByIdx', item.idx)
}

const preparedItems = computed(() => {
  return props.items.map((i) => ({
    ...i,
    orderTypes: i.orderTypes.map((j) => (j === 'region' ? 'Регион' : 'Город')).join(', '),
    roundingInterval: store.getters.idleTimeRoundingIntervalsMap.get(i.roundingInterval) ?? '-',
    tariffBy: store.getters.waitingTariffByItemsMap.get(i.tariffBy) ?? '-',
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
