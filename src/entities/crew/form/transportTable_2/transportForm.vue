<template>
  <v-card>
    <v-card-title>Транспорт</v-card-title>
    <v-card-text>
      <div class="form-wrapper">
        <DateTimeInput
          label="Дата начала"
          v-model="state.startDate"
          type="datetime-local"
          dense
          :disabled="readonlyStartDate"
          :errorMessages="startDateErrors"
          outlined
        />

        <DateTimeInput
          label="Дата завершения"
          v-model="state.endDate"
          type="datetime-local"
          dense
          outlined
          :errorMessages="endDateErrors"
        />
        <v-autocomplete
          label="Грузовик"
          v-model="state.truck"
          :items="trucks"
          auto-select-first
          item-value="_id"
          item-text="regNum"
          dense
          outlined
          clearable
          @change="changeTruckHandler($event, 'truck')"
        />
        <CrewMessage
          v-if="!!existedTruckCrew"
          :text="
            existedTruckCrew.endDate
              ? 'Пересечение с существующей сменой от'
              : 'Грузовик задействован в другом экипаже от'
          "
          :visibleDate="existedTruckCrew.startDate"
          :date="state.startDate"
          :crew="existedTruckCrew"
          type="transport"
          class="pb-3"
        />
        <v-autocomplete
          label="Прицеп"
          v-model="state.trailer"
          :items="trailers"
          auto-select-first
          item-value="_id"
          item-text="regNum"
          dense
          outlined
          clearable
          :disabled="trailerInputDisabled"
          @change="changeTruckHandler($event, 'trailer')"
        />
        <v-text-field label="Примечание" v-model="state.note" dense outlined />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelHandler">Отмена</v-btn>
      <v-btn
        @click="saveHandler"
        color="primary"
        :disabled="disabledSubmitBtn"
        :loading="loading"
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
    } = useTransportFormValidation(state, props)

    const cancelHandler = () => {
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
    }
  },
}
</script>
