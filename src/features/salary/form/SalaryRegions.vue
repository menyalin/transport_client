<template>
  <div id="zones-wrapper">
    <v-autocomplete
      ref="loadingEl"
      :model-value="regions.loadingRegion"
      label="Регион погрузки"
      :items="regionItems"
      item-value="_id"
      item-title="name"
      hide-details
      @update:model-value="changeHandler($event, 'loadingRegion')"
    />
    <v-autocomplete
      :model-value="regions.unloadingRegion"
      label="Регион разгрузки"
      item-value="_id"
      item-title="name"
      :items="regionItems"
      hide-details
      @update:model-value="changeHandler($event, 'unloadingRegion')"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'SalaryRegions' })
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const regions = defineModel({ type: Object })

const store = useStore()

const regionItems = computed(() => store.getters.regions || [])

const loadingEl = ref(null)

const focus = () => {
  loadingEl.value?.focus()
}

function changeHandler(val, field) {
  regions.value = { ...regions.value, [field]: val }
}

defineExpose({ focus })
</script>
<style scoped>
#zones-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
