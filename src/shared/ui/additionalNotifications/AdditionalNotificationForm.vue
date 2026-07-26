<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-card-title class="bg-primary text-white">
        <span class="text-headline-medium">
          {{ isEdit ? 'Редактировать напоминание' : 'Новое напоминание' }}
        </span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form>
          <!-- Заголовок -->
          <v-text-field
            v-model="state.title"
            label="Заголовок"
            :error-messages="titleErrors"
            @blur="v$.title.$touch()"
          />

          <!-- Дата истечения и дни до напоминания -->
          <div class="dates-row">
            <DateTimeInput
              v-model="state.expDate"
              label="Действительно до"
              :error-messages="expDateErrors"
              @blur="v$.expDate.$touch()"
              class="flex-grow-1 mr-2"
            />

            <v-text-field
              v-model="state.daysBeforeRemind"
              label="Дней до напоминания"
              type="number"
              :error-messages="daysBeforeRemindErrors"
              @blur="v$.daysBeforeRemind.$touch()"
            />
          </div>

          <!-- Примечание -->
          <v-textarea v-model="state.note" label="Примечание" rows="3" auto-grow />
        </v-form>
      </v-card-text>

      <!-- Кнопки действий -->
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="handleCancel" :disabled="loading"> Отмена </v-btn>

        <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="isInvalidForm">
          {{ isEdit ? 'Сохранить изменения' : 'Добавить' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, between } from '@vuelidate/validators'
import { DateTimeInput } from '@/shared/ui'

const dialog = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['save'])

const props = defineProps({
  item: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const initialData = {
  title: null,
  expDate: null,
  daysBeforeRemind: null,
  note: null,
}

const state = ref(initialData)

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

const v$ = useVuelidate(rules, state)

watch(dialog, (isOpen) => {
  if (isOpen) {
    state.value = { ...initialData, ...props.item }
    v$.value.$reset()
  }
})

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

const isInvalidForm = computed(() => {
  return v$.value.$invalid || props.loading
})

const handleCancel = () => {
  state.value = { ...initialData }
  dialog.value = false
}

const handleSubmit = async () => {
  try {
    v$.value.$touch()
    if (isInvalidForm.value) {
      return
    }
    emit('save', { ...state.value })
  } catch (error) {
    console.error('Ошибка при сохранении формы:', error)
  }
}

const isValidDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
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
