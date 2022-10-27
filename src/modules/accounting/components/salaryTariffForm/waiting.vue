<template>
  <div id="wrapper">
    <v-autocomplete
      label="Клиенты"
      dense
      :items="clients"
      item-value="_id"
      item-text="name"
      multiple
      outlined
      hide-details
      v-model="tmpItem.clients"
    />
    <v-select
      ref="first_field"
      v-model="tmpItem.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
      dense
      outlined
      hide-details
    />
    <v-text-field
      v-model.number="tmpItem.includeHours"
      type="number"
      label="Кол-во часов включенных в тариф"
      dense
      outlined
      hide-details
    />
    <v-select
      v-model="tmpItem.roundByHours"
      label="Округление времени"
      :items="$store.getters.roundingWaitingByHours"
      dense
      outlined
      hide-details
    />
    <v-select
      v-model="tmpItem.tariffBy"
      label="Тариф за"
      :items="$store.getters.waitingTariffByItems"
      dense
      outlined
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
