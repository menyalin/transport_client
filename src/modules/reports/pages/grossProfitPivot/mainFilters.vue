<template>
  <div class="main-filter-wrapper">
    <h5>Основной отбор</h5>
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
        :items="filter.items()"
        multiple
        auto-select-first
        clearable
        dense
        outlined
        hide-details
        :style="{ 'max-width': '400px' }"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainFilters',
  model: {
    prop: 'filters',
    event: 'change',
  },
  props: {
    filters: { type: Object },
  },
  data() {
    return {
      condItems: [
        { value: 'in', text: 'Содержит' },
        { value: 'notIn', text: 'Не содержит' },
      ],
      filterItems: [
        { value: 'clients', title: 'Клиенты', items: () => this.clients },
        { value: 'orderTypes', title: 'Регионы', items: () => this.orderTypes },
        { value: 'tkNames', title: 'ТК', items: () => this.tkNames },
        { value: 'trucks', title: 'ТС', items: () => this.trucks },
        { value: 'drivers', title: 'Водители', items: () => this.drivers },
        {
          value: 'loadingRegions',
          title: 'Регион погрузки',
          items: () => this.regions,
        },
        {
          value: 'unloadingRegions',
          title: 'Регион разгрузки',
          items: () => this.regions,
        },
        {
          value: 'loadingZones',
          title: 'Зоны погрузки',
          items: () => this.zones,
        },
        {
          value: 'unloadingZones',
          title: 'Зоны разгрузки',
          items: () => this.zones,
        },
      ],
      tmpFilters: {
        clients: {
          values: [],
          cond: 'in',
        },
        tkNames: {
          values: [],
          cond: 'in',
        },
        trucks: {
          values: [],
          cond: 'in',
        },
        drivers: {
          values: [],
          cond: 'in',
        },
        orderTypes: {
          values: [],
          cond: 'in',
        },
        loadingRegions: {
          values: [],
          cond: 'in',
        },
        unloadingRegions: {
          values: [],
          cond: 'in',
        },
        loadingZones: {
          values: [],
          cond: 'in',
        },
        unloadingZones: {
          values: [],
          cond: 'in',
        },
      },
    }
  },
  computed: {
    clients() {
      return this.$store.getters.partners
        .filter((i) => i.isClient)
        .sort((a, b) => a.name - b.name)
        .map((i) => ({ value: i._id, text: i.name }))
    },
    tkNames() {
      return this.$store.getters.tkNames.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    },
    trucks() {
      return this.$store.getters.trucks
        .filter((i) => i.type === 'truck')
        .map((i) => ({
          value: i._id,
          text: i.regNum,
        }))
    },
    drivers() {
      return this.$store.getters.drivers.map((i) => ({
        value: i._id,
        text: i.fullName,
      }))
    },
    orderTypes() {
      return this.$store.getters.orderAnalyticTypes
    },
    regions() {
      return this.$store.getters.regions.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    },
    zones() {
      return this.$store.getters.zones.map((i) => ({
        value: i._id,
        text: i.name,
      }))
    },
  },
  watch: {
    filters: {
      // immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpFilters = val
      },
    },

    tmpFilters: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
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
