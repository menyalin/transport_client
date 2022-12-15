<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('tkName:write') ||
          isInvalidForm ||
          loading
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
    <v-text-field
      v-model.trim="$v.form.name.$model"
      :error-messages="nameErrors"
      outlined
      label="Название ТК"
      dense
    />
    <v-checkbox v-model="form.outsource" label="Привлеченный перевозчик" />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import { ButtonsPanel } from '@/shared/ui'

export default {
  name: 'DriverForm',
  components: {
    ButtonsPanel,
  },
  props: {
    tkName: {
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
      form: {
        name: null,
        outsource: false,
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
        errors.push('Название ТК не может быть пустым')
      return errors
    },
  },
  watch: {
    tkName: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },
  validations: {
    form: {
      name: { required },
    },
  },

  methods: {
    submit() {
      const tkName = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', tkName)
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
