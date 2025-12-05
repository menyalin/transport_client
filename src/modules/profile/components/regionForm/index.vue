<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="!$store.getters.hasPermission('region:write') || isInvalidForm || !formChanged"
      @cancel="cancel"
      @submit="submit"
    />
    <v-text-field
      v-model.trim="$v.form.name.$model"
      :errorMessages="nameErrors"
      variant="outlined"
       density="compact"
      label="Название"
     
    />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start>mdi-delete</v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from '@vuelidate/validators'

import { ButtonsPanel } from '@/shared/ui'

export default {
  name: 'RegionForm',
  components: {
    ButtonsPanel,
  },
  props: {
    region: {
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
      return this.myCompanies.find(item => item._id === this.directoriesProfile).name
    },
    nameErrors() {
      const errors = []
      if (this.$v.form.name.$dirty && this.$v.form.name.$invalid) errors.push('Название не может быть пустым')
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
    region: {
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
      keys.forEach(key => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach(key => {
        this.form[key] = null
      })
    },
  },
}
</script>
