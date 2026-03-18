<template>
  <v-card>
    <v-card-title>
      {{ item ? 'Редактирование' : 'Создание' }} транспортной накладной
    </v-card-title>
    <v-card-text class="form-wrapper">
      <v-text-field
        label="Номер накладной"
        v-model="form.number"
        dense
        outlined
        required
        @blur="v$.number.$touch"
        :error-messages="getErrorMessage(v$.number)"
      />
      <DateTimeInput
        label="Дата накладной"
        v-model="form.date"
        dense
        outlined
        required
        @blur="v$.date.$touch"
        :error-messages="getErrorMessage(v$.date)"
      />
      <v-textarea
        label="Примечание"
        auto-grow
        rows="3"
        v-model="form.note"
        outlined
        dense
        @blur="v$.note.$touch"
        :error-messages="getErrorMessage(v$.note)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn color="primary" :disabled="v$.$invalid" @click="submit">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'TransportWaybillForm',
  components: {
    DateTimeInput,
  },
  props: {
    item: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const initialState = {
      orderId: null,
      number: '',
      date: null,
      note: '',
    }
    const form = ref(props.item || initialState)

    const rules = {
      number: { required },
      date: { required },
      note: {},
    }

    const v$ = useVuelidate(rules, form)

    watch(
      () => props.item,
      (newItem) => {
        if (newItem) {
          form.value = {
            ...initialState,
          }
        }
      },
      { deep: true }
    )

    const getErrorMessage = (field) => {
      if (!field.$dirty) return []
      const errors = []
      if (!field.required) errors.push('Обязательное поле')
      return errors
    }

    const cancel = () => emit('cancel')
    const submit = () => emit('submit', form.value)

    return {
      form,
      v$,
      getErrorMessage,
      cancel,
      submit,
    }
  },
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
