<template>
  <div class="pa-2 point-wrapper">
    <div class="main-column-wrapper">
      <div class="settings_row">
        <v-select
          :model-value="state.type"
          :items="pointTypes"
          density="compact"
          :readonly="readonly"
          hide-details
          variant="outlined"
          :style="{ 'max-width': '150px' }"
          @update:model-value="setField($event, 'type')"
        />
        <v-checkbox
          v-if="showMainLoadingPointSelector && state.type === 'loading'"
          v-model="state.isMainLoadingPoint"
          label="Основной пункт погрузки"
          hide-details
          density="compact"
          color="primary"
          class="ml-4"
          @update:model-value="setField($event, 'isMainLoadingPoint')"
        />
        <v-checkbox
          v-model="state.useInterval"
          label="Временнное окно"
          hide-details
          density="compact"
          color="primary"
          class="ml-4"
          @update:model-value="setField($event, 'useInterval')"
        />
        <v-checkbox
          v-if="state.isReturn || (showReturnBtn && state.type === 'unloading')"
          v-model="state.isReturn"
          label="Возврат"
          :readonly="!showReturnBtn || state.isPltReturn"
          hide-details
          density="compact"
          color="red"
          class="ml-4"
          @update:model-value="setField($event, 'isReturn')"
        />
        <v-checkbox
          v-if="state.isReturn || state.isPltReturn"
          v-model="state.isPltReturn"
          label="Возврат паллет"
          hide-details
          density="compact"
          color="primary"
          class="ml-4"
          @update:model-value="setField($event, 'isPltReturn')"
        />
        <v-checkbox
          v-if="state.isAutofilled"
          v-model="state.isAutofilled"
          label="Автозаполнение"
          hide-details
          density="compact"
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
          density="compact"
          color="primary"
          class="mx-4"
          @update:model-value="setField($event, 'waitsForWaybills')"
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
        variant="outlined"
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
        :model-value="state.waybills"
        label="Накладные"
        hide-details
        :readonly="readonly"
        variant="outlined"
        :style="{ 'min-width': '550px' }"
        density="compact"
        @update:model-value="setField($event, 'waybills')"
      />
      <v-text-field
        :model-value="state.note"
        label="Примечание"
        hide-details
        :readonly="readonly"
        variant="outlined"
        :style="{ 'min-width': '550px' }"
        density="compact"
        @update:model-value="setField($event, 'note')"
      />
    </div>
    <div v-if="!isTemplate" class="dates-column">
      <BorderedBlock v-if="state.useInterval" title="Временное окно">
        <DateTimeInput
          :value="state.plannedDate"
          type="datetime-local"
          label="Начало периода"
          density="compact"
          variant="outlined"
          class="mt-1"
          hide-details
          :readonly="readonly"
          @update:model-value="setField($event, 'plannedDate')"
        />
        <DateTimeInput
          :value="state.intervalEndDate"
          type="datetime-local"
          label="Конец периода"
          density="compact"
          variant="outlined"
          hide-details
          :readonly="readonly"
          class="mt-2"
          @update:model-value="setField($event, 'intervalEndDate')"
        />
      </BorderedBlock>
      <DateTimeInput
        v-else
        :value="state.plannedDate"
        type="datetime-local"
        label="Плановая дата"
        density="compact"
        variant="outlined"
        class="mt-1"
        hide-details
        :readonly="readonly"
        @update:model-value="setField($event, 'plannedDate')"
      />
      <DateTimeInput
        :value="state.arrivalDate"
        type="datetime-local"
        label="Факт прибытия"
        showPrependIcon
        hide-details
        density="compact"
        variant="outlined"
        :disabled="!confirmed || point.arrivalDateDisabled"
        @update:model-value="setField($event, 'arrivalDate')"
      />
      <DateTimeInput
        :value="state.departureDate"
        type="datetime-local"
        label="Факт убытия"
        density="compact"
        variant="outlined"
        showPrependIcon
        hide-details
        :disabled="!confirmed || point.departureDateDisabled"
        :minDate="state.arrivalDate"
        :errorMessages="departureDateErrors"
        @update:model-value="setField($event, 'departureDate')"
      />
    </div>
    <div v-if="!isTemplate && isShowDocDates" class="dates-column">
      <BorderedBlock v-if="state.useInterval" title="Временное окно (Док)">
        <DateTimeInput
          :value="state.plannedDateDoc"
          type="datetime-local"
          label="Начало периода"
          density="compact"
          variant="outlined"
          class="mt-1"
          hide-details
          :readonly="readonly"
          @update:model-value="setField($event, 'plannedDateDoc')"
        />
        <DateTimeInput
          :value="state.intervalEndDateDoc"
          type="datetime-local"
          label="Конец периода"
          density="compact"
          variant="outlined"
          hide-details
          :readonly="readonly"
          class="mt-2"
          @update:model-value="setField($event, 'intervalEndDateDoc')"
        />
      </BorderedBlock>
      <DateTimeInput
        v-else
        :value="state.plannedDateDoc"
        type="datetime-local"
        label="Плановая дата (док)"
        density="compact"
        variant="outlined"
        class="mt-1"
        hide-details
        :readonly="readonly"
        @update:model-value="setField($event, 'plannedDateDoc')"
      />
      <DateTimeInput
        :value="state.arrivalDateDoc"
        type="datetime-local"
        label="Факт прибытия (док)"
        :readonly="readonlyDocDates"
        hide-details
        density="compact"
        variant="outlined"
        @update:model-value="setField($event, 'arrivalDateDoc')"
      />
      <DateTimeInput
        :value="state.departureDateDoc"
        type="datetime-local"
        label="Факт убытия (док)"
        :readonly="readonlyDocDates"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="setField($event, 'departureDateDoc')"
      />
    </div>
    <div v-if="isTemplate && fixedTimeSlots" id="fixedTimeBlock">
      <div class="time-row">
        <v-text-field
          :model-value="state.fixedTime"
          label="Время"
          tag="div"
          type="time"
          density="compact"
          hide-details
          variant="outlined"
          :style="{ 'max-width': '100px' }"
          @update:model-value="setField($event, 'fixedTime')"
        />
        <v-text-field
          v-if="state.useInterval"
          :model-value="state.hoursInterval"
          label="Окно, часов"
          type="number"
          density="compact"
          min="0"
          hide-details
          variant="outlined"
          :style="{ 'max-width': '130px' }"
          @update:model-value="setField($event, 'hoursInterval')"
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
        variant="outlined"
        density="compact"
        min="0"
        @update:model-value="setField($event, 'offsetDays')"
      />
    </div>
    <div v-if="showDeleteBtn && !readonly" class="remove-btn-wrapper">
      <v-btn icon color="error" @click="$emit('delete', ind)">
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
