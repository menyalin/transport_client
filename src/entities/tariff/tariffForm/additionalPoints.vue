<template>
  <div id="points-wrapper">
    <v-select
      ref="routeTypeEl"
      v-model="tmpAdditionalPoints.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
      dense
      outlined
      hide-details
    />
    <v-text-field
      v-model.number="tmpAdditionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
      dense
      type="number"
      outlined
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
        orderType: null,
        includedPoints: null,
      },
    }
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
