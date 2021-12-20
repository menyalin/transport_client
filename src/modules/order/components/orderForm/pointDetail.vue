<template>
  <div class="pa-3 point-wrapper">
    <div>
      <v-select
        v-model="tmpPoint.type"
        :items="pointTypes"
        dense
        hide-details
        outlined
        :style="{ 'max-width': '150px' }"
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
      <v-text-field
        v-model="tmpPoint.note"
        label="Примечание"
        hide-details
        outlined
        dense
        @change="change"
      />
    </div>
    <div>
      <app-date-time-input
        v-model="tmpPoint.plannedDate"
        label="Плановая дата"
        hidePrependIcon
        @change="change"
      />
      <app-date-time-input
        v-model="tmpPoint.arrivalDate"
        label="Факт прибытия"
        :minDate="tmpPoint.minArrivalDate"
        :disabled="!confirmed || tmpPoint.arrivalDateDisabled"
        :errorMessages="arrivalDateErrors"
        @change="change"
      />
      {{ tmpPoint.isLastPoint }}
      <app-date-time-input
        v-model="tmpPoint.departureDate"
        label="Факт убытия"
        :disabled="!confirmed || tmpPoint.departureDateDisabled"
        :minDate="tmpPoint.arrivalDate"
        :errorMessages="departureDateErrors"
        @change="change"
      />
    </div>
    <div
      v-if="showDeleteBtn"
      class="remove-btn-wrapper"
    >
      <v-btn
        icon
        dark
        color="error"
        @click="$emit('delete', ind)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { isLaterThan } from '@/modules/common/helpers/dateValidators'
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
    confirmed: Boolean,
    isActive: Boolean,
    ind: Number,
    showDeleteBtn: {
      type: Boolean,
      default: false,
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
    departureDateErrors() {
      let errors = []
      if (!this.$v.tmpPoint.departureDate.isLaterThan)
        errors.push('Дата не корректна')
      return errors
    },
    arrivalDateErrors() {
      let errors = []
      if (!this.$v.tmpPoint.arrivalDate.isLaterThan)
        errors.push('Дата не корректна')
      return errors
    },
  },
  validations() {
    return {
      tmpPoint: {
        departureDate: {
          isLaterThan: isLaterThan(this.tmpPoint.arrivalDate),
        },
        arrivalDate: {
          isLaterThan: isLaterThan(this.tmpPoint.minArrivalDate),
        },
      },
    }
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
  grid-template-columns: 1fr auto 50px;
}
.point-wrapper > div > * {
  margin: 5px;
}
.remove-btn-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
