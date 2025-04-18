<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="disabledSubmitForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <div class="row-input">
      <v-autocomplete
        v-model="state.tkName"
        :items="carrierItems"
        item-text="name"
        auto-select-first
        item-value="_id"
        label="ТК"
        dense
        outlined
        :disabled="!!crewId"
        :style="{ maxWidth: '300px' }"
      />
      <v-checkbox
        v-model="state.onlyCarrierItems"
        label="Только водители ТК"
        :disabled="!!crewId || !!state.driver"
        dense
        outlined
        @change="changeOnlyCarrierItemsHandler"
      />
    </div>

    <v-autocomplete
      v-model="state.driver"
      outlined
      clearable
      auto-select-first
      label="Водитель"
      class="mb-2"
      :items="driverItems"
      item-value="_id"
      item-text="fullName"
      :disabled="!state.tkName || !!crewId"
      :style="{ maxWidth: '600px' }"
    />

    <div class="row-input">
      <DateTimeInput
        v-model="state.startDate"
        label="Дата начала"
        :errorMessages="startDateError"
        :disabled="!state.driver || !!crewId"
        dense
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
        @change="changeStartDateHandler"
      />
      <DateTimeInput
        v-model="state.endDate"
        :disabled="disabledEndDateField"
        label="Дата завершения"
        :errorMessages="endDateError"
        @blur="v$.endDate.$touch"
        dense
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
      />
      <v-btn
        v-if="isReturnToWorkAllowed"
        @click="returnToWorkHandler"
        class="mx-2"
        color="primary"
        text
      >
        Вернуть экипаж в работу
      </v-btn>
    </div>

    <app-crew-message
      v-if="!!actualDriverCrew"
      :date="state.startDate"
      :crew="actualDriverCrew"
      type="crew"
      @clearCrew="clearActualCrewHandler"
    />

    <!-- <app-transport-table
      v-if="showTransportTable"
      :items="state.transport"
      :truckItems="truckItems"
      :trailerItems="trailerItems"
      :date="state.startDate"
      :driver="state.driver"
      :crewId="crewId"
      :crewEditable="crewEditable"
      :isClosedCrew="!!state.endDate"
      :tkName="state.tkName"
      @addItem="addTransportItemHandler"
      @itemsPop="deleteLastItemInTransportHandler"
    /> -->

    <TransportTable2
      v-if="showTransportTable"
      :items.sync="state.transport"
      :crewId="crewId"
      :crewEditable="crewEditable || isNewCrew"
      :trucks="truckItems"
      :trailers="trailerItems"
      :crewStartDate="state.startDate"
    />

    <v-text-field
      v-model="state.note"
      label="Примечание"
      outlined
      dense
      class="mt-6"
    />
    <div v-if="crew && crew.manager" class="pb-4 text-caption">
      Отв.пользователь: {{ crew.manager.name }},
      {{ crew.manager.email }}
      <br />
      Создан: {{ new Date(crew.createdAt).toLocaleString() }}
      <span v-if="crew.updatedAt">
        Обновлен: {{ new Date(crew.updatedAt).toLocaleString() }}
      </span>
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { useCrewForm } from './useForm'
import { ButtonsPanel, DateTimeInput } from '@/shared/ui'

import TransportTable2 from './transportTable_2'
import AppCrewMessage from './crewMessage'

export default {
  name: 'CrewForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AppCrewMessage,
    TransportTable2,
  },
  props: {
    crew: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const {
      v$,
      state,
      crewId,
      crewEditable,
      actualDriverCrew,
      changeDriverHandler,
      changeStartDateHandler,
      carrierItems,
      driverItems,
      truckItems,
      trailerItems,
      disabledSubmitForm,
      disabledEndDateField,
      startDateError,
      allowUseTrailers,
      minValueForStartDate,
      showTransportTable,
      cancelHandler,
      submitHandler,
      addTransportItemHandler,
      deleteLastItemInTransportHandler,
      clearActualCrewHandler,
      endDateError,
      deleteCrewHandler,
      changeOnlyCarrierItemsHandler,
      returnToWorkHandler,
      isReturnToWorkAllowed,
      hasUnsavedChanges,
    } = useCrewForm(props, ctx)

    const isNewCrew = !crewId
    return {
      v$,
      isNewCrew,
      state,
      crewId,
      crewEditable,
      actualDriverCrew,
      changeDriverHandler,
      changeStartDateHandler,
      carrierItems,
      truckItems,
      trailerItems,
      driverItems,
      disabledSubmitForm,
      disabledEndDateField,
      startDateError,
      allowUseTrailers,
      minValueForStartDate,
      showTransportTable,
      cancelHandler,
      submitHandler,
      addTransportItemHandler,
      changeOnlyCarrierItemsHandler,
      deleteLastItemInTransportHandler,
      clearActualCrewHandler,
      endDateError,
      deleteCrewHandler,
      returnToWorkHandler,
      isReturnToWorkAllowed,
      hasUnsavedChanges,
    }
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 15px;
}
</style>
