<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="routeTypeEl"
      v-model="tmpAdditionalPoints.clients"
      label="Клиенты"
     
      :items="clients"
      itemValue="_id"
      itemTitle="name"
      multiple
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-select
      v-model="tmpAdditionalPoints.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
     
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-text-field
      v-model.number="tmpAdditionalPoints.includedPoints"
      label="Кол-во точек включенных в тариф"
     
      type="number"
      variant="outlined"
       density="compact"
      hideDetails
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
      return this.$store.getters.partners.filter(i => i.isClient)
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
