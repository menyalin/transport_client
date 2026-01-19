<template>
  <div class="main-filter-wrapper">
    <v-expansion-panels v-if="Object.keys(tmpFilters).length > 0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h5>{{ title }}</h5>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-for="(filter, idx) of filterItems"
            :key="idx"
            class="filter-row mt-3"
          >
            <v-select
              v-model="tmpFilters[filter.value].cond"
              label="Сравнение"
              :items="condItems"
              dense
              outlined
              hide-details
              :style="{ 'max-width': '180px' }"
            />
            <v-autocomplete
              v-model="tmpFilters[filter.value].values"
              :label="filter.title"
              :items="filter.items"
              multiple
              auto-select-first
              clearable
              dense
              outlined
              hide-details
              :style="{ 'max-width': '400px' }"
            />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { useCarrierStore } from '@/entities/carrier'
import { ref, computed, watch, getCurrentInstance } from 'vue'

export default {
  name: 'MainFilters',

  model: {
    prop: 'filters',
    event: 'change',
  },

  props: {
    filters: { type: Object },
    title: String,
    agreements: Array,
  },

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const carrierStore = useCarrierStore()
    const condItems = [
      { value: 'in', text: 'Содержит' },
      { value: 'notIn', text: 'Не содержит' },
    ]

    const tmpFilters = ref({})

    // Getters
    const clients = computed(() =>
      proxy.$store.getters.partners
        .filter((i) => i.isClient)
        .sort((a, b) => a.name - b.name)
        .map((i) => ({ value: i._id, text: i.name }))
    )

    const carriers = computed(() =>
      carrierStore.carriers?.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    )

    const trucks = computed(() =>
      proxy.$store.getters.trucks
        .filter((i) => i.type === 'truck')
        .map((i) => ({
          value: i._id,
          text: i.regNum,
        }))
    )

    const drivers = computed(() =>
      proxy.$store.getters.drivers.map((i) => ({
        value: i._id,
        text: i.fullName,
      }))
    )

    const orderTypes = computed(() => proxy.$store.getters.orderAnalyticTypes)

    const regions = computed(() =>
      proxy.$store.getters.regions.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    )

    const zones = computed(() =>
      proxy.$store.getters.zones.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    )

    // Элементы фильтров
    const filterItems = computed(() => [
      { value: 'clients', title: 'Клиенты', items: clients.value },
      { value: 'agreements', title: 'Соглашения', items: props.agreements },
      { value: 'orderTypes', title: 'Регионы', items: orderTypes.value },
      { value: 'tkNames', title: 'ТК', items: carriers.value },
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

    // Watch
    watch(
      () => props.filters,
      (val) => {
        tmpFilters.value = val
      },
      { immediate: true, deep: true }
    )

    watch(tmpFilters, (val) => emit('change', val), { deep: true })

    return {
      carriers,
      condItems,
      tmpFilters,
      filterItems,
    }
  },
}
</script>

<style scoped>
.filter-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
