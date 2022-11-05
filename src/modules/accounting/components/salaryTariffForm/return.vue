<template>
  <div id="wrapper">
    <v-autocomplete
      ref="first_field"
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
      label="Типы грузополучателей"
      :items="$store.getters.partnerGroups"
      dense
      multiple
      outlined
      hide-details
      v-model="tmpItem.consigneeTypes"
    />
    <v-select
      v-model="tmpItem.orderType"
      label="Тип рейса"
      :items="$store.getters.orderAnalyticTypes"
      dense
      outlined
      hide-details
    />
    <v-checkbox
      label="Возврат паллет"
      v-model="tmpItem.isPltReturn"
      color="primary"
    />
  </div>
</template>
<script>
export default {
  name: 'ReturnTariffType',
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
        consigneeTypes: [],
        orderType: null,
        isPltReturn: false,
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
