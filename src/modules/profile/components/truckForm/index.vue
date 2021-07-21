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
      label="Заголовок ТС"
      dense
      v-model.trim="$v.form.name.$model"
      :error-messages="nameErrors"
    />
    <v-text-field
      outlined
      label="Марка"
      dense
      v-model.trim="$v.form.brand.$model"
      :error-messages="nameErrors"
    />
    <v-text-field
      outlined
      label="Модель"
      dense
      v-model.trim="$v.form.model.$model"
    />
    <v-text-field
      outlined
      label="Год выпуска"
      dense
      v-model.trim="$v.form.issueYear.$model"
    />
    <app-date-time-input
      v-model="$v.form.startServiceDate.$model"
      label="Дата ввода в эксплуатацию"
      hideTimeInput
      hidePrependIcon
    />
    <app-date-time-input
      v-model="$v.form.endServiceDate.$model"
      label="Дата вывода из эксплуатации"
      hideTimeInput
      hidePrependIcon
    />
    <v-select
      outlined
      label="Тип ТС"
      dense
      :items="truckTypes"
      v-model="$v.form.type.$model"
    />
    <v-text-field
      outlined
      label="ТК"
      dense
      v-model.trim="$v.form.tkName.$model"
    />
    <v-text-field
      outlined
      label="Гос.номер"
      dense
      v-model.trim="$v.form.regNum.$model"
    />
    <v-text-field
      outlined
      label="WIN"
      dense
      v-model.trim="$v.form.win.$model"
    />
    <v-text-field
      outlined
      label="СТС"
      dense
      v-model.trim="$v.form.sts.$model"
    />
     <app-date-time-input
      v-model="$v.form.stsDate.$model"
      label="Дата СТС"
      hideTimeInput
      hidePrependIcon
    />
    <v-text-field
      outlined
      label="ПТС"
      dense
      v-model.trim="$v.form.pts.$model"
    />
    <v-text-field
      outlined
      label="Собственник"
      dense
      v-model.trim="$v.form.owner.$model"
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

import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'TruckForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  props: {
    truck: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    truck: {
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
        brand: null,
        model: null,
        issueYear: null,
        startServiceDate: null,
        endServiceDate: null,
        tkName: null,
        type: null,
        regNum: null,
        win: null,
        sts: null,
        stsDate: null,
        pts: null,
        owner: null,
      },
    }
  },
  validations: {
    form: {
      name: { required },
      brand: {},
      model: {},
      issueYear: {},
      startServiceDate: {},
      endServiceDate: {},
      tkName: {},
      type: { required },
      regNum: {},
      win: {},
      sts: {},
      stsDate: {},
      pts: {},
      owner: {},
    },
  },
  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile', 'truckTypes']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      )?.name
    },
    nameErrors() {
      const errors = []
      if (this.$v.form.name.$dirty && this.$v.form.name.$invalid)
        errors.push('Имя не может быть пустым')
      return errors
    },
  },
  methods: {
    submit() {
      const truck = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', truck)
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
<style></style>
