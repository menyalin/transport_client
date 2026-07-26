<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="disabledSubmitForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <div class="row-input">
      <v-autocomplete
        v-model="state.tkName"
        :items="carrierItems"
        item-title="name"
        item-value="_id"
        label="ТК"
        :disabled="!!crewId"
        :style="{ maxWidth: '300px' }"
      />
      <v-checkbox
        v-model="state.onlyCarrierItems"
        label="Только водители ТК"
        :disabled="!!crewId || !!state.driver"
        @update:model-value="changeOnlyCarrierItemsHandler"
      />
    </div>

    <v-autocomplete
      v-model="state.driver"
      label="Водитель"
      class="mb-2"
      :items="driverItems"
      item-value="_id"
      item-title="fullName"
      :disabled="!state.tkName || !!crewId"
      :style="{ maxWidth: '600px' }"
    />

    <div class="row-input">
      <DateTimeInput
        v-model="state.startDate"
        label="Дата начала"
        :errorMessages="startDateError"
        :disabled="!state.driver || !!crewId"
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
        @update:model-value="changeStartDateHandler"
      />
      <DateTimeInput
        v-model="state.endDate"
        :disabled="disabledEndDateField"
        label="Дата завершения"
        :errorMessages="endDateError"
        @blur="v$.endDate.$touch"
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
      />
      <v-btn v-if="isReturnToWorkAllowed" @click="returnToWorkHandler" class="mx-2">
        Вернуть экипаж в работу
      </v-btn>
    </div>

    <AppCrewMessage
      v-if="!!actualDriverCrew"
      :date="state.startDate"
      :crew="actualDriverCrew"
      type="crew"
      @clearCrew="clearActualCrewHandler"
    />
    <CardSection title="Транспорт" class="ma-3" :style="{ maxWidth: '1200px' }">
      <TransportTable2
        v-if="showTransportTable"
        :items="state.transport"
        @update:items="state.transport = $event"
        :crewId="crewId"
        :crewEditable="crewEditable || isNewCrew"
        :trucks="truckItems"
        :trailers="trailerItems"
        :crewStartDate="state.startDate"
      />
    </CardSection>

    <v-text-field v-model="state.note" label="Примечание" class="mt-6" />
    <div v-if="crew && crew.manager" class="pb-4 text-body-small">
      Отв.пользователь: {{ crew.manager.name }},
      {{ crew.manager.email }}
      <br />
      Создан: {{ new Date(crew.createdAt).toLocaleString() }}
      <span v-if="crew.updatedAt"> Обновлен: {{ new Date(crew.updatedAt).toLocaleString() }} </span>
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useCrewForm } from './useCrewForm.js'
import { ButtonsPanel, DateTimeInput, CardSection } from '@/shared/ui'

import TransportTable2 from '@/entities/crew/form/transportTable_2/index.vue'
import AppCrewMessage from './CrewMessage.vue'

defineOptions({ name: 'CrewForm' })

const props = defineProps({
  crew: {
    type: Object,
  },
  carrierItems: {
    type: Array,
    required: true,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'submit', 'delete'])

const {
  v$,
  state,
  crewId,
  crewEditable,
  actualDriverCrew,
  changeStartDateHandler,

  driverItems,
  truckItems,
  trailerItems,
  disabledSubmitForm,
  disabledEndDateField,
  startDateError,
  showTransportTable,
  cancelHandler,
  submitHandler,
  changeOnlyCarrierItemsHandler,
  clearActualCrewHandler,
  endDateError,
  returnToWorkHandler,
  isReturnToWorkAllowed,
} = useCrewForm(props, emit)

const isNewCrew = computed(() => !crewId)
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 15px;
}
</style>
