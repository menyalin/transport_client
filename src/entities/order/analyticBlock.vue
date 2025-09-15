<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="analytic-block-wrapper">
      <v-select
        v-model="params.type"
        label="Тип рейса"
        :items="$store.getters.orderAnalyticTypes"
        clearable
        hide-details
        density="compact"
        variant="outlined"
        :style="{ 'max-width': '150px' }"
      />
      <v-text-field
        v-model.number="params.distanceRoad"
        label="Расстояние по дорогам, км"
        :loading="distanceLoading"
        density="compact"
        hideDetails
        variant="outlined"
        append-icon="mdi-autorenew"
        @click:append="getRoadDistance"
      />
      <v-text-field
        v-model.number="params.distanceDirect"
        label="Расстояние прямое, км"
        density="compact"
        hideDetails
        append-icon="mdi-autorenew"
        variant="outlined"
        @click:append="getDirectDistance"
      />
    </div>
    <div v-if="showDebugInfo" class="zones-wrapper">
      <div>Зоны погрузки: {{ loadingZones }}</div>
      <div>Зоны разгрузки: {{ unloadingZones }}</div>
      {{ item.routeStats }}

      <br />
      prices:
      <div v-for="(price, idx) of item.prePrices" :key="idx" class="ma-1">
        {{ price }}
      </div>
    </div>
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'
import { OrderService } from '@/shared/services'

export default {
  name: 'AnalyticBlock',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    title: String,
    isValidRoute: Boolean,
    route: Array,
    coords: Array,
  },
  data() {
    return {
      distanceLoading: false,
      params: {
        type: null,
        distanceRoad: null,
        distanceDirect: null,
      },
    }
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (val) {
          this.params.type = val.type
          this.params.distanceRoad = val.distanceRoad
          this.params.distanceDirect = val.distanceDirect
        }
      },
    },
    params: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  computed: {
    showDebugInfo() {
      return this.$store.getters.hasPermission('fullAccess')
    },
    loadingZones() {
      return (
        this.item.loadingZones?.map(
          (i) => this.$store.getters.zonesMap.get(i)?.name
        ) || null
      )
    },
    unloadingZones() {
      return (
        this.item.unloadingZones?.map(
          (i) => this.$store.getters.zonesMap.get(i)?.name
        ) || null
      )
    },
  },
  methods: {
    async getRoadDistance() {
      if (this.isValidRoute) {
        try {
          this.distanceLoading = true
          const res = await OrderService.getDistance(this.coords)
          this.params.distanceRoad = res.distanceRoad
          this.distanceLoading = false
        } catch (e) {
          this.distanceLoading = false
          this.$store.commit('setError', e.message)
        }
      }
    },
    async getDirectDistance() {
      if (this.isValidRoute) {
        this.params.distanceDirect = OrderService.getDirectDistance(this.coords)
      }
    },
  },
}
</script>
<style scoped>
.analytic-block-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-width: 600px;
}
.analytic-block-wrapper > * {
  margin: 10px;
}
.zones-wrapper {
  display: flex;
  flex-direction: column;
  font-size: small;
}
</style>
