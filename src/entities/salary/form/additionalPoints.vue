<template>
  <div id="points-wrapper">
    <v-autocomplete
      :model-value="additionalPoints.clients"
      ref="routeTypeEl"
      label="Клиенты"
      :items="clients"
      item-value="_id"
      item-title="name"
      multiple
      hide-details
      @update:model-value="changeHandler($event, 'clients')"
    />
    <v-select
      :model-value="additionalPoints.orderType"
      label="Тип рейса"
      :items="orderAnalyticTypes"
      item-title="text"
      item-value="value"
      hide-details
      @update:model-value="changeHandler($event, 'orderType')"
    />
    <v-text-field
      :model-value="additionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
      type="number"
      hide-details
      @update:model-value="changeHandler(Number($event), 'includedPoints')"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'

const additionalPoints = defineModel({ type: Object })

const store = useStore()
const orderStore = useOrderStore()

const clients = computed(() => store.getters.partners?.filter((i) => i.isClient) || [])

const orderAnalyticTypes = computed(() => orderStore.orderAnalyticTypes)

const routeTypeEl = ref(null)

const focus = () => {
  routeTypeEl.value?.focus()
}

function changeHandler(val, field) {
  additionalPoints.value = { ...additionalPoints.value, [field]: val }
}

defineExpose({ focus })
</script>
<style scoped>
#points-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
