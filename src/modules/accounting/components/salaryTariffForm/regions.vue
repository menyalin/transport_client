<template>
  <div id="zones-wrapper">
    <v-autocomplete
      ref="loadingEl"
      v-model="tmpPoints.loadingRegion"
      label="Регион погрузки"
      :items="$store.getters.regions"
      item-value="_id"
      item-title="name"
      density="compact"
      variant="outlined"
      hide-details
    />
    <v-autocomplete
      v-model="tmpPoints.unloadingRegion"
      label="Регион разгрузки"
      density="compact"
      item-value="_id"
      item-title="name"
      variant="outlined"
      :items="$store.getters.regions"
      hide-details
    />
  </div>
</template>
<script>
export default {
  name: 'SalaryTariffRegionType',

  model: {
    prop: 'regions',
    event: 'change',
  },
  props: {
    regions: Object,
  },
  data() {
    return {
      tmpPoints: {
        loadingRegion: null,
        unloadingRegion: null,
      },
    }
  },

  watch: {
    regions: {
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
