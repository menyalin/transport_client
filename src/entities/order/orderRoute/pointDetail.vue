<template>
  <div class="pa-2 point-wrapper">
    <div class="main-column-wrapper">
      <div class="settings_row">
        <v-select
          :value="tmpPoint.type"
          :items="pointTypes"
          dense
          :readonly="readonly"
          hide-details
          outlined
          :style="{ 'max-width': '150px' }"
          @change="setField($event, 'type')"
        />
        <v-checkbox
          v-if="showMainLoadingPointSelector && tmpPoint.type === 'loading'"
          v-model="tmpPoint.isMainLoadingPoint"
          label="Основной пункт погрузки"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'isMainLoadingPoint')"
        />
        <v-checkbox
          v-model="tmpPoint.useInterval"
          label="Временнное окно"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'useInterval')"
        />
        <v-checkbox
          v-if="
            tmpPoint.isReturn ||
            (showReturnBtn && tmpPoint.type === 'unloading')
          "
          v-model="tmpPoint.isReturn"
          label="Возврат"
          :readonly="!showReturnBtn || tmpPoint.isPltReturn"
          hide-details
          dense
          color="red"
          class="ml-4"
          @change="setField($event, 'isReturn')"
        />
        <v-checkbox
          v-if="tmpPoint.isReturn || tmpPoint.isPltReturn"
          v-model="tmpPoint.isPltReturn"
          label="Возврат паллет"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'isPltReturn')"
        />
        <v-checkbox
          v-if="tmpPoint.isAutofilled"
          v-model="tmpPoint.isAutofilled"
          label="Автозаполнение"
          hide-details
          dense
          disabled
          color="grey"
          class="ml-4"
        />
        <v-spacer />
        <v-checkbox
          v-if="!!tmpPoint.arrivalDate && !tmpPoint.departureDate"
          v-model="tmpPoint.waitsForWaybills"
          label="Ожидает документы"
          hide-details
          dense
          color="primary"
          class="mx-4"
          @change="setField($event, 'waitsForWaybills')"
        />
      </div>

      <app-address-autocomplete
        :value="tmpPoint.address"
        :pointType="!tmpPoint.isReturn ? tmpPoint.type : null"
        :disabled="!tmpPoint.type"
        label="Адрес"
        :readonly="readonly"
        dense
        :style="{ 'min-width': '550px' }"
        outlined
        hide-details
        @change="setField($event, 'address')"
      />

      <v-text-field
        v-if="tmpPoint.type === 'unloading'"
        :value="tmpPoint.waybills"
        label="Накладные"
        hide-details
        :readonly="readonly"
        outlined
        :style="{ 'min-width': '550px' }"
        dense
        @change="setField($event, 'waybills')"
      />
      <v-text-field
        :value="tmpPoint.note"
        label="Примечание"
        hide-details
        :readonly="readonly"
        outlined
        :style="{ 'min-width': '550px' }"
        dense
        @change="setField($event, 'note')"
      />
    </div>
    <div v-if="!isTemplate" class="dates-column">
      <BorderedBlock title="Временное окно" v-if="tmpPoint.useInterval">
        <app-date-time-input
          :value="tmpPoint.plannedDate"
          type="datetime-local"
          label="Начало периода"
          dense
          outlined
          class="mt-1"
          hide-details
          :readonly="readonly"
          @change="setField($event, 'plannedDate')"
        />
        <app-date-time-input
          :value="tmpPoint.intervalEndDate"
          type="datetime-local"
          label="Конец периода"
          dense
          outlined
          hide-details
          :readonly="readonly"
          class="mt-2"
          @change="setField($event, 'intervalEndDate')"
        />
      </BorderedBlock>
      <app-date-time-input
        v-else
        :value="tmpPoint.plannedDate"
        type="datetime-local"
        label="Плановая дата"
        dense
        outlined
        class="mt-1"
        hide-details
        :readonly="readonly"
        @change="setField($event, 'plannedDate')"
      />
      <app-date-time-input
        :value="tmpPoint.arrivalDate"
        type="datetime-local"
        label="Факт прибытия"
        showPrependIcon
        hide-details
        dense
        outlined
        :minDate="tmpPoint.minArrivalDate"
        :disabled="!confirmed || point.arrivalDateDisabled"
        :errorMessages="arrivalDateErrors"
        @change="setField($event, 'arrivalDate')"
      />
      <app-date-time-input
        :value="tmpPoint.departureDate"
        type="datetime-local"
        label="Факт убытия"
        dense
        outlined
        showPrependIcon
        hide-details
        :disabled="!confirmed || point.departureDateDisabled"
        :minDate="tmpPoint.arrivalDate"
        :errorMessages="departureDateErrors"
        @change="setField($event, 'departureDate')"
      />
    </div>
    <div v-if="!isTemplate && isShowDocDates" class="dates-column">
      <BorderedBlock title="Временное окно (Док)" v-if="tmpPoint.useInterval">
        <app-date-time-input
          :value="tmpPoint.plannedDateDoc"
          type="datetime-local"
          label="Начало периода"
          dense
          outlined
          class="mt-1"
          hide-details
          :readonly="readonly"
          @change="setField($event, 'plannedDateDoc')"
        />
        <app-date-time-input
          :value="tmpPoint.intervalEndDateDoc"
          type="datetime-local"
          label="Конец периода"
          dense
          outlined
          hide-details
          :readonly="readonly"
          class="mt-2"
          @change="setField($event, 'intervalEndDateDoc')"
        />
      </BorderedBlock>
      <app-date-time-input
        v-else
        :value="tmpPoint.plannedDateDoc"
        type="datetime-local"
        label="Плановая дата (док)"
        dense
        outlined
        class="mt-1"
        hide-details
        :readonly="readonly"
        @change="setField($event, 'plannedDateDoc')"
      />
      <app-date-time-input
        :value="tmpPoint.arrivalDateDoc"
        type="datetime-local"
        label="Факт прибытия (док)"
        :readonly="readonlyDocDates"
        hide-details
        dense
        outlined
        @change="setField($event, 'arrivalDateDoc')"
      />
      <app-date-time-input
        :value="tmpPoint.departureDateDoc"
        type="datetime-local"
        label="Факт убытия (док)"
        :readonly="readonlyDocDates"
        dense
        outlined
        hide-details
        @change="setField($event, 'departureDateDoc')"
      />
    </div>
    <div v-if="isTemplate && fixedTimeSlots" id="fixedTimeBlock">
      <div class="time-row">
        <v-text-field
          :value="tmpPoint.fixedTime"
          label="Время"
          tag="div"
          type="time"
          dense
          hide-details
          outlined
          :style="{ 'max-width': '100px' }"
          @change="setField($event, 'fixedTime')"
        />
        <v-text-field
          v-if="tmpPoint.useInterval"
          :value="tmpPoint.hoursInterval"
          label="Окно, часов"
          type="number"
          dense
          min="0"
          hide-details
          outlined
          :style="{ 'max-width': '130px' }"
          @change="setField($event, 'hoursInterval')"
        />
      </div>

      <v-text-field
        v-if="ind !== 0"
        v-model.number="tmpPoint.offsetDays"
        :style="{ 'max-width': '240px' }"
        label="Смещение в днях"
        persistent-hint
        hint="Смещение в днях относительно даты начала рейса"
        type="number"
        tag="div"
        outlined
        dense
        min="0"
        @change="setField($event, 'offsetDays')"
      />
    </div>
    <div v-if="showDeleteBtn && !readonly" class="remove-btn-wrapper">
      <v-btn icon dark color="error" @click="$emit('delete', ind)">
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
import { BorderedBlock } from '@/shared/ui'

