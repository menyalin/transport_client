<template>
  <div>
    <app-buttons-panel
      :disabled-submit="isInvalidForm || loading"
      panel-type="form"
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
    <div class="wrapper">
      <div class="text-caption px-5 py-2">
        Период отображения рейса
      </div>
      <div class="dates-position-block">
        <app-date-time-input
          v-model="$v.form.startPositionDate.$model"
          label="Дата начала"
          hideDetails
          @blur="$v.form.startPositionDate.$touch()"
        />
        <app-date-time-input
          v-model="$v.form.endPositionDate.$model"
          :disabled="!form.startPositionDate"
          label="Дата завершения"
          :errorMessages="endPositionDateErrors"
          :minDate="form.startPositionDate"
          hideDetails
          @blur="$v.form.endPositionDate.$touch()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import { required } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  props: {
    order: {
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
      orderId: null,
      form: {
        startPositionDate: null,
        endPositionDate: null,
      },
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile', 'myCompanies']),
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
    endPositionDateErrors() {
      let errors = []
      if (!this.$v.form.endPositionDate.isLaterThan)
        errors.push('Дата должна быть больше начальной даты')
      return errors
    },
  },
  watch: {
    order: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.orderId = val._id
          this.setFormFields(val)
        }
      },
    },
  },
  validations() {
    return {
      form: {
        startPositionDate: { required },
        endPositionDate: {
          required,
          isLaterThan: isLaterThan(this.form.startPositionDate),
        },
        note: {},
      },
    }
  },
  methods: {
    submit() {
      if (!this.directoriesProfile) return null
      this.$emit('submit', { ...this.form, company: this.directoriesProfile })
    },
    cancel() {
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
<style scoped>
.dates-position-block {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.dates-position-block > div {
  padding: 0px 15px;
}
</style>
