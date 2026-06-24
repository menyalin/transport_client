<template>
  <v-expansion-panels v-if="tmpFilters && Object.keys(tmpFilters).length > 0">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ title }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-for="(filter, idx) of filterItems" :key="idx" class="filter-row mt-3">
          <v-select
            v-model="tmpFilters[filter.value].cond"
            label="Сравнение"
            :items="condItems"
            item-title="title"
            item-value="value"
            hide-details
            style="min-width: 120px; max-width: 140px"
          />
          <v-autocomplete
            v-model="tmpFilters[filter.value].values"
            :label="filter.title"
            :items="filter.items"
            item-title="title"
            item-value="value"
            multiple
            auto-select-first
            clearable
            hide-details
            style="min-width: 0; flex: 1 1 auto"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'MainFilters' })

const model = defineModel({ type: Object })

const props = defineProps({
  title: String,
  agreements: Array,
})

const store = useStore()
const carrierStore = useCarrierStore()

const tmpFilters = ref({})
const condItems = [
  { value: 'in', title: 'Содержит' },
  { value: 'notIn', title: 'Не содержит' },
]

const clients = computed(() =>
  store.getters.partners
    .filter((i) => i.isClient)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ value: i._id, title: i.name }))
)

const carriers = computed(() =>
  carrierStore.carriers?.map((i) => ({
    value: i._id,
    title: i.name,
  }))
)

const trucks = computed(() =>
  store.getters.trucks
    .filter((i) => i.type === 'truck')
    .map((i) => ({
      value: i._id,
      title: i.regNum,
    }))
)

const drivers = computed(() =>
  store.getters.drivers.map((i) => ({
    value: i._id,
    title: i.fullName,
  }))
)

const orderTypes = computed(() =>
  store.getters.orderAnalyticTypes.map((i) => ({ value: i.value, title: i.text }))
)

const regions = computed(() =>
  store.getters.regions.map((i) => ({
    value: i._id,
    title: i.name,
  }))
)

const zones = computed(() =>
  store.getters.zones.map((i) => ({
    value: i._id,
    title: i.name,
  }))
)

const filterItems = computed(() => [
  { value: 'clients', title: 'Клиенты', items: clients.value },
  { value: 'agreements', title: 'Соглашения', items: props.agreements },
  { value: 'orderTypes', title: 'Типы рейсов', items: orderTypes.value },
  { value: 'carriers', title: 'ТК', items: carriers.value },
  { value: 'trucks', title: 'ТС', items: trucks.value },
  { value: 'drivers', title: 'Водители', items: drivers.value },
  {
    value: 'loadingRegions',
    title: 'Регион погрузки',
    items: regions.value,
  },
  {
    value: 'unloadingRegions',
    title: 'Регион разгрузки',
    items: regions.value,
  },
  { value: 'loadingZones', title: 'Зоны погрузки', items: zones.value },
  { value: 'unloadingZones', title: 'Зоны разгрузки', items: zones.value },
])

watch(
  () => model.value,
  (val) => {
    tmpFilters.value = val
  },
  { immediate: true, deep: true }
)

watch(
  tmpFilters,
  (val) => {
    model.value = val
  },
  { deep: true }
)
</script>

<style scoped>
.filter-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
