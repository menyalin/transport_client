<template>
  <div id="wrapper">
    <v-autocomplete
      ref="first_field"
      v-model="tmpItem.clients"
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
      v-model="tmpItem.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
      density="compact"
      variant="outlined"
      hide-details
    />
    <v-text-field
      v-model.number="tmpItem.includeHours"
      type="number"
      label="Кол-во часов включенных в тариф"
      density="compact"
      variant="outlined"
      hide-details
    />
    <v-select
      v-model="tmpItem.roundByHours"
      label="Округление времени"
      :items="$store.getters.roundingWaitingByHours"
      density="compact"
      variant="outlined"
      hide-details
    />
    <v-select
      v-model="tmpItem.tariffBy"
      label="Тариф за"
      :items="$store.getters.waitingTariffByItems"
      density="compact"
      variant="outlined"
      hide-details
    />
  </div>
</template>
<script>
export default {
  name: 'WaitingTariffType',
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
        clients: [],
        orderType: null,
        includeHours: null,
        roundByHours: null,
        tariffBy: null,
      },
    }
  },
  computed: {
    clients() {
      return this.$store.getters.partners.filter((i) => i.isClient)
    },
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
      this.$refs.first_field.focus()
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
