<template>
  <div id="zones-wrapper">
    <v-autocomplete
      ref="loadingEl"
      v-model="tmpPoints.loadingRegion"
      label="Регион погрузки"
      :items="$store.getters.regions"
      itemValue="_id"
      itemTitle="name"
     
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-autocomplete
      v-model="tmpPoints.unloadingRegion"
      label="Регион разгрузки"
     
      itemValue="_id"
      itemTitle="name"
      variant="outlined"
       density="compact"
      :items="$store.getters.regions"
      hideDetails
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
