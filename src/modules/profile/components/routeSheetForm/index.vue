<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabled-submit="isInvalidForm || loading"
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
    <app-truck-autocomplete
      v-model="$v.form.truck.$model"
      label="Грузовик"
      type="truck"
      :disabled="!directoriesProfile"
    />
    <app-truck-autocomplete
      v-model="$v.form.trailer.$model"
      label="Прицеп"
      type="trailer"
      :disabled="!directoriesProfile || !form.truck || !allowUseTrailers"
    />

    <app-driver-autocomplete
      v-model="$v.form.driver.$model"
      label="Водитель"
      :disabled="!directoriesProfile || !form.truck"
    />

    <app-driver-autocomplete
      v-model="$v.form.driver2.$model"
      label="Водитель 2"
      :disabled="!directoriesProfile || !form.truck || !form.driver"
    />
    <app-date-time-input
      v-model="$v.form.startDate.$model"
      label="Дата начала"
      :errorMessages="startDateError"
      @blur="$v.form.startDate.$touch()"
    />
    <app-date-time-input
      v-model="$v.form.endDate.$model"
      label="Дата завершения"
      :disabled="!form.startDate"
      :errorMessages="endDateError"
      @blur="$v.form.endDate.$touch()"
    />
    <v-text-field
      v-model="$v.form.note.$model"
      label="Примечание"
      outlined
      dense
    />
    <div
      v-if="routesheet && routesheet.manager"
      class="pb-4 text-caption"
    >
      Отв.пользователь: {{ routesheet.manager.name }},
      {{ routesheet.manager.email }}
      <br>
      Создан: {{ new Date(routesheet.createdAt).toLocaleString() }}
      <span v-if="routesheet.updatedAt">
        Обновлен: {{ new Date(routesheet.updatedAt).toLocaleString() }}
      </span>
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
import { isLaterThan } from '@/modules/common/helpers/dateValidators'

import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTruckAutocomplete from '@/modules/profile/components/truckAutocomplete'
import AppDriverAutocomplete from '@/modules/profile/components/driverAutocomplete'

export default {
  name: 'RouteSheetForm',
  components: {
    AppButtonsPanel,
    AppTruckAutocomplete,
    AppDriverAutocomplete,
    AppDateTimeInput,
  },
  props: {
    routesheet: {
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
        truck: null,
        trailer: null,
        driver: null,
        driver2: null,
        startDate: null,
        endDate: null,
        note: null,
      },
    }
  },
  computed: {
    ...mapGetters([
      'myCompanies',
      'directoriesProfile',
      'allowedToUseTrailersTrucks',
    ]),
    allowUseTrailers() {
      if (this.allowedToUseTrailersTrucks[this.form.truck] !== undefined)
        return this.allowedToUseTrailersTrucks[this.form.truck]
      return true
    },
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid || (this.allowUseTrailers && !this.form.trailer)
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },
    startDateError() {
      if (this.$v.form.startDate.$dirty && this.$v.form.startDate.$invalid)
        return ['Начальная дата не может быть пустой']
      else return null
    },
    endDateError() {
      if (this.$v.form.endDate.$dirty && this.$v.form.endDate.$invalid)
        return ['Должна быть больше даты начала']
      else return null
    },
  },
  watch: {
    routesheet: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },
  validations: {
    form: {
      truck: { required },
      trailer: {},
      driver: { required },
      driver2: {},
      startDate: { required },
      endDate: {
        laterStartDate: isLaterThan('startDate'),
      },
      note: {},
    },
  },

  methods: {
    submit() {
      const item = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', item)
      this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      this.form.truck = val.truck?._id
      this.form.trailer = val.trailer?._id
      this.form.driver = val.driver?._id
      this.form.driver2 = val.driver2?._id
      this.form.startDate = val.startDate
      this.form.endDate = val.endDate
      this.form.note = val.note
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
