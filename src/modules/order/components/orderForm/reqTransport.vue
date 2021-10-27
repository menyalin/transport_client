<template>
  <div class="req-transport-block">
    <v-select
      :value="reqTransport.kind"
      :items="truckKinds"
      outlined
      dense
      hide-details
      label="Вид ТС"
      @change="change($event, 'kind')"
    />
    <v-select
      :value="reqTransport.liftCapacity"
      :items="liftCapacityTypes"
      outlined
      dense
      hide-details
      label="Груз-ть"
      @change="change($event, 'liftCapacity')"
    />
    <v-select
      :value="reqTransport.loadDirection"
      :items="loadDirection"
      outlined
      dense
      hide-details
      label="t-режим"
      @change="change($event, 'loadDirection')"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ReqTransport',
  model: {
    prop: 'reqTransport',
    event: 'change',
  },
  props: {
    reqTransport: Object,
  },
  data() {
    return {
      params: {
        kind: null,
        liftCapacity: null,
        loadDirection: 'rear',
      },
    }
  },
  computed: {
    ...mapGetters(['liftCapacityTypes', 'truckKinds', 'loadDirection']),
  },
  watch: {
    reqTransport: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.params.kind = val.kind
          this.params.liftCapacity = val.liftCapacity
          this.params.loadDirection = val.loadDirection
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
  },
}
</script>
<style scoped>
.req-transport-block {
  display: grid;
  grid-template-columns: 160px 160px 160px;
  margin: 10px;
  gap: 15px;
}
</style>
