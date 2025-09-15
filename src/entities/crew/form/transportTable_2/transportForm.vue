<template>
  <v-card>
    <v-card-title>Транспорт</v-card-title>
    <v-card-text>
      <div class="form-wrapper">
        <DateTimeInput
          v-model="state.startDate"
          label="Дата начала"
          type="datetime-local"
          density="compact"
          :disabled="readonlyStartDate"
          :errorMessages="startDateErrors"
          variant="outlined"
        />

        <DateTimeInput
          v-model="state.endDate"
          label="Дата завершения"
          type="datetime-local"
          density="compact"
          variant="outlined"
          :errorMessages="endDateErrors"
        />
        <v-autocomplete
          v-model="state.truck"
          label="Грузовик"
          :items="trucks"
          auto-select-first
          item-value="_id"
          item-title="regNum"
          density="compact"
          variant="outlined"
          clearable
          @update:model-value="changeTruckHandler($event, 'truck')"
        />
        <CrewMessage
          v-if="!!existedTruckCrew"
          :date="state.startDate"
          :crew="existedTruckCrew"
          type="truck"
          class="pb-2"
          @clear-crew="clearExistedCrews"
        />
        <v-autocomplete
          v-model="state.trailer"
          label="Прицеп"
          :items="trailers"
          auto-select-first
          item-value="_id"
          item-title="regNum"
          density="compact"
          variant="outlined"
          clearable
          :disabled="trailerInputDisabled"
          @update:model-value="changeTruckHandler($event, 'trailer')"
        />
        <CrewMessage
          v-if="!!existedTrailerCrew"
          :date="state.startDate"
          :crew="existedTrailerCrew"
          type="trailer"
          class="pb-2"
          @clear-crew="clearExistedCrews"
        />
        <v-text-field
          v-model="state.note"
          label="Примечание"
          density="compact"
          variant="outlined"
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelHandler">Отмена</v-btn>
      <v-btn
        color="primary"
        :disabled="disabledSubmitBtn"
        :loading="loading"
        @click="saveHandler"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, watch, computed } from 'vue'
import { DateTimeInput } from '@/shared/ui'
import { useTransportFormValidation } from './useTransportFormValidation'
import CrewMessage from '../crewMessage.vue'

export default {
  name: 'CrewTransportForm',
  components: { DateTimeInput, CrewMessage },
  props: {
    item: Object,
    trucks: Array,
    trailers: Array,
    minDateValue: String,
    readonlyStartDate: Boolean,
  },
  setup(props, ctx) {
    const initialState = {
      startDate: null,
      endDate: null,
      truck: null,
      trailer: null,
      note: null,
    }
    const state = ref(props.item ?? initialState)

    const {
      loading,
      changeTruckHandler,
      invalidForm,
      startDateErrors,
      endDateErrors,
      trailerInputDisabled,
      existedTrailerCrew,
      existedTruckCrew,
      clearExistedCrews,
    } = useTransportFormValidation(state, props)

    const cancelHandler = () => {
      clearExistedCrews()
      ctx.emit('cancel')
    }
    const saveHandler = () => {
      ctx.emit('save', state.value)
    }

    const disabledSubmitBtn = computed(() => invalidForm.value)

    watch(
      () => props.item,
      () => {
        state.value = Object.assign({}, props.item)
      },
      { deep: true }
    )
    return {
      loading,
      state,
      cancelHandler,
      saveHandler,
      startDateErrors,
      endDateErrors,
      invalidForm,
      disabledSubmitBtn,
      changeTruckHandler,
      trailerInputDisabled,
      existedTrailerCrew,
      existedTruckCrew,
      clearExistedCrews,
    }
  },
}
</script>
