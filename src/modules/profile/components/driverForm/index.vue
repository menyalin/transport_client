<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('driver:write') ||
        isInvalidForm ||
        loading ||
        !formChanged
      "
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert v-if="!directoriesProfile" outlined class="ma-3 mb-5" type="error">
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>
    <div v-else class="ma-3 text-caption">
      Профиль настроек: {{ directoriesProfileName }}
    </div>
    <div>
      <div class="row-wrapper tk-name">
        <v-select
          v-model.trim="$v.form.tkName.$model"
          :items="tkNames"
          item-text="name"
          item-value="_id"
          label="ТК"
          dense
          outlined
        />
      </div>
      <div class="row-wrapper driver-name">
        <v-text-field
          v-model.trim="$v.form.surname.$model"
          outlined
          label="Фамилия"
          dense
          :error-messages="surnameErrors"
        />
        <v-text-field
          v-model.trim="$v.form.name.$model"
          outlined
          label="Имя"
          dense
          :error-messages="nameErrors"
        />
        <v-text-field
          v-model.trim="$v.form.patronymic.$model"
          outlined
          label="Отчество"
          dense
          :error-messages="nameErrors"
        />
        <app-date-time-input
          v-model="$v.form.birthday.$model"
          label="Дата рождения"
          hide-time-input
          hide-prepend-icon
        />
      </div>

      <div class="row-wrapper">
        <div class="passport">
          <div>
            <v-text-field
              v-model.trim="$v.form.passportId.$model"
              outlined
              hide-details
              label="Номер паспорта"
              dense
              class="pb-3"
            />
            <app-date-time-input
              v-model="$v.form.passportDate.$model"
              label="Дата выдачи паспорта"
              hide-time-input
              hide-prepend-icon
            />
          </div>
          <v-textarea
            v-model.trim="$v.form.passportIssued.$model"
            outlined
            label="Паспорт выдан"
            dense
            :rows="4"
          />
        </div>
        <div class="driver-license">
          <v-text-field
            v-model.trim="$v.form.licenseId.$model"
            outlined
            hide-details
            label="Номер ВУ"
            dense
          />
          <v-text-field
            v-model.trim="$v.form.licenseCategory.$model"
            outlined
            label="Категории ВУ"
            hide-details
            dense
          />
          <app-date-time-input
            v-model="$v.form.licenseDate.$model"
            label="Дата выдачи ВУ"
            hide-time-input
            hide-prepend-icon
          />
        </div>
        <div class="driver-cards">
          <v-text-field
            v-model.trim="$v.form.driverCardId.$model"
            outlined
            hide-details
            label="Карта водителя"
            dense
          />
          <app-date-time-input
            v-model="$v.form.driverCardPeriod.$model"
            label="КВ действительна до"
            hide-time-input
            hide-prepend-icon
          />
        </div>
      </div>
      <div class="row-wrapper phones">
        <v-text-field
          v-model.trim="$v.form.phone.$model"
          outlined
          label="Телефон"
          hide-details
          dense
        />
        <v-text-field
          v-model.trim="$v.form.phone2.$model"
          outlined
          label="Телефон 2"
          hide-details
          dense
        />
      </div>

      <app-med-book v-model="medBook" title="Мед.книжка" class="mb-5" />
      <div class="work-status">
        <div>
          <v-checkbox
            v-model="form.isBrigadier"
            label="Бригадир"
            hide-details
            dense
          />
          <v-checkbox
            v-model="form.isMechanic"
            label="Механик"
            hide-details
            dense
          />
        </div>
        <app-date-time-input
          v-model="$v.form.employmentDate.$model"
          label="Дата приема на работу"
          hide-time-input
        />

        <app-date-time-input
          v-model="$v.form.dismissalDate.$model"
          label="Дата увольнения"
          hide-time-input
        />
        <v-text-field
          v-model.trim="$v.form.recommender.$model"
          outlined
          label="Кто рекомедовал"
          dense
          hide-details
        />
      </div>
      <app-additional-notifications v-model="additionalNotifications" />
      <v-checkbox v-model="form.hasScans" label="Есть сканы документов" dense />
      <v-checkbox
        v-model="form.hideInFines"
        label="Не показывать в штрафах"
        dense
      />

      <v-checkbox v-model="form.isCalcSalary" dense label="Расчет ЗП" />
    </div>
    <div v-if="displayDeleteBtn" class="delete-btn-row mt-3">
      <v-btn color="error" @click="$emit('delete')">
        <v-icon left dark> mdi-delete </v-icon>
        Удалить
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import AppMedBook from './medBook.vue'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import { ButtonsPanel } from '@/shared/ui'
import AppAdditionalNotifications from '@/modules/common/components/additionalNotifications'

export default {
  name: 'DriverForm',
  components: {
    ButtonsPanel,
    AppDateTimeInput,
    AppMedBook,
    AppAdditionalNotifications,
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
  data() {
    return {
      loading: false,
      medBook: {},
      additionalNotifications: [],
      initialFormState: null,
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
        isBrigadier: false,
        isMechanic: false,
        hideInFines: false,
        isCalcSalary: true,
      },
    }
  },
  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile', 'tkNames']),
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
    formChanged() {
      return this.initialFormState !== JSON.stringify(this.formState)
    },
    formState() {
      return {
        ...this.form,
        medBook: this.medBook,
        company: this.directoriesProfile,
        additionalNotifications: this.additionalNotifications,
      }
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
  validations: {
    form: {
      tkName: { required },
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
  mounted() {
    this.initialFormState = JSON.stringify(this.formState)
  },
  methods: {
    submit() {
      this.$emit('submit', this.formState)
      // this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      this.medBook = val.medBook
      if (val.additionalNotifications)
        this.additionalNotifications = val.additionalNotifications
      keys.forEach((key) => {
        this.form[key] = val[key]
        if (val.tkName?._id) this.form.tkName = val.tkName._id
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      this.medBook = { ...{} }
      this.additionalNotifications = []
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style scoped>
.row-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.row-wrapper > * {
  padding: 2px 10px;
  width: 100%;
}
.tk-name > * {
  max-width: 15rem;
}
.driver-name {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
}
.passport {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.passport > * {
  /* padding: 2px 10px; */
  margin-right: 10px;
}
.driver-license {
  max-width: 230px;
}
.driver-license > * {
  margin-bottom: 8px;
}
.phones > * {
  margin-bottom: 8px;
  max-width: 300px;
}

.driver-cards {
  max-width: 230px;
}
.driver-cards > * {
  margin-bottom: 8px;
}
.work-status {
  display: grid;
  grid-template-columns: 150px 200px 200px auto;
  gap: 15px;
  align-items: center;
  margin-bottom: 30px;
}
.delete-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
