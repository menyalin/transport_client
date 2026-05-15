<template>
  <div id="zones-wrapper">
    <app-zone-autocomplete
      ref="loadingEl"
      :value="zones.loadingZone"
      label="Зона погрузки"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'loadingZone')"
    />
    <app-zone-autocomplete
      :value="zones.unloadingZone"
      label="Зона разгрузки"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'unloadingZone')"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import AppZoneAutocomplete from '@/modules/common/components/zoneAutocomplete'

export default {
  name: 'TariffPointsType',
  components: {
    AppZoneAutocomplete,
  },
  model: {
    prop: 'zones',
    event: 'change',
  },
  props: {
    zones: Object,
  },

  setup(props, ctx) {
    const loadingEl = ref(null)

    const focus = () => {
      loadingEl.value?.focus()
    }

    function changeHandler(val, field) {
      ctx.emit('change', { ...props.zones, [field]: val })
    }

    return {
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
