<template>
  <div class="pb-4">
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('partner:write') ||
        isInvalidForm ||
        !formChanged
      "
      @cancel="cancel"
      @submit="submit"
      class="mb-3"
    />
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
    <v-select
      v-model="form.group"
      label="Группа"
      :items="$store.getters.partnerGroups"
      outlined
      dense
      clearable
    />
    <v-text-field
      v-model.trim="form.contacts"
      outlined
      clearable
      label="Контакты"
      dense
    />
    <v-checkbox v-model="form.isClient" label="Клиент" hide-details dense />
    <v-checkbox v-model="form.isService" label="Сервис" dense />

    <places-for-transfer-docs
      v-if="form.isClient"
      v-model="form.placesForTransferDocs"
      :partnerId="partner._id"
      :places="partner.placesForTransferDocs"
      @updatePartner="updatePartnerHandler"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import { ButtonsPanel } from '@/shared/ui'
import PlacesForTransferDocs from './placesForTransferDocs.vue'

export default {
  name: 'PartnerForm',
  components: {
    ButtonsPanel,
    PlacesForTransferDocs,
  },
  props: {
    partner: {
      type: Object,
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
        inn: null,
        group: null,
        contacts: null,
        isClient: false,
        isService: false,
        placesForTransferDocs: [],
      },
    }
  },

  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
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
    formChanged() {
      return JSON.stringify(this.formState) !== this.initialFormState
    },
  },
  watch: {
    partner: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations: {
    form: {
      name: { required },
      inn: {},
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
    updatePartnerHandler(value) {
      this.$emit('updatePartner', value)
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
