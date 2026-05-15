<template>
  <div id="wrapper">
    <v-autocomplete
      ref="firstField"
      :value="item.clients"
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
    <v-checkbox
      label="Возврат паллет"
      v-model="item.isPltReturn"
      color="primary"
      @change="changeHandler($event, 'isPltReturn')"
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
