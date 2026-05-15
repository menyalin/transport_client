<template>
  <div id="points-wrapper">
    <v-autocomplete
      :value="additionalPoints.clients"
      ref="routeTypeEl"
      label="Клиенты"
      dense
      :items="clients"
      item-value="_id"
      item-text="name"
      multiple
      outlined
      hide-details
      @change="changeHandler($event, 'clients')"
    />
    <v-select
      :value="additionalPoints.orderType"
      label="Тип рейса"
      :items="orderAnalyticTypes"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'orderType')"
    />
    <v-text-field
      :value="additionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
      dense
      type="number"
      outlined
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