export default {
  name: 'PointDetail',
  components: {
    AppAddressAutocomplete,
    AppDateTimeInput,
    BorderedBlock,
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
    showReturnBtn: {
      type: Boolean,
      default: true,
    },
    showMainLoadingPointSelector: Boolean,
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tmpPoint: {
        type: null,
        waybills: null,
        address: null,
        isReturn: false,
        isPltReturn: false,
        isAutofilled: false,
        useInterval: false,
        plannedDate: null,
        intervalEndDate: null,
        intervalEndDateDoc: null,
        arrivalDate: null,
        departureDate: null,
        plannedDateDoc: null,
        arrivalDateDoc: null,
        departureDateDoc: null,
        waitsForWaybills: false,
        note: null,
        fixedTime: null,
        isMainLoadingPoint: null,
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
      deep: true,
      immediate: true,
      handler: function (val) {
        this.setFields(val)
      },
    },
  },
  created() {
    this.setFields(this.point)
    if (this.point.plannedDate && !this.point.plannedDateDoc)
      this.tmpPoint.plannedDateDoc = this.point.plannedDate
  },
  methods: {
    setFields(point) {
      this.tmpPoint = { ...point }
    },

    setField(val, field) {
      const DATE_FIELDS = [
        'plannedDate',
        'arrivalDate',
        'departureDate',
        'intervalEndDate',
      ]
      this.tmpPoint[field] = val
      if (DATE_FIELDS.includes(field)) this.tmpPoint[field + 'Doc'] = val
      if (['arrivalDate', 'departureDate'].includes(field))
        this.tmpPoint.isAutofilled = false

      this.$emit('changePoint', { ...this.tmpPoint })
    },
  },
}
</script>
<style scoped>
.settings_row {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.point-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
}
.point-wrapper > div > * {
  margin: 5px;
}
.main-column-wrapper {
  flex-grow: 1;
}
.dates-column {
  flex-basis: 220px;
}
.remove-btn-wrapper {
  min-width: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
#fixedTimeBlock {
  border: 1px solid;
  min-width: 250px;
}
.time-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
}
</style>
