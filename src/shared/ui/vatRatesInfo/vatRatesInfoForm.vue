<template>
  <v-card>
    <v-card-title class="primary white--text">
      <span class="text-h5">{{ title }}</span>
    </v-card-title>

    <v-card-text class="pa-6">
      <!-- Дата начала периода -->
      <DateTimeInput
        v-model="state.startPeriod"
        label="Дата начала периода"
        hide-prepend-icon
        outlined
        dense
        hide-time-input
        :error-messages="startPeriodErrors"
      />

      <!-- Дата окончания периода -->
      <DateTimeInput
        v-model="state.endPeriod"
        label="Дата окончания периода"
        hide-prepend-icon
        outlined
        dense
        hide-time-input
        :error-messages="endPeriodErrors"
        class="mt-4"
        persistent-hint
      />

      <!-- Ставка НДС -->
      <VatRateSelect
        v-model="state.vatRate"
        label="Ставка НДС"
        outlined
        dense
        :error-messages="vatRateErrors"
        class="mt-4"
      />

      <!-- Примечание -->
      <v-textarea
        v-model="state.note"
        label="Примечание"
        outlined
        dense
        rows="3"
        auto-grow
        class="mt-4"
        hide-details
      />
    </v-card-text>

    <!-- Кнопки действий -->
    <v-card-actions class="pa-4 pt-0">
      <v-btn
        v-if="showRemoveBtn"
        color="error"
        @click="handleRemove"
        class="mr-2"
      >
        Удалить
      </v-btn>
      <v-spacer />
      <v-btn text @click="handleCancel"> Отмена </v-btn>

      <v-btn color="primary" @click="handleSave" :disabled="invalidForm">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { DateTimeInput, VatRateSelect } from '@/shared/ui'

export default {
  name: 'VatRatesInfoForm',

  components: {
    DateTimeInput,
    VatRateSelect,
  },

  props: {
    title: {
      type: String,
      default: 'Новая ставка НДС',
    },
    item: {
      type: Object,
      default: null,
    },
    editingItemIndex: {
      type: Number,
      default: null,
    },
    showRemoveBtn: {
      type: Boolean,
      default: false,
    },
    existingItems: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['save', 'remove', 'cancel'],

  setup(props, { emit }) {
    const initialState = {
      startPeriod: null,
      endPeriod: null,
      vatRate: null,
      note: null,
    }

    const state = ref({ ...initialState })

    const rules = computed(() => ({
      startPeriod: { required },
      endPeriod: {},
      vatRate: { required },
      note: {},
    }))

    const v$ = useVuelidate(rules, state, { $scope: false })

    const invalidForm = computed(() => v$.value.$invalid)

    // Ошибки валидации
    const startPeriodErrors = computed(() => {
      const errors = []

      if (!v$.value.startPeriod.required.$invalid) return errors
      if (v$.value.startPeriod.required.$invalid) {
        errors.push('Укажите дату начала периода')
      }

      // Проверка: дата начала должна быть меньше даты окончания
      if (state.value.endPeriod && state.value.startPeriod) {
        const startDate = new Date(state.value.startPeriod)
        const endDate = new Date(state.value.endPeriod)

        if (startDate >= endDate) {
          errors.push('Дата начала должна быть меньше даты окончания')
        }
      }

      return errors
    })

    const endPeriodErrors = computed(() => {
      const errors = []

      // Проверка: дата окончания должна быть больше даты начала
      if (state.value.endPeriod && state.value.startPeriod) {
        const startDate = new Date(state.value.startPeriod)
        const endDate = new Date(state.value.endPeriod)

        if (endDate <= startDate) {
          errors.push('Дата окончания должна быть больше даты начала')
        }
      }

      // Проверка пересечения периодов
      const overlapError = checkPeriodOverlap()
      if (overlapError) {
        errors.push(overlapError)
      }

      return errors
    })

    const vatRateErrors = computed(() => {
      const errors = []

      if (v$.value.vatRate.required.$invalid) {
        errors.push('Укажите ставку НДС')
      }

      return errors
    })

    // Проверка пересечения периодов
    const checkPeriodOverlap = () => {
      if (!state.value.startPeriod) return null

      const newStart = new Date(state.value.startPeriod)
      const newEnd = state.value.endPeriod
        ? new Date(state.value.endPeriod)
        : null

      for (let i = 0; i < props.existingItems.length; i++) {
        const item = props.existingItems[i]

        // Пропускаем текущий редактируемый элемент по индексу
        if (props.editingItemIndex !== null && i === props.editingItemIndex) {
          continue
        }

        const existingStart = new Date(item.startPeriod)
        const existingEnd = item.endPeriod ? new Date(item.endPeriod) : null

        // Проверка пересечения
        const overlaps = periodsOverlap(
          newStart,
          newEnd,
          existingStart,
          existingEnd
        )

        if (overlaps) {
          return 'Этот период пересекается с существующим'
        }
      }

      return null
    }

    const periodsOverlap = (start1, end1, start2, end2) => {
      // end1 или end2 равны null означают "бесконечный" период
      const effectiveEnd1 = end1 ? end1.getTime() : Infinity
      const effectiveEnd2 = end2 ? end2.getTime() : Infinity

      // Используем <= для строгого разделения: периоды не должны соприкасаться
      return (
        start1.getTime() <= effectiveEnd2 && start2.getTime() <= effectiveEnd1
      )
    }

    // Обработчики событий
    const handleCancel = () => {
      emit('cancel')
    }

    const handleRemove = () => {
      emit('remove')
    }

    const handleSave = () => {
      v$.value.$touch()

      if (invalidForm.value) {
        return
      }

      // Проверяем пересечение периодов
      const overlapError = checkPeriodOverlap()
      if (overlapError) {
        return
      }

      emit('save', { ...state.value })
    }

    const resetState = () => {
      state.value = { ...initialState }
      v$.value.$reset()
    }

    // Инициализация формы при изменении item
    watch(
      () => props.item,
      (newItem) => {
        if (newItem) {
          state.value = { ...newItem }
        } else {
          resetState()
        }
      },
      { deep: true, immediate: true }
    )

    return {
      state,
      startPeriodErrors,
      endPeriodErrors,
      vatRateErrors,
      invalidForm,
      handleCancel,
      handleRemove,
      handleSave,
    }
  },
}
</script>

<style scoped>
.v-card__title {
  word-break: break-word;
}
</style>
