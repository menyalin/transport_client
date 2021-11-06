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
    />
    <app-address-autocomplete
      v-model="tmpPoint.address"
      :pointType="tmpPoint.type"
      :disabled="!tmpPoint.type"
      label="Адрес"
      dense
      outlined
      hide-details
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
  grid-gap: 7px;
  grid-template-columns: 140px 320px auto;
}
</style>
