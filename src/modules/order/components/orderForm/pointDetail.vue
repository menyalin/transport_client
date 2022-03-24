<template>
  <div class="pa-3 point-wrapper">
    <div>
      <div class="row">
        <v-select
          v-model="tmpPoint.type"
          :items="pointTypes"
          dense
          :readonly="readonly"
          hide-details
          outlined
          :style="{ 'max-width': '150px' }"
          @change="change"
        />
        <v-checkbox
          v-if="tmpPoint.isReturn"
          v-model="tmpPoint.isReturn"
          label="Возврат"
          readonly
          hide-details
          dense
          color="red"
          class="ml-4"
        />
      </div>

      <app-address-autocomplete
        v-model="tmpPoint.address"
        :pointType="!tmpPoint.isReturn ? tmpPoint.type : null"
        :disabled="!tmpPoint.type"
        label="Адрес"
        :readonly="readonly"
        dense
        :style="{ 'min-width': '550px' }"
        outlined
        hide-details
        @change="change"
      />
      <v-text-field
        v-model="tmpPoint.note"
        label="Примечание"
        hide-details
        :readonly="readonly"
        outlined
        :style="{ 'min-width': '550px' }"
        dense
        @change="change"
      />
    </div>
    <div v-if="!isTemplate">
      <app-date-time-input
        v-model="tmpPoint.plannedDate"
        label="Плановая дата"
        :readonly="readonly"
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
      v-if="showDeleteBtn && !readonly"
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
    readonly: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tmpPoint: {
        type: null,
        address: null,
        isReturn: false,
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
  gap: 10px;
  grid-template-columns: auto 315px 30px;
}
.point-wrapper > div > * {
  margin: 5px;
}
.remove-btn-wrapper {
  min-width: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
