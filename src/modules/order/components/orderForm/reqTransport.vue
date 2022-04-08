<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="req-transport-block">
      <v-select
        v-if="!hideTruckKindField"
        :value="reqTransport.kind"
        :items="truckKinds"
        outlined
        dense
        hide-details
        label="Вид ТС"
        @change="change($event, 'kind')"
      />
      <v-select
        v-if="!hideLiftCapacityField"
        :value="reqTransport.liftCapacity"
        :items="liftCapacityTypes"
        outlined
        dense
        hide-details
        label="Груз-ть"
        @change="change($event, 'liftCapacity')"
      />
      <v-select
        v-if="!hideLoadDirectionField"
        :value="reqTransport.loadDirection"
        :items="loadDirection"
        outlined
        dense
        hide-details
        label="Загрузка"
        @change="change($event, 'loadDirection')"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppBlockTitle from '@/modules/order/components/orderForm/blockTitle.vue'

export default {
  name: 'ReqTransport',
  components: {
    AppBlockTitle,
  },
  model: {
    prop: 'reqTransport',
    event: 'change',
  },
  props: {
    reqTransport: Object,
    title: String,
  },
  data() {
    return {
      params: {
        kind: null,
        liftCapacity: null,
        loadDirection: null,
      },
    }
  },
  computed: {
    ...mapGetters(['liftCapacityTypes', 'truckKinds', 'loadDirection']),
    companySettings() {
      return this.$store.getters.companySettings
    },
    hideLoadDirectionField() {
      return (
        this.companySettings.loadDirections.length === 1 &&
        !!this.companySettings.defaultLoadDirection
      )
    },
    hideLiftCapacityField() {
      return (
        this.companySettings.liftCapacityTypes.length === 1 &&
        !!this.companySettings.defaultLiftCapacity
      )
    },
    hideTruckKindField() {
      return (
        this.companySettings.truckKinds.length === 1 &&
        !!this.companySettings.defaultTruckKind
      )
    },
  },
  watch: {
    reqTransport: {
      immediate: true,
      handler: function (val) {
        if (val.kind || val.liftCapacity) { 
          this.params.kind = val.kind
          this.params.liftCapacity = val.liftCapacity
          this.params.loadDirection = val.loadDirection || 'rear'
        } else {
          this.$emit('change', {
            kind: this.companySettings?.defaultTruckKind || null,
            liftCapacity: this.companySettings?.defaultLiftCapacity || null,
            loadDirection: this.companySettings?.defaultLoadDirection || null,
          })
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
  grid-template-columns: 180px 160px 160px;
  margin: 10px;
  gap: 15px;
}
</style>
