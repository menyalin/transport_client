<template>
  <div>
    <app-buttons-panel
      panelType="form"
      @cancel="cancel"
      :disabledSubmit="isInvalidForm || loading"
      @submit="submit"
    />
    <v-alert outlined class="ma-3 mb-5" type="error" v-if="!directoriesProfile">
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>
    <div v-else class="ma-3 text-caption">
      Профиль настроек: {{ directoriesProfileName }}
    </div>

    <v-text-field
      outlined
      label="Имя водителя"
      dense
      v-model.trim="$v.form.name.$model"
      :error-messages="nameErrors"
    />
    <app-date-time-input
      v-model="$v.form.birthday.$model"
      label="Дата рождения"
      hideTimeInput
      hidePrependIcon
      :errorMessages="birthdayErrors"
    />
    <v-text-field
      outlined
      label="Телефон"
      dense
      v-model.trim="$v.form.phone.$model"
    />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить</v-btn
    >
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

export default {
  name: 'DriverForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  props: {
    driver: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    driver: {
      immediate: true,
      handler: function (val) {
        if (!!val) this.setFormFields(val)
      },
    },
  },
  data() {
    return {
      loading: false,
      nameHint: 'Имя',
      form: {
        name: null,
        birthday: null,
        phone: null,
      },
    }
  },
  validations: {
    form: {
      name: { required },
      birthday: { required },
      phone: {},
    },
  },
  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },
    nameErrors() {
      const errors = []
      if (this.$v.form.name.$dirty && this.$v.form.name.$invalid)
        errors.push('Имя не может быть пустым')
      return errors
    },
    birthdayErrors() {
      const errors = []
      if (this.$v.form.birthday.$dirty && this.$v.form.birthday.$invalid)
        errors.push('Необходимо заполнить дату рождения')
      return errors
    },
  },
  methods: {
    submit() {
      const driver = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', driver)
      // this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      this.form.name = val.name
      this.form.birthday = val.birthday
      this.form.phone = val.phone
    },
    resetForm() {
      this.form.name = null
      this.form.birthday = null
      this.form.phone = null
    },
  },
}
</script>
<style></style>
