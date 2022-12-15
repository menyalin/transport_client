<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('partner:write') ||
        isInvalidForm ||
        !formChanged
      "
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />
    <div class="first-row">
      <v-text-field
        v-model.trim="$v.form.name.$model"
        :error-messages="nameErrors"
        outlined
        label="Название"
        dense
      />

      <v-text-field
        v-model="$v.form.date.$model"
        :error-messages="dateErrors"
        outlined
        type="date"
        label="Дата"
        :style="{ 'max-width': '200px' }"
        dense
      />
    </div>

    <app-partner-autocomplete
      v-model="form.partner"
      label="Партнер"
      onlyClients
      outlined
      dense
    />

    <v-checkbox
      v-model="form.useInTariff"
      label="Используется при создании тарифов"
    />

    <v-text-field v-model.trim="form.note" outlined label="Примечание" dense />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import { ButtonsPanel } from '@/shared/ui'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'

export default {
  name: 'PartnerForm',

  components: {
    ButtonsPanel,
    AppPartnerAutocomplete,
  },

  props: {
    document: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    openInModal: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      initialFormState: null,
      form: {
        name: null,
        date: null,
        note: null,
        partner: null,
        useInTariff: false,
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
    dateErrors() {
      const errors = []
      if (this.$v.form.date.$dirty && this.$v.form.date.$invalid)
        errors.push('Дата не может быть пустой')
      return errors
    },
    formState() {
      return { ...this.form, company: this.directoriesProfile }
    },
    formChanged() {
      return JSON.stringify(this.formState) !== this.initialFormState
    },
  },
  watch: {
    document: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations: {
    form: {
      name: { required },
      date: { required },
    },
  },
  mounted() {
    this.initialFormState = JSON.stringify(this.formState)
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
        if (key === 'date' && !!val[key]) {
          this.form[key] = dayjs(val[key]).format('YYYY-MM-DD')
        } else this.form[key] = val[key]
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
<style scoped>
.first-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>
