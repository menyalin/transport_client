<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="routeTypeEl"
      v-model="tmpAdditionalPoints.clients"
      label="Клиенты"
      density="compact"
      :items="clients"
      item-value="_id"
      item-title="name"
      multiple
      variant="outlined"
      hide-details
    />
    <v-select
      v-model="tmpAdditionalPoints.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
      density="compact"
      variant="outlined"
      hide-details
    />
    <v-text-field
      v-model.number="tmpAdditionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
      density="compact"
      type="number"
      variant="outlined"
      hide-details
    />
  </div>
</template>
<script>
export default {
  name: 'TariffPointsType',
  model: {
    prop: 'additionalPoints',
    event: 'change',
  },
  props: {
    additionalPoints: Object,
  },
  data() {
    return {
      tmpAdditionalPoints: {
        clients: [],
        orderType: null,
        includedPoints: null,
      },
    }
  },
  computed: {
    clients() {
      return this.$store.getters.partners.filter((i) => i.isClient)
    },
  },
  watch: {
    additionalPoints: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpAdditionalPoints = val
      },
    },
    tmpAdditionalPoints: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    focus() {
      this.$refs.routeTypeEl.focus()
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
