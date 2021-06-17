<template>
  <v-card>
    <form>
      <app-buttons-panel
        panelType="form"
        @cancel="cancel"
        @submit="submit"
        :disabledSubmit="$v.form.$invalid"
      />
      <v-card-text>
        <v-text-field
          type="text"
          label="Сокращенное название"
          v-model.trim="$v.form.name.$model"
          :error-messages="nameErrors"
          @input="$v.form.name.$touch()"
          @blur="$v.form.name.$touch()"
        />
        <v-text-field
          type="text"
          label="Полное название"
          v-model.trim="$v.form.fullName.$model"
          :error-messages="fullNameErrors"
          @input="$v.form.fullName.$touch()"
          @blur="$v.form.fullName.$touch()"
        />
        <v-text-field
          type="text"
          label="ИНН"
          v-model.trim="$v.form.inn.$model"
          :error-messages="innErrors"
          @input="$v.form.inn.$touch()"
          @blur="$v.form.inn.$touch()"
        />
      </v-card-text>
    </form>
  </v-card>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

export default {
  name: 'companyForm',
  data() {
    return {
      form: {
        name: '',
        fullName: '',
        inn: '',
      },
    }
  },
  components: {
    AppButtonsPanel,
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.$emit('submit', Object.assign({}, this.$v.form.$model))
    },
  },
  validations: {
    form: {
      name: { required },
      fullName: { required },
      inn: { required },
    },
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required &&
        errors.push('Название не может быть пустым')
      return errors
    },
    fullNameErrors() {
      const errors = []
      if (!this.$v.form.fullName.$dirty) return errors
      !this.$v.form.fullName.required &&
        errors.push('Полное название не может быть пустым')
      return errors
    },
    innErrors() {
      const errors = []
      if (!this.$v.form.inn.$dirty) return errors
      !this.$v.form.inn.required && errors.push('ИНН не может быть пустым')
      return errors
    },
  },
}
</script>
<style></style>
