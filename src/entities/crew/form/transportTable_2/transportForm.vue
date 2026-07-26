<template>
  <v-card>
    <v-card-title>Транспорт</v-card-title>
    <v-card-text class="wrapper">
      <DateTimeInput
        label="Дата начала"
        v-model="state.startDate"
        type="datetime-local"
        :disabled="readonlyStartDate"
        :errorMessages="startDateErrors"
      />

      <DateTimeInput
        label="Дата завершения"
        v-model="state.endDate"
        type="datetime-local"
        :errorMessages="endDateErrors"
      />
      <v-autocomplete
        label="Грузовик"
        v-model="state.truck"
        :items="trucks"
        item-value="_id"
        item-title="regNum"
        hide-details
        @update:model-value="changeTruckHandler($event, 'truck')"
      />
      <CrewMessage
        v-if="!!existedTruckCrew"
        :date="state.startDate"
        :crew="existedTruckCrew"
        type="truck"
        class="pb-2"
        @clearCrew="clearExistedCrews"
      />
      <v-autocomplete
        label="Прицеп"
        v-model="state.trailer"
        :items="trailers"
        item-value="_id"
        item-title="regNum"
        hide-details
        :disabled="trailerInputDisabled"
        @update:model-value="changeTruckHandler($event, 'trailer')"
      />
      <CrewMessage
        v-if="!!existedTrailerCrew"
        :date="state.startDate"
        :crew="existedTrailerCrew"
        type="trailer"
        class="pb-2"
        @clearCrew="clearExistedCrews"
      />
      <v-text-field label="Примечание" v-model="state.note" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelHandler">Отмена</v-btn>
      <v-btn @click="saveHandler" color="primary" :disabled="disabledSubmitBtn" :loading="loading">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { DateTimeInput } from '@/shared/ui'
import { useTransportFormValidation } from './useTransportFormValidation'
import CrewMessage from '@/features/crew/form/CrewMessage.vue'

defineOptions({ name: 'CrewTransportForm' })

const props = defineProps({
  item: Object,
  trucks: Array,
  trailers: Array,
  minDateValue: String,
  readonlyStartDate: Boolean,
})

const emit = defineEmits(['cancel', 'save'])

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
  emit('cancel')
}
const saveHandler = () => {
  emit('save', state.value)
}

const disabledSubmitBtn = computed(() => invalidForm.value)

watch(
  () => props.item,
  () => {
    state.value = Object.assign({}, props.item)
  },
  { deep: true }
)
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
