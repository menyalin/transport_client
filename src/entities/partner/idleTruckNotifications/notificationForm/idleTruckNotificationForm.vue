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
          variant="outlined"
          density="compact"
        />

        <v-autocomplete
          v-model="v$.addresses.$model"
          multiple
          label="Адреса"
          variant="outlined"
          chips
          :errorMessages="addressFieldErrors"
          closable-chips
          :items="addressItems"
          clearable
          auto-select-first
        />
        <v-autocomplete
          v-model="v$.agreement.$model"
          :items="agreements"
          label="Соглашение"
          variant="outlined"
          closable-chips
          clearable
          auto-select-first
        />

        <v-text-field
          v-model="v$.emails.$model"
          label="Получатели оповещений"
          hint="email адреса через ','"
          :errorMessages="emailFieldErrors"
          variant="outlined"
          density="compact"
        />
        <v-text-field
          v-model="v$.ccEmails.$model"
          label="Получатели копии оповещений"
          hint="email адреса через ','"
          :errorMessages="ccEmailFieldErrors"
          variant="outlined"
          density="compact"
        />
        <v-text-field
          v-model="v$.bccEmails.$model"
          label="Скрытые получатели оповещений"
          hint="email адреса через ','"
          :errorMessages="bccEmailFieldErrors"
          variant="outlined"
          density="compact"
        />
        <div class="row_section">
          <div class="column left_column">
            <v-text-field
              v-model="state.idleHoursBeforeNotify"
              type="number"
              label="Часов до отправки уведомления"
              variant="outlined"
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

        <v-text-field
          v-model="state.note"
          label="Примечание"
          variant="outlined"
          density="compact"
        />
      </div>
    </v-card-text>
    <v-card-actions class="buttons-wrapper">
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn :disabled="invalidForm || loading" color="primary" @click="submit">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { useFormState } from './model/useFormState.js'
export default {
  name: 'IdleTruckNotifyForm',
  props: {
    partnerId: String,
    loading: Boolean,
    initialState: Object,
    agreements: Array,
  },
  setup(props, ctx) {
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
    } = useFormState(props, ctx)
    return {
      v$,
      state,
      submit,
      cancel,
      addressItems,
      invalidForm,
      titleFieldErrors,
      addressFieldErrors,
      emailFieldErrors,
      ccEmailFieldErrors,
      bccEmailFieldErrors,
    }
  },
}
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
