<template>
  <v-card>
    <v-card-title>Новый контакт</v-card-title>
    <v-card-text class="form-wrapper">
      <v-text-field v-model="state.name" label="ФИО" />
      <v-text-field v-model="state.position" label="Должность" />
      <v-text-field v-model="state.phone" label="Телефон" />
      <v-text-field v-model="state.email" label="email" />
      <v-textarea v-model="state.note" label="Примечание" autoGrow />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelHandler">Отмена</v-btn>
      <v-btn color="primary" @click="submitHandler">Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { useForm } from './useForm'
export default {
  name: 'ContactForm',
  props: {
    item: Object,
  },
  setup(props, ctx) {
    const { state, invalidForm, cancelHandler, submitHandler } = useForm(props, ctx)
    return {
      state,
      invalidForm,
      cancelHandler,
      submitHandler,
    }
  },
}
</script>
<style scoped></style>
