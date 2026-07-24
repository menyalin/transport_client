<template>
  <div id="settings-wrapper">
    <v-text-field
      v-model="tmpSettings.date"
      label="Дата"
      :disabled="disabled"
      type="date"
      hide-details
      :style="{ 'max-width': '200px' }"
    />

    <v-select
      v-model="tmpSettings.tks"
      label="ТК"
      :items="carriers"
      item-value="_id"
      item-title="name"
      multiple
      hide-details
      :style="{ 'max-width': '220px' }"
    />

    <v-select
      v-model="tmpSettings.type"
      label="Тип тарифа"
      :items="store.getters.salaryTariffTypes"
      item-title="text"
      item-value="value"
      hide-details
      :style="{ 'max-width': '220px' }"
    />
    <v-select
      v-model="tmpSettings.consigneeTypes"
      label="Типы грузополучателей"
      :items="store.getters.partnerGroups"
      item-title="text"
      item-value="value"
      multiple
      clearable
      hide-details
      :style="{ 'max-width': '300px' }"
    />
    <v-select
      v-model="tmpSettings.liftCapacity"
      label="Грузоподъемность"
      :items="store.getters.liftCapacityTypes"
      item-title="text"
      item-value="value"
      multiple
      hide-details
      :style="{ 'max-width': '220px' }"
    />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

const settings = defineModel({ type: Object })

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  carriers: {
    type: Array,
    required: true,
  },
})

const store = useStore()

const tmpSettings = ref({
  date: null,
  tks: [],
  type: null,
  liftCapacity: [],
  consigneeTypes: [],
})

if (settings.value?.group) {
  tmpSettings.value = { ...settings.value }
} else {
  tmpSettings.value.truckKind = store.getters.companySettings?.defaultTruckKind || null
  tmpSettings.value.liftCapacity.push(store.getters.companySettings?.defaultLiftCapacity || null)
  tmpSettings.value.date = dayjs().format('YYYY-MM-DD')
}

watch(
  tmpSettings,
  (val) => {
    settings.value = {
      ...val,
      date: val.date ? new Date(val.date).toISOString() : null,
    }
  },
  { deep: true, immediate: true }
)
</script>
<style scoped>
#settings-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin: 10px;
}
</style>
