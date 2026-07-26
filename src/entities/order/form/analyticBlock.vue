<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="analytic-block-wrapper">
      <v-select
        v-model="item.type"
        label="Тип рейса"
        :items="orderStore.orderAnalyticTypes"
        clearable
        itemTitle="text"
        hide-details
        :style="{ 'max-width': '150px' }"
      />
      <v-text-field
        v-model.number="item.distanceRoad"
        label="Расстояние по дорогам, км"
        :loading="distanceLoading"
        hideDetails
        append-icon="mdi-autorenew"
        @click:append="getRoadDistance"
      />
      <v-text-field
        v-model.number="item.distanceDirect"
        label="Расстояние прямое, км"
        hideDetails
        append-icon="mdi-autorenew"
        @click:append="getDirectDistance"
      />
    </div>
    <div v-if="showDebugInfo && false" class="zones-wrapper">
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
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'
import { BlockTitle } from '@/entities/order'
import { OrderService } from '@/shared/services'

const props = defineProps({
  title: String,
  isValidRoute: Boolean,
  route: Array,
  coords: Array,
})

const item = defineModel({ type: Object })

const store = useStore()
const orderStore = useOrderStore()

const distanceLoading = ref(false)

const showDebugInfo = computed(() => store.getters.hasPermission('fullAccess'))

const loadingZones = computed(
  () => item.value?.loadingZones?.map((i) => store.getters.zonesMap.get(i)?.name) || null
)

const unloadingZones = computed(
  () => item.value?.unloadingZones?.map((i) => store.getters.zonesMap.get(i)?.name) || null
)

async function getRoadDistance() {
  if (props.isValidRoute) {
    try {
      distanceLoading.value = true
      const res = await OrderService.getDistance(props.coords)
      item.value.distanceRoad = res.distanceRoad
      distanceLoading.value = false
    } catch (e) {
      distanceLoading.value = false
      store.commit('setError', e.message)
    }
  }
}

function getDirectDistance() {
  if (props.isValidRoute) {
    item.value.distanceDirect = OrderService.getDirectDistance(props.coords)
  }
}
</script>
<style scoped>
.analytic-block-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-width: 600px;
  gap: 10px;
}

.zones-wrapper {
  display: flex;
  flex-direction: column;
  font-size: small;
}
</style>
