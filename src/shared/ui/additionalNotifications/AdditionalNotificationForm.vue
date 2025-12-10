<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="text-h5">
          {{ isEdit ? 'Редактировать напоминание' : 'Новое напоминание' }}
        </span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form>
          <!-- Заголовок -->
          <v-text-field
            v-model="state.title"
            label="Заголовок"
            outlined
            dense
            :error-messages="titleErrors"
            @blur="v$.title.$touch()"
          />

          <!-- Дата истечения и дни до напоминания -->
          <div class="dates-row">
            <DateTimeInput
              v-model="state.expDate"
              label="Действительно до"
              hide-prepend-icon
              outlined
              dense
              hide-time-input
              :error-messages="expDateErrors"
              @blur="v$.expDate.$touch()"
              class="flex-grow-1 mr-2"
            />

            <v-text-field
              v-model="state.daysBeforeRemind"
              label="Дней до напоминания"
              type="number"
              outlined
              dense
              :error-messages="daysBeforeRemindErrors"
              @blur="v$.daysBeforeRemind.$touch()"
            />
          </div>

          <!-- Примечание -->
          <v-textarea
            v-model="state.note"
            label="Примечание"
            outlined
            dense
            rows="3"
            auto-grow
          />
        </v-form>
      </v-card-text>

      <!-- Кнопки действий -->
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn text @click="handleCancel" :disabled="loading"> Отмена </v-btn>

        <v-btn
          color="primary"
          @click="handleSubmit"
          :loading="loading"
          :disabled="isInvalidForm"
        >
          {{ isEdit ? 'Сохранить изменения' : 'Добавить' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, between } from '@vuelidate/validators'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'AdditionalNotificationForm',

  components: {
    DateTimeInput,
  },

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['input', 'save'],

  setup(props, { emit }) {
    const initialData = {
      title: null,
      expDate: null,
      daysBeforeRemind: null,
      note: null,
    }

    const state = ref(initialData)

    // Правила валидации
    const rules = computed(() => ({
      title: { required },
      expDate: { required },
      daysBeforeRemind: {
        required,
        numeric,
        between: between(0, 365),
      },
      note: {},
    }))

    // Инициализация Vuelidate
    const v$ = useVuelidate(rules, state)

    // Синхронизация v-model
    const dialog = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    // Следим за открытием диалога для сброса данных и валидации
    watch(dialog, (isOpen) => {
      if (isOpen) {
        // При открытии диалога создаем свежую копию данных
        state.value = { ...initialData, ...props.item }
        // Сбрасываем состояние валидации Vuelidate
        v$.value.$reset()
      }
    })

    // Вычисляемые свойства для валидации
    const titleErrors = computed(() => {
      const errors = []
      if (!v$.value.title.$dirty) return errors
      if (!v$.value.title.required) {
        errors.push('Заголовок не может быть пустым')
      }
      return errors
    })

    const expDateErrors = computed(() => {
      const errors = []
      if (!v$.value.expDate.$dirty) return errors
      if (!v$.value.expDate.required) {
        errors.push('Укажите дату')
      }
      if (v$.value.expDate.$model && !isValidDate(v$.value.expDate.$model)) {
        errors.push('Некорректная дата')
      }
      return errors
    })

    const daysBeforeRemindErrors = computed(() => {
      const errors = []
      if (!v$.value.daysBeforeRemind.$dirty) return errors
      if (!v$.value.daysBeforeRemind.required) {
        errors.push('Не должно быть пустым')
      }
      if (!v$.value.daysBeforeRemind.numeric) {
        errors.push('Введите число')
      }
      if (!v$.value.daysBeforeRemind.between) {
        errors.push('Значение должно быть от 0 до 365 дней')
      }
      return errors
    })

    // Проверка валидности всей формы
    const isInvalidForm = computed(() => {
      return v$.value.$invalid || props.loading
    })

    // Обработчики событий
    const handleCancel = () => {
      // Сбрасываем состояние в исходные значения
      state.value = { ...initialData }
      dialog.value = false
    }

    const handleSubmit = async () => {
      try {
        // Валидация формы
        v$.value.$touch()
        if (isInvalidForm.value) {
          return
        }
        // Эмитируем сохранение с копией данных
        emit('save', { ...state.value })
      } catch (error) {
        console.error('Ошибка при сохранении формы:', error)
      }
    }

    // Вспомогательные функции
    const isValidDate = (dateString) => {
      try {
        const date = new Date(dateString)
        return !isNaN(date.getTime())
      } catch {
        return false
      }
    }

    return {
      dialog,
      state,
      v$,
      titleErrors,
      expDateErrors,
      daysBeforeRemindErrors,
      isInvalidForm,
      handleCancel,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
.dates-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  align-items: start;
}

.days-count {
  max-width: 150px;
}

.v-card__title {
  word-break: break-word;
}

.v-textarea {
  margin-top: 8px;
}

/* Стилизация ошибок */
.v-text-field--error .v-input__slot,
.v-input--error .v-input__slot {
  border-color: #ff5252 !important;
}
</style>
