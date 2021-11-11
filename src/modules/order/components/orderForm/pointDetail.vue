<template>
  <div class="pa-3 point-wrapper">
    <v-select
      v-model="tmpPoint.type"
      :items="pointTypes"
      dense
      hide-details
      outlined
      @change="change"
    />
    <app-date-time-input
      v-model="tmpPoint.plannedDate"
      label="Плановая дата"
      hidePrependIcon
      @change="change"
    />

    <app-address-autocomplete
      v-model="tmpPoint.address"
      :pointType="tmpPoint.type"
      :disabled="!tmpPoint.type"
      label="Адрес"
      dense
      outlined
      hide-details
      @change="change"
    />

    <app-date-time-input
      v-model="tmpPoint.arrivalDate"
      label="Факт прибытия"
      @change="change"
    />
    <v-text-field
      v-model="tmpPoint.note"
      label="Примечание"
      hide-details
      outlined
      dense
      @change="change"
    />
    <app-date-time-input
      v-model="tmpPoint.departureDate"
      label="Факт убытия"
      @change="change"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'PointDetail',
  components: {
    AppAddressAutocomplete,
    AppDateTimeInput,
  },
  props: {
    point: {
      type: Object,
    },
  },
  data() {
    return {
      tmpPoint: {
        type: null,
        address: null,
        plannedDate: null,
        arrivalDate: null,
        departureDate: null,
        note: null,
      },
    }
  },
  computed: {
    ...mapGetters(['pointTypes']),
  },
  watch: {
    point: {
      immediate: true,
      handler: function (val) {
        if (!!val) {
          this.setFields(val)
        }
      },
    },
  },

  methods: {
    setFields(point) {
      this.tmpPoint = point
    },
    change() {
      this.$emit('changePoint', { ...this.tmpPoint })
    },
  },
}
</script>
<style scoped>
.point-wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto 1000px;
}
</style>
