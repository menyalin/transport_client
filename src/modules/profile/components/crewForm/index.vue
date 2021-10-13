<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabledSubmit="
        editTransportTable || !form.transport.length || $v.$invalid
      "
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
      :disabled="!!crewId"
      @change="tkNameChange"
    />
    <v-select
      v-model="$v.form.driver.$model"
      outlined
      hide-details
      label="Водитель"
      class="mb-2"
      :items="tkDrivers"
      item-value="_id"
      item-text="fullName"
      :disabled="!form.tkName || !!crewId"
    />
    <div class="row-input">
      <app-date-time-input
        v-model="$v.form.startDate.$model"
        label="Дата начала"
        :errorMessages="startDateError"
        :disabled="!form.driver || !!crewId"
        :minDate="minValueForStartDate"
        @blur="$v.form.startDate.$touch()"
      />
      <app-date-time-input
        v-model="$v.form.endDate.$model"
        :disabled="!form.startDate || !crewEditable"
        label="Дата завершения"
        :errorMessages="endDateError"
        :minDate="form.startDate"
        @blur="$v.form.endDate.$touch()"
      />
      <div v-if="crew">
        crewEditable: {{ crewEditable }}
      </div>
    </div>

    <app-crew-message
      v-if="!!actualDriverCrew && !actualDriverCrew.endDate"
      text="У водителя есть открытая смена от"
      :visibleDate="actualDriverCrew.startDate"
      :date="form.startDate"
      :crewId="actualDriverCrew._id"
      :invalid="$v.form.startDate.$invalid"
      type="crew"
      @clearCrew="clearActualCrew"
    />

    <app-transport-table
      v-if="showTransportTable"
      :items="form.transport"
      :date="form.startDate"
      :driver="form.driver"
      :crewId="crewId"
      :crewEditable="crewEditable"
      :isClosedCrew="!!form.endDate"
      :tkName="form.tkName"
      @addItem="addItem"
      @editMode="changeEditModeStatus"
      @itemsPop="deleteLastItemInTransport"
    />

    <v-text-field
      v-model="$v.form.note.$model"
      label="Примечание"
      outlined
      dense
      class="mt-6"
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
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'

import CrewService from '@/modules/profile/services/crew.service.js'

import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

import AppTransportTable from './transportTable.vue'
import AppCrewMessage from './crewMessage'
import moment from 'moment'

export default {
  name: 'CrewForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppTransportTable,
    AppCrewMessage,
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
      crewId: null,
      loading: false,
      editTransportTable: false,
      crewEditable: false,
      actualDriverCrew: null,
      lastDriverCrew: null,
      form: {
        tkName: null,
        transport: [],
        driver: null,
        startDate: null,
        endDate: null,
        note: null,
      },
    }
  },
  computed: {
    ...mapGetters([
      'tkNames',
      'drivers',
      'myCompanies',

      'directoriesProfile',
      'allowedToUseTrailersTrucksSet',
    ]),
    tkDrivers() {
      if (!this.form.tkName) return []
      else return this.$store.getters.driversForSelect(this.form.tkName)
    },
    allowUseTrailers() {
      return this.allowedToUseTrailersTrucksSet.has(this.form.truck)
    },
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid || (this.allowUseTrailers && !this.form.trailer)
    },
    showTransportTable() {
      return (
        this.form.driver &&
        this.form.startDate &&
        !this.$v.form.startDate.$invalid &&
        (this.actualDriverCrew?.endDate || !this.actualDriverCrew)
      )
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },
    minValueForStartDate() {
      if (!this.actualDriverCrew) return '2021-08-01'
      const idx = this.actualDriverCrew.transport.length - 1
      if (idx < 0) return '2021-08-01'

      return this.actualDriverCrew.transport[idx].endDate
        ? this.actualDriverCrew.transport[idx].endDate
        : this.actualDriverCrew.transport[idx].startDate
    },
    startDateError() {
      let errors = []
      if (this.$v.form.startDate.$dirty && !this.$v.form.startDate.required)
        errors.push('Поле не может быть пустым')
      if (
        this.$v.form.startDate.$dirty &&
        !this.$v.form.startDate.isLaterThan
      ) {
        const dateStr = moment(
          this.$v.form.startDate.$params.isLaterThan.eq
        ).format('DD.MM.YYYY HH:mm')
        errors.push(`Дата должна быть больше ${dateStr}`)
      }
      return errors
    },
    endDateError() {
      let errors = []
      if (!this.$v.form.endDate.isLaterThan)
        errors.push('Дата должна быть больше начальной даты')
      return errors
    },
  },
  watch: {
    crew: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.crewId = val._id
          this.crewEditable = val.editable
          this.setFormFields(val)
        }
      },
    },
    ['form.driver']: {
      handler: async function (val) {
        if (val) {
          this.actualDriverCrew = await CrewService.getActualCrewByDriver(val)
        }
      },
    },
  },
  validations() {
    return {
      form: {
        tkName: { required },
        driver: { required },
        startDate: {
          required,
          isLaterThan: isLaterThan(this.minValueForStartDate),
        },
        endDate: { isLaterThan: isLaterThan(this.form.startDate) },
        note: {},
      },
    }
  },

  methods: {
    clearActualCrew() {
      this.actualDriverCrew = null
    },
    deleteLastItemInTransport() {
      this.crewEditable = false
      this.form.transport.pop()
    },
    changeEditModeStatus(val) {
      this.editTransportTable = val
    },
    addItem(val) {
      const idx = this.form.transport.length - 1
      if (idx >= 0 && !this.form.transport[idx].endDate) {
        this.form.transport[idx].endDate = val.startDate
        this.form.transport[idx].updated = true
      }
      this.form.transport.push(val)
    },

    truckChange() {
      console.log('change truck')
    },
    tkNameChange() {
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
      this.form.transport = val.transport
      this.form.driver = val.driver?._id || val.driver
      this.form.startDate = val.startDate || moment().format()
      this.form.endDate = val.endDate
      this.form.note = val.note
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = null
      })
      this.form.transport = []
    },
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
}
.row-input > * {
  margin: 5px 20px;
}
</style>
