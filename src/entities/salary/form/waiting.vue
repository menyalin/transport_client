<template>
  <div id="wrapper">
    <v-autocomplete
      :value="item.clients"
      ref="firstField"
      label="Клиенты"
      dense
      :items="clientItems"
      item-value="_id"
      item-text="name"
      multiple
      outlined
      hide-details
      @change="changeHandler($event, 'clients')"
    />
    <v-select
      :value="item.orderType"
      label="Тип рейса"
      :items="orderAnalyticTypes"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'orderType')"
    />
    <v-text-field
      :value="item.includeHours"
      type="number"
      label="Кол-во часов включенных в тариф"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'includeHours')"
    />
    <v-select
      :value="item.roundByHours"
      label="Округление времени"
      :items="roundingWaitingByHours"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'roundByHours')"
    />
    <v-select
      :value="item.tariffBy"
      label="Тариф за"
      :items="waitingTariffByItems"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'tariffBy')"
    />
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'

export default {
  name: 'WaitingTariffType',
  props: {
    item: Object,
  },
  model: {
    prop: 'item',
    event: 'change',
  },

  setup(props, ctx) {
    const firstField = ref(null)
    const instance = getCurrentInstance()
    const store = instance?.proxy.$store

    const clientItems = computed(() => store?.getters.partners?.filter((i) => i.isClient) || [])

    const orderAnalyticTypes = computed(() => store?.getters.orderAnalyticTypes || [])
    const roundingWaitingByHours = computed(() => store?.getters.roundingWaitingByHours || [])
    const waitingTariffByItems = computed(() => store?.getters.waitingTariffByItems || [])

    const focus = () => {
      firstField.value?.focus()
    }

    function changeHandler(val, field) {
      ctx.emit('change', { ...props.item, [field]: val })
    }
    return {
      clientItems,
      orderAnalyticTypes,
      roundingWaitingByHours,
      waitingTariffByItems,
      firstField,
      focus,
      changeHandler,
    }
  },
}
</script>
<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
