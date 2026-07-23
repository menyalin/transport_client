<template>
  <v-card>
    <v-card-title>
      {{ state._id ? 'Редактировать оповещение' : 'Новое оповещение' }}
    </v-card-title>
    <v-card-text>
      <div class="form_wrapper">
        <v-text-field
          v-model="v$.title.$model"
          label="Название оповещения"
          :errorMessages="titleFieldErrors"
        />

        <v-autocomplete
          multiple
          v-model="v$.addresses.$model"
          label="Адреса"
          chips
          :errorMessages="addressFieldErrors"
          closable-chips
          :items="addressItems"
          item-title="text"
          item-value="value"
          clearable
          auto-select-first
        />
        <v-autocomplete
          :items="agreements"
          v-model="v$.agreement.$model"
          label="Соглашение"
          item-title="text"
          item-value="value"
          closable-chips
          clearable
          auto-select-first
        />

        <v-text-field
          v-model="v$.emails.$model"
          label="Получатели оповещений"
          hint="email адреса через ','"
          :errorMessages="emailFieldErrors"
        />
        <v-text-field
          v-model="v$.ccEmails.$model"
          label="Получатели копии оповещений"
          hint="email адреса через ','"
          :errorMessages="ccEmailFieldErrors"
        />
        <v-text-field
          v-model="v$.bccEmails.$model"
          label="Скрытые получатели оповещений"
          hint="email адреса через ','"
          :errorMessages="bccEmailFieldErrors"
        />
        <div class="row_section">
          <div class="column left_column">
            <v-text-field
              type="number"
              v-model="state.idleHoursBeforeNotify"
              label="Часов до отправки уведомления"
            />
          </div>
          <div class="column">
            <v-checkbox
              v-model="state.usePlannedDate"
              hint="По умолчанию используется фактическое время прибытия"
              persistent-hint
              color="primary"
              label="Использовать плановую дату погрузки/разгрузки"
            />
          </div>
        </div>

        <v-text-field v-model="state.note" label="Примечание" />
      </div>
    </v-card-text>
    <v-card-actions class="buttons-wrapper">
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn @click="submit" :disabled="invalidForm || loading" color="primary"> Сохранить </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useFormState } from './model/useFormState.js'

defineOptions({ name: 'IdleTruckNotifyForm' })

const props = defineProps({
  partnerId: String,
  loading: Boolean,
  initialState: Object,
  agreements: Array,
})

const emit = defineEmits(['submit', 'cancel'])

const {
  state,
  submit,
  cancel,
  addressItems,
  invalidForm,
  v$,
  titleFieldErrors,
  addressFieldErrors,
  emailFieldErrors,
  ccEmailFieldErrors,
  bccEmailFieldErrors,
} = useFormState(props, { emit })
</script>
<style scoped>
.form_wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.row_section {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.left_column {
  min-width: 500px;
}
.buttons-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 15px;
}
</style>
