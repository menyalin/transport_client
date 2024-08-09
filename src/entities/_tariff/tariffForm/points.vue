<template>
  <div id="points-wrapper">
    <app-address-autocomplete
      ref="loadingEl"
      v-model="tmpPoints.loading"
      pointType="loading"
      label="Погрузка"
      dense
      outlined
      hide-details
    />
    <app-address-autocomplete
      v-model="tmpPoints.unloading"
      label="Разгрузка"
      pointType="unloading"
      dense
      outlined
      hide-details
    />
  </div>
</template>
<script>
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'

export default {
  name: 'TariffPointsType',
  components: {
    AppAddressAutocomplete,
  },
  model: {
    prop: 'points',
    event: 'change',
  },
  props: {
    points: Object,
  },
  data() {
    return {
      tmpPoints: {
        loading: null,
        unloading: null,
      },
    }
  },

  watch: {
    points: {
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
#points-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
