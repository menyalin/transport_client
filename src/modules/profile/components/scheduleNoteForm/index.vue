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

    <v-autocomplete
      v-model="$v.form.truck.$model"
      label="Грузовик"
      :items="trucks"
      outlined
      dense
    />
    <v-text-field
      v-model.trim="$v.form.text.$model"
      outlined
      label="Текст"
      dense
    />
    <app-date-time-input
      v-model="$v.form.startPositionDate.$model"
      label="Дата начала"
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
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

export default {
  name: 'ScheduleNoteForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  props: {
    scheduleNote: {
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
        text: null,
        truck: null,
        startPositionDate: null,
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
    trucks() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .map((item) => ({ value: item._id, text: item.regNum }))
    },
  },
  watch: {
    scheduleNote: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations() {
    return {
      form: {
        text: { required },
        truck: { required },
        startPositionDate: { required },
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
