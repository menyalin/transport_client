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

<script>
import { ref, computed, getCurrentInstance } from 'vue'

export default {
  name: 'SalaryTariffRegionType',
  props: {
    regions: Object,
  },
  model: {
    prop: 'regions',
    event: 'change',
  },

  setup(props, ctx) {
    const instance = getCurrentInstance()
    const store = instance?.proxy.$store

    const regionItems = computed(() => store?.getters.regions || [])

    const loadingEl = ref(null)

    const focus = () => {
      loadingEl.value?.focus()
    }
    function changeHandler(val, field) {
      ctx.emit('change', { ...props.regions, [field]: val })
    }

    return {
      regionItems,
      loadingEl,
      focus,
      changeHandler,
    }
  },
}
</script>
<style scoped>
#zones-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
