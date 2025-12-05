<template>
  <div id="wrapper">
    <v-autocomplete
      ref="first_field"
      v-model="tmpItem.clients"
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
      v-model="tmpItem.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
     
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-text-field
      v-model.number="tmpItem.includeHours"
      type="number"
      label="Кол-во часов включенных в тариф"
     
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-select
      v-model="tmpItem.roundByHours"
      label="Округление времени"
      :items="$store.getters.roundingWaitingByHours"
     
      variant="outlined"
       density="compact"
      hideDetails
    />
    <v-select
      v-model="tmpItem.tariffBy"
      label="Тариф за"
      :items="$store.getters.waitingTariffByItems"
     
      variant="outlined"
       density="compact"
      hideDetails
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
      return this.$store.getters.partners.filter(i => i.isClient)
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
