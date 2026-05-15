<template>
  <div id="zones-wrapper">
    <v-autocomplete
      ref="loadingEl"
      :value="regions.loadingRegion"
      label="Регион погрузки"
      :items="regionItems"
      item-value="_id"
      item-text="name"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'loadingRegion')"
    />
    <v-autocomplete
      :value="regions.unloadingRegion"
      label="Регион разгрузки"
      dense
      item-value="_id"
      item-text="name"
      outlined
      :items="regionItems"
      hide-details
      @change="changeHandler($event, 'unloadingRegion')"
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
