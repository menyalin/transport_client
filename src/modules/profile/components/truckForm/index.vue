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
      label="Модель"
      dense
      v-model.trim="$v.form.model.$model"
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
      label="Гос.номер"
      dense
      v-model.trim="$v.form.regNum.$model"
    />
    <v-text-field
      outlined
      label="СТС"
      dense
      v-model.trim="$v.form.sts.$model"
    />
    <v-text-field
      outlined
      label="ПТС"
      dense
      v-model.trim="$v.form.pts.$model"
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

export default {
  name: 'TruckForm',
  components: {
    AppButtonsPanel,
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
        model: null,
        type: null,
        regNum: null,
        sts: null,
        pts: null,
      },
    }
  },
  validations: {
    form: {
      name: { required },
      model: {},
      type: { required },
      regNum: {},
      sts: {},
      pts: {},
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
      ).name
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
      this.form.name = val.name
      this.form.model = val.model
      this.form.type = val.type
      this.form.regNum = val.regNum
      this.form.sts = val.sts
      this.form.pts = val.pts
    },
    resetForm() {
      this.form.name = null
      this.form.model = null
      this.form.type = null
      this.form.regNum = null
      this.form.sts = null
      this.form.pts = null
    },
  },
}
</script>
<style></style>
