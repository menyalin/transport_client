<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="routeTypeEl"
      label="Клиенты"
      dense
      :items="clients"
      item-value="_id"
      item-text="name"
      multiple
      outlined
      hide-details
      v-model="tmpAdditionalPoints.clients"
    />
    <v-select
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
