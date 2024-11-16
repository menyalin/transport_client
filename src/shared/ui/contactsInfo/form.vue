<template>
  <v-card>
    <v-card-title>Новый контакт</v-card-title>
    <v-card-text class="form-wrapper">
      <v-text-field label="ФИО" v-model="state.name" />
      <v-text-field label="Должность" v-model="state.position" />
      <v-text-field label="Телефон" v-model="state.phone" />
      <v-text-field label="email" v-model="state.email" />
      <v-textarea label="Примечание" auto-grow v-model="state.note" />
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
    const { state, invalidForm, cancelHandler, submitHandler } = useForm(
      props,
      ctx
    )
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
