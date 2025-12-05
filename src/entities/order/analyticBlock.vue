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
        hideDetails
       
        variant="outlined"
       density="compact"
        :style="{ 'max-width': '150px' }"
      />
      <v-text-field
        v-model.number="params.distanceRoad"
        label="Расстояние по дорогам, км"
        :loading="distanceLoading"
       
        hideDetails
        variant="outlined"
       density="compact"
       endIcon="mdi-autorenew"
        @click:append="getRoadDistance"
      />
      <v-text-field
        v-model.number="params.distanceDirect"
        label="Расстояние прямое, км"
       
        hideDetails
       endIcon="mdi-autorenew"
        variant="outlined"
       density="compact"
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
    computed: {
      showDebugInfo() {
        return this.$store.getters.hasPermission('fullAccess')
      },
      loadingZones() {
        if (!this.item?.loadingZones || !Array.isArray(this.item.loadingZones)) return []
        const zonesMap = this.$store.getters.zonesMap || new Map()
        return this.item.loadingZones.map(i => zonesMap.get(i)?.name).filter(Boolean)
      },
      unloadingZones() {
        if (!this.item?.unloadingZones || !Array.isArray(this.item.unloadingZones)) return []
        const zonesMap = this.$store.getters.zonesMap || new Map()
        return this.item.unloadingZones.map(i => zonesMap.get(i)?.name).filter(Boolean)
      },
    },
    watch: {
      item: {
        immediate: true,
        deep: true,
        handler: function (val) {
          if (val && typeof val === 'object') {
            this.params.type = val.type ?? null
            this.params.distanceRoad = val.distanceRoad ?? null
            this.params.distanceDirect = val.distanceDirect ?? null
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
