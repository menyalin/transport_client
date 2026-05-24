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
      hide-details
      @update:model-value="changeHandler($event, 'orderType')"
    />
    <v-text-field
      :model-value="additionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
      type="number"
      hide-details
      @change="changeHandler($event, 'includedPoints')"
    />
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'

export default {
  name: 'TariffPointsType',
  props: {
    additionalPoints: Object,
  },
  model: {
    prop: 'additionalPoints',
    event: 'change',
  },
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const store = instance?.proxy.$store

    const clients = computed(() => store?.getters.partners?.filter((i) => i.isClient) || [])

    const orderAnalyticTypes = computed(() => store?.getters.orderAnalyticTypes || [])

    const routeTypeEl = ref(null)

    const focus = () => {
      routeTypeEl.value?.focus()
    }

    function changeHandler(val, field) {
      ctx.emit('change', { ...props.additionalPoints, [field]: val })
    }
    return {
      clients,
      orderAnalyticTypes,
      routeTypeEl,
      focus,
      changeHandler,
    }
  },
}
</script>
<style scoped>
#points-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
