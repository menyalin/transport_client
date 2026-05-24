<template>
  <div class="main-filter-wrapper">
    <v-expansion-panels v-if="tmpFilters && Object.keys(tmpFilters).length > 0">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h5>{{ title }}</h5>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div v-for="(filter, idx) of filterItems" :key="idx" class="filter-row mt-3">
            <v-select
              v-model="tmpFilters[filter.value].cond"
              label="Сравнение"
              :items="condItems"
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
              hide-details
              :style="{ 'max-width': '400px' }"
            />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { ref, computed, watch, getCurrentInstance } from 'vue'

export default {
  name: 'MainFilters',

  props: {
    modelValue: { type: Object },
    title: String,
    agreements: Array,
  },

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const carrierStore = useCarrierStore()
    const tmpFilters = ref({})
    const condItems = [
      { value: 'in', text: 'Содержит' },
      { value: 'notIn', text: 'Не содержит' },
    ]

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

    // Watch
    watch(
      () => props.modelValue,
      (val) => {
        tmpFilters.value = val
      },
      { immediate: true, deep: true }
    )

    watch(tmpFilters, (val) => emit('update:modelValue', val), { deep: true })

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
