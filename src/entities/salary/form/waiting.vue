<template>
  <div id="wrapper">
    <v-autocomplete
      :model-value="item.clients"
      ref="firstField"
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
      item-title="text"
      item-value="value"
      hide-details
      @update:model-value="changeHandler($event, 'orderType')"
    />
    <v-text-field
      :model-value="item.includeHours"
      type="number"
      label="Кол-во часов включенных в тариф"
      hide-details
      @update:model-value="changeHandler($event, 'includeHours')"
    />
    <v-select
      :model-value="item.roundByHours"
      label="Округление времени"
      :items="roundingWaitingByHours"
      item-title="text"
      item-value="value"
      hide-details
      @update:model-value="changeHandler($event, 'roundByHours')"
    />
    <v-select
      :model-value="item.tariffBy"
      label="Тариф за"
      :items="waitingTariffByItems"
      item-title="text"
      item-value="value"
      hide-details
      @update:model-value="changeHandler($event, 'tariffBy')"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'SalaryWaiting' })
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const item = defineModel({ type: Object })

const firstField = ref(null)
const store = useStore()

const clientItems = computed(() => store.getters.partners?.filter((i) => i.isClient) || [])

const orderAnalyticTypes = computed(() => store.getters.orderAnalyticTypes || [])
const roundingWaitingByHours = computed(() => store.getters.roundingWaitingByHours || [])
const waitingTariffByItems = computed(() => store.getters.waitingTariffByItems || [])

const focus = () => {
  firstField.value?.focus()
}

function changeHandler(val, field) {
  item.value = { ...item.value, [field]: val }
}

defineExpose({ focus })
</script>
<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
