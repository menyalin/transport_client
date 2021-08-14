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
    <v-select
      v-model.trim="$v.form.tkName.$model"
      :items="tkNames"
      item-text="name"
      item-value="_id"
      label="ТК"
      dense
      outlined
      @change="tkNameChange"
    />
    <app-truck-select
      v-model="$v.form.truck.$model"
      label="Грузовик"
      type="truck"
      :tkName="form.tkName"
      :disabled="!directoriesProfile || !form.tkName"
      @change="truckChange"
    />
    <app-truck-select
      v-model="$v.form.trailer.$model"
      label="Прицеп"
      type="trailer"
      :tkName="form.tkName"
      :disabled="!directoriesProfile || !form.truck || !allowUseTrailers"
    />
    <v-select
      v-model="$v.form.driver.$model"
      dense
      outlined
      label="Водитель"
      :items="driversByTruck"
      item-value="_id"
      item-text="fullName"
    />

    <app-date-time-input
      v-model="$v.form.startDate.$model"
      label="Дата начала"
      :errorMessages="startDateError"
      @blur="$v.form.startDate.$touch()"
    />
    <v-text-field
      v-model="$v.form.note.$model"
      label="Примечание"
      outlined
      dense
    />
    <div
      v-if="crew && crew.manager"
      class="pb-4 text-caption"
    >
      Отв.пользователь: {{ crew.manager.name }},
      {{ crew.manager.email }}
      <br>
      Создан: {{ new Date(crew.createdAt).toLocaleString() }}
      <span v-if="crew.updatedAt">
        Обновлен: {{ new Date(crew.updatedAt).toLocaleString() }}
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

import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTruckSelect from '@/modules/profile/components/truckSelect'
import moment from 'moment'

export default {
  name: 'CrewForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppTruckSelect,
  },
  props: {
    crew: {
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
        tkName: null,
        truck: null,
        trailer: null,
        driver: null,
        startDate: null,
        note: null,
      },
    }
  },
  computed: {
    ...mapGetters([
      'tkNames',
      'myCompanies',
      'directoriesProfile',
      'allowedToUseTrailersTrucksSet',
    ]),
    driversByTruck() {
      if (!this.form.truck) return []
      const tmpTruck = this.$store.getters.trucks.find(
        (item) => item._id === this.form.truck
      )
      if (!tmpTruck) return []
      return (
        tmpTruck?.allowedDrivers?.map((driverId) =>
          this.$store.getters.driversMap.get(driverId)
        ) || []
      )
    },
    allowUseTrailers() {
      return this.allowedToUseTrailersTrucksSet.has(this.form.truck)
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
  },
  watch: {
    crew: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },
  validations: {
    form: {
      tkName: { required },
      truck: { required },
      trailer: {},
      driver: { required },
      startDate: { required },
      note: {},
    },
  },

  methods: {
    truckChange() {
      this.form.driver = null
    },
    tkNameChange() {
      this.form.truck = null
      this.form.trailer = null
      this.form.driver = null
    },
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
      this.form.tkName = val.tkName?._id || val.tkName
      this.form.truck = val.truck?._id || val.truck
      this.form.trailer = val.trailer?._id || val.trailer
      this.form.driver = val.driver?._id || val.driver
      this.form.startDate = val.startDate || moment().format()
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
