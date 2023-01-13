<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="analytic-block-wrapper">
      <v-select
        v-model="params.type"
        label="Тип рейса"
        :items="$store.getters.orderAnalyticTypes"
        clearable
        hide-details
        dense
        outlined
        :style="{ 'max-width': '150px' }"
      />
      <v-text-field
        v-model.number="params.distanceRoad"
        label="Расстояние по дорогам, км"
        :loading="distanceLoading"
        dense
        hideDetails
        outlined
        append-icon="mdi-autorenew"
        @click:append="getRoadDistance"
      />
      <v-text-field
        v-model.number="params.distanceDirect"
        label="Расстояние прямое, км"
        dense
        hideDetails
        append-icon="mdi-autorenew"
        outlined
        @click:append="getDirectDistance"
      />
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import { OrderService } from '@/shared/services'

export default {
  name: 'AnalyticBlock',
  components: {
    AppBlockTitle,
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
</style>
