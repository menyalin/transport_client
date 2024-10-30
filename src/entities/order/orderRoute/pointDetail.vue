<template>
  <div class="pa-2 point-wrapper">
    <div class="main-column-wrapper">
      <div class="settings_row">
        <v-select
          :value="state.type"
          :items="pointTypes"
          dense
          :readonly="readonly"
          hide-details
          outlined
          :style="{ 'max-width': '150px' }"
          @change="setField($event, 'type')"
        />
        <v-checkbox
          v-if="showMainLoadingPointSelector && state.type === 'loading'"
          v-model="state.isMainLoadingPoint"
          label="Основной пункт погрузки"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'isMainLoadingPoint')"
        />
        <v-checkbox
          v-model="state.useInterval"
          label="Временнное окно"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'useInterval')"
        />
        <v-checkbox
          v-if="state.isReturn || (showReturnBtn && state.type === 'unloading')"
          v-model="state.isReturn"
          label="Возврат"
          :readonly="!showReturnBtn || state.isPltReturn"
          hide-details
          dense
          color="red"
          class="ml-4"
          @change="setField($event, 'isReturn')"
        />
        <v-checkbox
          v-if="state.isReturn || state.isPltReturn"
          v-model="state.isPltReturn"
          label="Возврат паллет"
          hide-details
          dense
          color="primary"
          class="ml-4"
          @change="setField($event, 'isPltReturn')"
        />
        <v-checkbox
          v-if="state.isAutofilled"
          v-model="state.isAutofilled"
          label="Автозаполнение"
          hide-details
          dense
          disabled
          color="grey"
          class="ml-4"
        />
        <v-spacer />
        <v-checkbox
          v-if="!!state.arrivalDate && !state.departureDate"
          v-model="state.waitsForWaybills"
          label="Ожидает документы"
          hide-details
          dense
          color="primary"
          class="mx-4"
          @change="setField($event, 'waitsForWaybills')"
        />
      </div>
      <AutoCompleteWithActions
        auto-select-first
        :value="state.address"
        :items="addressItems"
        :pointType="!state.isReturn ? state.type : null"
        :disabled="!state.type"
        label="Адрес"
        :readonly="readonly"
        :style="{ 'min-width': '550px' }"
        outlined
        :hint="addressContactsHint"
        :persistentHint="!!addressContactsHint"
        :hideDetails="!addressContactsHint"
        @update="setField($event, 'address')"
        @edit="editAddressHandler"
        @create="createAddressHandler"
      />

      <v-spacer />
      <v-text-field
        v-if="state.type === 'unloading'"
        :value="state.waybills"
        label="Накладные"
        hide-details
        :readonly="readonly"
        outlined
        :style="{ 'min-width': '550px' }"
        dense
        @change="setField($event, 'waybills')"
      />
      <v-text-field
        :value="state.note"
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
      <BorderedBlock title="Временное окно" v-if="state.useInterval">
        <DateTimeInput
          :value="state.plannedDate"
          type="datetime-local"
          label="Начало периода"
          dense
          outlined
          class="mt-1"
          hide-details
          :readonly="readonly"
          @change="setField($event, 'plannedDate')"
        />
        <DateTimeInput
          :value="state.intervalEndDate"
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
      <DateTimeInput
        v-else
        :value="state.plannedDate"
        type="datetime-local"
        label="Плановая дата"
        dense
        outlined
        class="mt-1"
        hide-details
        :readonly="readonly"
        @change="setField($event, 'plannedDate')"
      />
      <DateTimeInput
        :value="state.arrivalDate"
        type="datetime-local"
        label="Факт прибытия"
        showPrependIcon
        hide-details
        dense
        outlined
        :disabled="!confirmed || point.arrivalDateDisabled"
        @change="setField($event, 'arrivalDate')"
      />
      <DateTimeInput
        :value="state.departureDate"
        type="datetime-local"
        label="Факт убытия"
        dense
        outlined
        showPrependIcon
        hide-details
        :disabled="!confirmed || point.departureDateDisabled"
        :minDate="state.arrivalDate"
        :errorMessages="departureDateErrors"
        @change="setField($event, 'departureDate')"
      />
    </div>
    <div v-if="!isTemplate && isShowDocDates" class="dates-column">
      <BorderedBlock title="Временное окно (Док)" v-if="state.useInterval">
        <DateTimeInput
          :value="state.plannedDateDoc"
          type="datetime-local"
          label="Начало периода"
          dense
          outlined
          class="mt-1"
          hide-details
          :readonly="readonly"
          @change="setField($event, 'plannedDateDoc')"
        />
        <DateTimeInput
          :value="state.intervalEndDateDoc"
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
      <DateTimeInput
        v-else
        :value="state.plannedDateDoc"
        type="datetime-local"
        label="Плановая дата (док)"
        dense
        outlined
        class="mt-1"
        hide-details
        :readonly="readonly"
        @change="setField($event, 'plannedDateDoc')"
      />
      <DateTimeInput
        :value="state.arrivalDateDoc"
        type="datetime-local"
        label="Факт прибытия (док)"
        :readonly="readonlyDocDates"
        hide-details
        dense
        outlined
        @change="setField($event, 'arrivalDateDoc')"
      />
      <DateTimeInput
        :value="state.departureDateDoc"
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
          :value="state.fixedTime"
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
          v-if="state.useInterval"
          :value="state.hoursInterval"
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
        v-model.number="state.offsetDays"
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
import { inject } from 'vue'

import {
  BorderedBlock,
  DateTimeInput,
  AutoCompleteWithActions,
} from '@/shared/ui'
import { usePointDetail } from './usePointDetail'

export default {
  name: 'PointDetail',
  components: {
    AutoCompleteWithActions,
    DateTimeInput,
    BorderedBlock,
  },
  props: {
    addressActions: Object,
    point: Object,
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
  setup(props, ctx) {
    const addressActions = inject('addressActions')
    const {
      state,
      departureDateErrors,
      isShowDocDates,
      readonlyDocDates,
      pointTypes,
      setField,
      addressItems,
      createAddressHandler,
      editAddressHandler,
      addressContactsHint,
    } = usePointDetail(props, ctx, addressActions)
    return {
      state,
      departureDateErrors,
      isShowDocDates,
      readonlyDocDates,
      pointTypes,
      setField,
      addressItems,
      createAddressHandler,
      editAddressHandler,
      addressContactsHint,
    }
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
  margin: 7px;
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
