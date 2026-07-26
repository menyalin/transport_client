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
      item-title="text"
      item-value="value"
      hide-details
      @update:model-value="changeHandler($event, 'orderType')"
    />
    <v-checkbox
      label="Возврат паллет"
      :model-value="item.isPltReturn"
      color="primary"
      @update:model-value="changeHandler($event, 'isPltReturn')"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'SalaryReturn' })
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const item = defineModel({ type: Object })

const store = useStore()

const clientItems = computed(() => store.getters.partners?.filter((i) => i.isClient) || [])

const orderAnalyticTypes = computed(() => store.getters.orderAnalyticTypes || [])

const firstField = ref(null)

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
