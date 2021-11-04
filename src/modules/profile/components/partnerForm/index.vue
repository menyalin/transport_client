<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabled-submit="isInvalidForm"
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert
      v-if="!directoriesProfile"
      outlined
      class="ma-3 mb-5"
      type="error"
    >
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>
    <div
      v-else
      class="ma-3 text-caption"
    >
      Профиль настроек: {{ directoriesProfileName }}
    </div>
    <v-text-field
      v-model.trim="$v.form.name.$model"
      :error-messages="nameErrors"
      outlined
      label="Название"
      dense
    />
    <v-text-field
      v-model.trim="$v.form.inn.$model"
      outlined
      label="ИНН"
      dense
    />

    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      @click="$emit('delete')"
    >
      <v-icon
        left
        dark
      >
        mdi-delete
      </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

export default {
  name: 'PartnerForm',
  components: {
    AppButtonsPanel,
  },
  props: {
    partner: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: null,
        inn: null,
      },
    }
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
        errors.push('Название не может быть пустым')
      return errors
    },
    formState() {
      return { ...this.form, company: this.directoriesProfile }
    },
  },
  watch: {
    partner: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },
  beforeDestroy() {
    this.$emit('saveToCache', this.formState)
  },
  validations: {
    form: {
      name: { required },
      inn: {},
    },
  },

  methods: {
    submit() {
      this.$emit('submit', this.formState)
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
