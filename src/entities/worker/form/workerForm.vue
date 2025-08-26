<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('worker:write') ||
        isInvalidForm ||
        !formChanged
      "
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="input-row">
      <v-text-field
        v-model.trim="v$.form.name.$model"
        :error-messages="nameErrors"
        outlined
        label="Сокращенное имя"
        dense
        :style="{ 'max-width': '330px' }"
      />
      <v-text-field
        v-model.trim="v$.form.fullName.$model"
        :error-messages="fullNameErrors"
        outlined
        label="Полное имя"
        dense
      />
    </div>
    <div class="input-row">
      <v-text-field
        v-model="form.employmentDate"
        type="date"
        dense
        outlined
        label="Дата приема на работу"
        :style="{ 'max-width': '260px' }"
      />

      <v-text-field
        v-model="form.dismissalDate"
        type="date"
        dense
        outlined
        label="Дата увольнения"
        :style="{ 'max-width': '260px' }"
      />
    </div>

    <v-text-field
      v-model.trim="v$.form.position.$model"
      outlined
      label="Должность"
      dense
    />

    <v-text-field v-model.trim="form.note" outlined label="Примечание" dense />

    <div v-if="!item._id" class="text-caption mx-3">
      *Для сопоставления сотрудника с пользователем, запись необходимо сохранить
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'

export default {
  name: 'WorkerForm',
  components: {
    ButtonsPanel,
  },
  props: {
    item: {
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
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data() {
    return {
      initialFormState: null,
      dateFields: ['dismissalDate', 'employmentDate'],
      form: {
        name: null,
        fullName: null,
        position: null,
        note: null,
        employmentDate: null, // дата приема на работу
        dismissalDate: null, // дата увольнения
      },
    }
  },

  computed: {
    ...mapGetters(['directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.v$.$invalid
    },

    nameErrors() {
      const errors = []
      if (this.v$.form.name.$dirty && this.v$.form.name.$invalid)
        errors.push('Имя не может быть пустым')
      return errors
    },

    fullNameErrors() {
      const errors = []
      if (this.v$.form.fullName.$dirty && this.v$.form.fullName.$invalid)
        errors.push('Полное имя не может быть пустым')
      return errors
    },

    formState() {
      const dates = {}
      this.dateFields.forEach((item) => {
        dates[item] = this.form[item]
          ? dayjs(this.form[item]).toISOString()
          : null
      })
      return { ...this.form, company: this.directoriesProfile, ...dates }
    },
    formChanged() {
      return JSON.stringify(this.formState) !== this.initialFormState
    },
  },
  watch: {
    item: {
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
      fullName: { required },
      position: {},
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
        if (this.dateFields.includes(key) && !!val[key]) {
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
.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
