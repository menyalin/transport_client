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
      label="ТК"
      dense
      v-model.trim="$v.form.tkName.$model"
    />
    <div class="row-input">
      <v-text-field
        outlined
        label="Фамилия"
        dense
        v-model.trim="$v.form.surname.$model"
        :error-messages="surnameErrors"
      />
      <v-text-field
        outlined
        label="Имя"
        dense
        v-model.trim="$v.form.name.$model"
        :error-messages="nameErrors"
      />
      <v-text-field
        outlined
        label="Отчество"
        dense
        v-model.trim="$v.form.patronymic.$model"
        :error-messages="nameErrors"
      />
      <app-date-time-input
        v-model="$v.form.birthday.$model"
        label="Дата рождения"
        hideTimeInput
        hidePrependIcon
      />
    </div>

    <div class="row-input">
      <v-text-field
        outlined
        label="Серия и номер паспорта"
        dense
        v-model.trim="$v.form.passportId.$model"
      />
      <v-text-field
        outlined
        label="Паспорт выдан"
        dense
        v-model.trim="$v.form.passportIssued.$model"
      />
      <app-date-time-input
        v-model="$v.form.passportDate.$model"
        label="Дата выдачи паспорта"
        hideTimeInput
        hidePrependIcon
      />
    </div>

    <div class="row-input">
      <v-text-field
        outlined
        label="Номер ВУ"
        dense
        v-model.trim="$v.form.licenseId.$model"
      />
      <app-date-time-input
        v-model="$v.form.licenseDate.$model"
        label="Дата выдачи ВУ"
        hideTimeInput
        hidePrependIcon
      />
      <v-text-field
        outlined
        label="Кагории ВУ"
        dense
        v-model.trim="$v.form.licenseCategory.$model"
      />
    </div>

    <div class="row-input">
      <v-text-field
        outlined
        label="Карта водителя"
        dense
        v-model.trim="$v.form.driverCardId.$model"
      />
      <app-date-time-input
        v-model="$v.form.driverCardPeriod.$model"
        label="КВ действительна до"
        hideTimeInput
        hidePrependIcon
      />
    </div>

    <div class="row-input">
      <v-text-field
        outlined
        label="Телефон"
        dense
        v-model.trim="$v.form.phone.$model"
      />
      <v-text-field
        outlined
        label="Телефон 2"
        dense
        v-model.trim="$v.form.phone2.$model"
      />
    </div>

    <div class="row-input">
      <app-date-time-input
        v-model="$v.form.employmentDate.$model"
        label="Дата приема на работу"
        hideTimeInput
      />

      <app-date-time-input
        v-model="$v.form.dismissalDate.$model"
        label="Дата увольнения"
        hideTimeInput
      />
      <v-text-field
        outlined
        label="Кто рекомедовал"
        dense
        v-model.trim="$v.form.recommender.$model"
      />
    </div>

    <v-checkbox label="Есть сканы документов" v-model="form.hasScans" dense />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
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
        if (val) this.setFormFields(val)
      },
    },
  },
  data() {
    return {
      loading: false,
      form: {
        tkName: null,
        surname: null,
        name: null,
        patronymic: null,
        passportId: null,
        passportIssued: null,
        passportDate: null,
        licenseId: null,
        licenseDate: null,
        licenseCategory: null,
        driverCardId: null,
        driverCardPeriod: null,
        hasScans: null,
        phone: null,
        phone2: null,
        employmentDate: null,
        dismissalDate: null,
        recommender: null,
        birthday: null,
      },
    }
  },
  validations: {
    form: {
      tkName: {},
      surname: { required },
      name: { required },
      patronymic: {},
      passportId: {},
      passportIssued: {},
      passportDate: {},
      licenseId: {},
      licenseDate: {},
      licenseCategory: {},
      driverCardId: {},
      driverCardPeriod: {},
      hasScans: {},
      phone: {},
      phone2: {},
      employmentDate: {},
      dismissalDate: {},
      recommender: {},
      birthday: {},
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
    surnameErrors() {
      const errors = []
      if (this.$v.form.surname.$dirty && this.$v.form.surname.$invalid)
        errors.push('Имя не может быть пустым')
      return errors
    },
  },
  methods: {
    submit() {
      const driver = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', driver)
      this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
}
</style>
