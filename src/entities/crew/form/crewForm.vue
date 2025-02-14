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
        :disabled="!!crewId || state.driver"
        dense
        outlined
        @change="changeOnlyCarrierItemsHandler"
      />
    </div>

    <v-autocomplete
      v-model="state.driver"
      outlined
      clearable
      label="Водитель"
      class="mb-2"
      :items="driverItems"
      item-value="_id"
      item-text="fullName"
      :disabled="!state.tkName || !!crewId"
      @change="changeDriverHandler"
      :style="{ maxWidth: '600px' }"
    />
    <div class="row-input">
      <DateTimeInput
        v-model="state.startDate"
        label="Дата начала"
        :errorMessages="startDateError"
        :disabled="!state.driver || !!crewId"
        :minDate="minValueForStartDate"
        @blur="v$.startDate.$touch()"
        dense
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
      />
      <DateTimeInput
        v-model="state.endDate"
        :disabled="!state.startDate || (!!state.endDate && !crewEditable)"
        label="Дата завершения"
        :errorMessages="endDateError"
        :minDate="state.startDate"
        @blur="v$.endDate.$touch()"
        dense
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
      />
    </div>

    <app-crew-message
      v-if="!!actualDriverCrew && !actualDriverCrew.endDate"
      text="У водителя есть открытая смена от"
      :visibleDate="actualDriverCrew.startDate"
      :date="state.startDate"
      :crew="actualDriverCrew"
      :invalid="v$.startDate.$invalid"
      type="crew"
      @clearCrew="clearActualCrewHandler"
    />

    <app-transport-table
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
      @editMode="changeEditModeStatusHandler"
      @itemsPop="deleteLastItemInTransportHandler"
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
import AppTransportTable from '../form/transportTable.vue'
import AppCrewMessage from './crewMessage'

export default {
  name: 'CrewForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AppTransportTable,
    AppCrewMessage,
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
      changeEditModeStatusHandler,
      carrierItems,
      driverItems,
      truckItems,
      trailerItems,
      disabledSubmitForm,
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
    } = useCrewForm(props, ctx)
    return {
      v$,
      state,
      crewId,
      crewEditable,
      actualDriverCrew,
      changeDriverHandler,
      changeEditModeStatusHandler,
      carrierItems,
      truckItems,
      trailerItems,
      driverItems,
      disabledSubmitForm,
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
