<template>
  <tr class="point-row">
    <td class="col-main">
      <div class="main-column">
        <div class="settings_row">
          <v-select
            :model-value="state.type"
            :items="pointTypes"
            :readonly="readonly"
            hide-details
            itemTitle="text"
            :style="{ 'max-width': '150px' }"
            @update:model-value="setField($event, 'type')"
          />
          <v-checkbox
            v-if="showMainLoadingPointSelector && state.type === 'loading'"
            v-model="state.isMainLoadingPoint"
            label="Основной пункт погрузки"
            hide-details
            class="ml-4"
            @update:model-value="setField($event, 'isMainLoadingPoint')"
          />
          <v-checkbox
            v-model="state.useInterval"
            label="Временнное окно"
            hide-details
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
            color="red"
            class="ml-4"
            @update:model-value="setField($event, 'isReturn')"
          />
          <v-checkbox
            v-if="state.isReturn || state.isPltReturn"
            v-model="state.isPltReturn"
            label="Возврат паллет"
            hide-details
            color="primary"
            class="ml-4"
            @update:model-value="setField($event, 'isPltReturn')"
          />
          <v-checkbox
            v-if="state.isAutofilled"
            v-model="state.isAutofilled"
            label="Автозаполнение"
            hide-details
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
            color="primary"
            class="mx-4"
            @update:model-value="setField($event, 'waitsForWaybills')"
          />
        </div>
        <v-autocomplete
          auto-select-first
          :model-value="state.address"
          :items="addressItems"
          :pointType="!state.isReturn ? state.type : null"
          :disabled="!state.type"
          label="Адрес"
          :readonly="readonly"
          :style="{ 'min-width': '550px' }"
          :hint="addressContactsHint"
          :persistentHint="!!addressContactsHint"
          :hideDetails="!addressContactsHint"
          @update:model-value="setField($event, 'address')"
        />
        <v-text-field
          v-if="state.type === 'unloading'"
          :model-value="state.waybills"
          label="Накладные"
          hide-details
          :readonly="readonly"
          :style="{ 'min-width': '550px' }"
          @update:model-value="setField($event, 'waybills')"
        />
        <v-text-field
          :model-value="state.note"
          label="Примечание"
          :readonly="readonly"
          hide-details
          :style="{ 'min-width': '550px' }"
          @update:model-value="setField($event, 'note')"
        />
      </div>
    </td>
    <td class="col-dates">
      <div class="dates-column">
        <template v-if="!isTemplate">
          <BorderedBlock
            title="Временное окно"
            v-if="state.useInterval"
            :style="{ display: 'flex', gap: '7px', 'flex-direction': 'column' }"
          >
            <DateTimeInput
              label="Начало периода"
              :model-value="state.plannedDate"
              type="datetime-local"
              hide-details
              :readonly="readonly"
              @update:model-value="setField($event, 'plannedDate')"
            />
            <DateTimeInput
              :model-value="state.intervalEndDate"
              type="datetime-local"
              label="Конец периода"
              hide-details
              :readonly="readonly"
              @update:model-value="setField($event, 'intervalEndDate')"
            />
          </BorderedBlock>
          <DateTimeInput
            v-else
            :model-value="state.plannedDate"
            type="datetime-local"
            label="Плановая дата"
            hide-details
            :readonly="readonly"
            @update:model-value="setField($event, 'plannedDate')"
          />
          <DateTimeInput
            :model-value="state.arrivalDate"
            type="datetime-local"
            label="Факт прибытия"
            showPrependIcon
            hide-details
            :disabled="!confirmed || !!state?.arrivalDateDisabled"
            @update:model-value="setField($event, 'arrivalDate')"
          />
          <DateTimeInput
            :model-value="state.departureDate"
            type="datetime-local"
            label="Факт убытия"
            showPrependIcon
            hide-details
            :disabled="!confirmed || !!state?.departureDateDisabled"
            :minDate="state.arrivalDate"
            :errorMessages="departureDateErrors"
            @update:model-value="setField($event, 'departureDate')"
          />
        </template>
        <template v-if="isTemplate && fixedTimeSlots">
          <div class="time-row">
            <v-text-field
              :model-value="state.fixedTime"
              label="Время"
              type="time"
              hide-details
              :style="{ 'max-width': '100px' }"
              @update:model-value="setField($event, 'fixedTime')"
            />
            <v-text-field
              v-if="state.useInterval"
              :model-value="state.hoursInterval"
              label="Окно, часов"
              type="number"
              min="0"
              hide-details
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
            min="0"
            @update:model-value="setField($event, 'offsetDays')"
          />
        </template>
      </div>
    </td>
    <td v-if="!isTemplate && isShowDocDates" class="col-dates">
      <div class="dates-column">
        <BorderedBlock
          title="Временное окно (Док)"
          v-if="state.useInterval"
          :style="{ display: 'flex', gap: '7px', 'flex-direction': 'column' }"
        >
          <DateTimeInput
            label="Начало периода"
            :model-value="state.plannedDateDoc"
            type="datetime-local"
            hide-details
            :readonly="readonly"
            @update:model-value="setField($event, 'plannedDateDoc')"
          />
          <DateTimeInput
            :model-value="state.intervalEndDateDoc"
            type="datetime-local"
            label="Конец периода"
            hide-details
            :readonly="readonly"
            @update:model-value="setField($event, 'intervalEndDateDoc')"
          />
        </BorderedBlock>
        <DateTimeInput
          v-else
          :model-value="state.plannedDateDoc"
          type="datetime-local"
          label="Плановая дата (док)"
          hide-details
          :readonly="readonly"
          @update:model-value="setField($event, 'plannedDateDoc')"
        />
        <DateTimeInput
          :model-value="state.arrivalDateDoc"
          type="datetime-local"
          label="Факт прибытия (док)"
          :readonly="readonlyDocDates"
          hide-details
          @update:model-value="setField($event, 'arrivalDateDoc')"
        />
        <DateTimeInput
          :model-value="state.departureDateDoc"
          type="datetime-local"
          label="Факт убытия (док)"
          :readonly="readonlyDocDates"
          hide-details
          @update:model-value="setField($event, 'departureDateDoc')"
        />
      </div>
    </td>
    <td v-if="showDeleteBtn && !readonly" class="col-remove">
      <div class="remove-btn-column">
        <v-btn icon color="error" @click="$emit('delete', ind)" variant="text">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>
<script setup>
import { BorderedBlock, DateTimeInput } from '@/shared/ui'
import { usePointDetail } from './usePointDetail'

defineOptions({ name: 'PointDetail' })

const pointModel = defineModel({ type: Object })

const props = defineProps({
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
})

const emit = defineEmits(['delete', 'changePoint'])

const {
  state,
  departureDateErrors,
  isShowDocDates,
  readonlyDocDates,
  pointTypes,
  setField,
  addressItems,
  addressContactsHint,
} = usePointDetail({
  modelRef: pointModel,
  emit,
  ind: props.ind,
})
</script>
<style scoped>
.settings_row {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.point-row > td {
  vertical-align: middle;
  padding: 10px 4px;
  border-bottom: 2px solid #b8b8b8;
}
.col-main {
  width: 100%;
}
.col-dates {
  width: 275px;
}
.col-remove {
  width: 50px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dates-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.remove-btn-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.time-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
}
</style>
