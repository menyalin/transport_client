<template>
  <div id="wrapper">
    <app-address-autocomplete
      ref="loadingEl"
      v-model="tmpItem.loading"
      pointType="loading"
      label="Погрузка"
      dense
      outlined
      hide-details
    />
    <div v-for="(zone, idx) of tmpItem.zones" :key="idx" class="zone-row">
      <v-text-field
        v-model.number="tmpItem.zones[idx].distance"
        type="number"
        label="До, км"
        dense
        outlined
        hide-details
        :style="{ 'max-width': '100px' }"
      />
      <v-text-field
        v-model.number="tmpItem.zones[idx].price"
        :label="withVat ? 'Цена с НДС' : 'Цена без НДС'"
        type="number"
        dense
        outlined
        hide-details
        :style="{ 'max-width': '160px' }"
      />
      <v-btn
        v-if="showDeleteBtn(idx)"
        icon
        small
        color="red"
        @click="deleteRow"
      >
        <v-icon small> mdi-delete </v-icon>
      </v-btn>
      <v-btn
        v-if="showAddBtn(idx) && !invalidZones"
        icon
        color="primary"
        @click="addRow"
      >
        <v-icon> mdi-plus-circle </v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'

export default {
  name: 'TariffDirectDistanceZonesType',
  components: {
    AppAddressAutocomplete,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    withVat: { type: Boolean, required: true },
  },
  data() {
    return {
      tmpItem: {
        loading: null,
        zones: [],
      },
    }
  },
  computed: {
    invalidZones() {
      if (!this.tmpItem.zones || this.tmpItem.zones.length === 0) return true
      return this.tmpItem.zones.some((i) => !i.distance || !i.price)
    },
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpItem = val
        if (!this.tmpItem?.zones?.length) {
          this.tmpItem.zones = [{ distance: null, price: null }]
        }
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
      this.$refs.loadingEl.focus()
    },
    showDeleteBtn(idx) {
      return (
        this.tmpItem.zones.length > 1 && this.tmpItem.zones.length === idx + 1
      )
    },
    showAddBtn(idx) {
      return this.tmpItem.zones.length === idx + 1
    },
    addRow() {
      this.$nextTick(() => {
        this.tmpItem.zones.push({
          distance: null,
          price: null,
        })
      })
    },
    deleteRow() {
      this.$nextTick(() => {
        this.tmpItem.zones.pop({
          distance: null,
          price: null,
        })
      })
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
.zone-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
</style>
