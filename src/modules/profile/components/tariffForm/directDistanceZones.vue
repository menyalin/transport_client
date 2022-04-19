<template>
  <div id="wrapper">
    <app-address-autocomplete
      ref="loadingEl"
      v-model="tmpItem.loading"
      pointType="loading"
      label="Погрузка"
      dense
      outlined
      hide-details
    />
    <v-text-field
      v-model.number="tmpItem.maxDistance"
      type="number"
      label="До, км"
      dense
      outlined
      hide-details
    />
  </div>
</template>
<script>
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'

export default {
  name: 'TariffDirectDistanceZonesType',
  components: {
    AppAddressAutocomplete,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
  },
  data() {
    return {
      tmpItem: {
        loading: null,
        maxDistance: null,
      },
    }
  },

  watch: {
    item: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpItem = val
      },
    },
    tmpItem: {
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
#wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
