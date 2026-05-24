<template>
  <div id="wrapper">
    <v-autocomplete
      ref="firstField"
      :model-value="item.clients"
      label="Клиенты"
      :items="clientItems"
      item-value="_id"
      item-title="name"
      multiple
      hide-details
      @update:model-value="changeHandler($event, 'clients')"
    />

    <v-select
      :model-value="item.orderType"
      label="Тип рейса"
      :items="orderAnalyticTypes"
      hide-details
      @update:model-value="changeHandler($event, 'orderType')"
    />
    <v-checkbox
      label="Возврат паллет"
      :value="item.isPltReturn"
      color="primary"
      @update:model-value="changeHandler($event, 'isPltReturn')"
    />
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'

export default {
  name: 'ReturnTariffType',
  props: {
    item: Object,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const store = instance?.proxy.$store

    const clientItems = computed(() => store?.getters.partners?.filter((i) => i.isClient) || [])

    const orderAnalyticTypes = computed(() => store?.getters.orderAnalyticTypes || [])

    const firstField = ref(null)

    const focus = () => {
      firstField.value?.focus()
    }

    function changeHandler(val, field) {
      ctx.emit('change', { ...props.item, [field]: val })
    }

    return {
      clientItems,
      orderAnalyticTypes,
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
