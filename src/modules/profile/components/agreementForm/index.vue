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
    <div>
      <v-text-field
        v-model="$v.form.name.$model"
        class="mt-3"
        label="Название"
        outlined
        dense
      />
      <app-date-time-input
        v-model="$v.form.date.$model"
        label="Дата начала"
        hideTimeInput
        class="mb-4"
      />
      <v-select
        v-model="$v.form.vatRate.$model"
        label="Ставка НДС"
        :items="vatRates"
        dense
        outlined
      />
      <v-select
        v-model="$v.form.calcMethod.$model"
        label="Метод расчета стоимости рейса"
        :items="calcMethods"
        outlined
        :hint="calcMethodHint"
        persistent-hint
        dense
        clearable
      />
      <app-clients v-model="$v.form.clients.$model" />
      <v-text-field
        v-model="$v.form.note.$model"
        label="Примечание"
        outlined
        dense
      />
    </div>

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
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppClients from './clients.vue'

export default {
  name: 'AgreementForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppClients,
  },
  props: {
    agreement: {
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
      form: {
        name: null,
        note: null,
        date: null,
        vatRate: null,
        calcMethod: null,
        clients: [],
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

    formState() {
      return { ...this.form, company: this.directoriesProfile }
    },
    vatRates() {
      return this.$store.getters.vatRates
    },
    calcMethods() {
      return this.$store.getters.calcMethods
    },
    calcMethodHint() {
      if (!this.form.calcMethod) return null
      return this.calcMethods.filter((c) => c.value === this.form.calcMethod)[0]
        ?.description
    },
  },
  watch: {
    agreement: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations() {
    return {
      form: {
        name: { required },
        date: { required },
        vatRate: { required },
        calcMethod: {},
        clients: {},
        note: {},
      },
    }
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
