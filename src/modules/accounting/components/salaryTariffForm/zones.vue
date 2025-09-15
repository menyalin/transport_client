<template>
  <div id="zones-wrapper">
    <app-zone-autocomplete
      ref="loadingEl"
      v-model="tmpPoints.loadingZone"
      label="Зона погрузки"
      density="compact"
      variant="outlined"
      hide-details
    />
    <app-zone-autocomplete
      v-model="tmpPoints.unloadingZone"
      label="Зона разгрузки"
      density="compact"
      variant="outlined"
      hide-details
    />
  </div>
</template>
<script>
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
  data() {
    return {
      tmpPoints: {
        loadingZone: null,
        unloadingZone: null,
      },
    }
  },

  watch: {
    zones: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpPoints = val
      },
    },
    tmpPoints: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    focus() {
      this.$refs.loadingEl.focus()
    },
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
