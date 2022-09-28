<template>
  <div class="pa-3 point-wrapper">
    <div class="main-column-wrapper">
      <div class="row">
        <v-select
          v-model="tmpPoint.type"
          :items="pointTypes"
          dense
          :readonly="readonly"
          hide-details
          outlined
          :style="{ 'max-width': '150px' }"
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
      />
      <v-text-field
        v-model="tmpPoint.note"
        label="Примечание"
        hide-details
        :readonly="readonly"
        outlined
        :style="{ 'min-width': '550px' }"
        dense
      />
    </div>
    <div 
      v-if="!isTemplate" 
      class="dates-column"
    >
      <app-date-time-input
        v-model="tmpPoint.plannedDate"
        type="datetime-local"
        label="Плановая дата"
        dense
        outlined
        hide-details
        :readonly="readonly"
        @change="change($event, 'plannedDate')"
      />
      <app-date-time-input
        v-model="tmpPoint.arrivalDate"
        type="datetime-local"
        label="Факт прибытия"
        showPrependIcon
        hide-details
        dense
        outlined
        :minDate="tmpPoint.minArrivalDate"
        :disabled="!confirmed || point.arrivalDateDisabled"
        :errorMessages="arrivalDateErrors"
        @change="change($event, 'arrivalDate')"
      />
      <app-date-time-input
        v-model="tmpPoint.departureDate"
        type="datetime-local"
        label="Факт убытия"
        dense
        outlined
        showPrependIcon
        hide-details
        :disabled="!confirmed || point.departureDateDisabled"
        :minDate="tmpPoint.arrivalDate"
        :errorMessages="departureDateErrors"
        @change="change($event, 'departureDate')"
      />
    </div>
    <div 
      v-if="!isTemplate && isShowDocDates"
      class="dates-column"
    >
      <app-date-time-input
        v-model="tmpPoint.plannedDateDoc"
        type="datetime-local"
        label="Плановая дата (док)"
        dense
        outlined
        hide-details
        :readonly="readonlyDocDates"
      />
      <app-date-time-input
        v-model="tmpPoint.arrivalDateDoc"
        type="datetime-local"
        label="Факт прибытия (док)"
        :readonly="readonlyDocDates"
        hide-details
        dense
        outlined
      />
      <app-date-time-input
        v-model="tmpPoint.departureDateDoc"
        type="datetime-local"
        label="Факт убытия (док)"
        :readonly="readonlyDocDates"
        dense
        outlined
        hide-details
      />
    </div>
    <div
      v-if="isTemplate && fixedTimeSlots"
      id="fixedTime"
    >
      <v-text-field
        v-model="tmpPoint.fixedTime"
        label="Время"
        tag="div"
        type="time"
        dense
        hide-details
        outlined
        :style="{ 'max-width': '100px' }"
      />

      <v-text-field
        v-if="ind !== 0"
        v-model.number="tmpPoint.offsetDays"
        :style="{ 'max-width': '180px' }"
        label="Смещение в днях"
        persistent-hint
        hint="Смещение в днях относительно даты начала рейса"
        type="number"
        tag="div"
        outlined
        dense
        min="0"
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
import AppDateTimeInput from '@/modules/common/components/dateTimeInput2'

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
    fixedTimeSlots: { type: Boolean, default: false },
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
        plannedDateDoc: null,
        arrivalDateDoc: null,
        departureDateDoc: null,
        note: null,
        fixedTime: null,
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
    isShowDocDates() {
      return this.$store.getters.hasPermission('order:showDocDates') 
    },
    readonlyDocDates() {
      return !this.$store.getters.hasPermission('order:writeDocDates') 
    }
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
    watch: {
      deep: true,
      handler: function(val) {
        this.$emit('changePoint', val)  
      }
    },
    tmpPoint: {
      deep: true,
      handler: function (val) {
        this.$emit('changePoint', { ...val})  
      }
    }
  },
  created() {
    this.setFields(this.point)
    if (this.point.plannedDate && !this.point.plannedDateDoc) 
      this.tmpPoint.plannedDateDoc = this.point.plannedDate
  },
  methods: {
    setFields(point) {
      this.tmpPoint = point
    },
    change(val, field) {
      this.tmpPoint[field+'Doc'] = val
      
    },
  },
}
</script>
<style scoped>
.point-wrapper {
  display: flex;
  gap: 20px;
  flex-direction: row;
  flex-wrap: nowrap;
}
.point-wrapper > div > * {
  margin: 5px;
}
.main-column-wrapper {
  flex-grow: 1;
}
.dates-column {
  flex-basis: 270px;
}
.remove-btn-wrapper {
  min-width: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
