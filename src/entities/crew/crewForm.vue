<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('crew:write') ||
        editTransportTable ||
        !formState.transport.length ||
        v$.$invalid
      "
      @cancel="cancel"
      @submit="submit"
    />

    <v-select
      v-model.trim="v$.tkName.$model"
      :items="tkNames"
      item-title="name"
      item-value="_id"
      label="ТК"
      density="compact"
      variant="outlined"
      :disabled="!!crewId"
      @update:model-value="tkNameChange"
    />
    <v-autocomplete
      v-model="v$.driver.$model"
      variant="outlined"
      hide-details
      label="Водитель"
      class="mb-2"
      :items="tkDrivers"
      item-value="_id"
      item-title="fullName"
      :disabled="!formState.tkName || !!crewId"
    />
    <div class="row-input">
      <AppDateTimeInput
        v-model="v$.startDate.$model"
        label="Дата начала"
        :errorMessages="startDateError"
        :disabled="!form.driver || !!crewId"
        :minDate="minValueForStartDate"
        dense
        hideDetails
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
        @blur="v$.form.startDate.$touch()"
      />
      <AppDateTimeInput
        v-model="v$.form.endDate.$model"
        :disabled="!form.startDate || (!!form.endDate && !crewEditable)"
        label="Дата завершения"
        :errorMessages="endDateError"
        :minDate="form.startDate"
        dense
        hideDetails
        outlined
        type="datetime-local"
        :style="{ maxWidth: '300px' }"
        @blur="v$.form.endDate.$touch()"
      />
    </div>

    <app-crew-message
      v-if="!!actualDriverCrew && !actualDriverCrew.endDate"
      text="У водителя есть открытая смена от"
      :visibleDate="actualDriverCrew.startDate"
      :date="form.startDate"
      :crew="actualDriverCrew"
      :invalid="v$.form.startDate.$invalid"
      type="crew"
      @clear-crew="clearActualCrew"
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
      @add-item="addItem"
      @edit-mode="changeEditModeStatus"
      @items-pop="deleteLastItemInTransport"
    />

    <v-text-field
      v-model="v$v$note.$model"
      label="Примечание"
      variant="outlined"
      density="compact"
      class="mt-6"
    />
    <div v-if="crew && crew.manager" class="pb-4 text-caption">
      Отв.пользователь: {{ crew.manager.name }},
      {{ crew.manager.email }}
      <br />
      Создан: {{ new Date(crew.createdAt).toLocaleString() }}
      <span v-if="crew.updatedAt">
        Обновлен: {{ new Date(crew.updatedAt).toLocaleString() }}
      </span>
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import dayjs from 'dayjs'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import { CrewService } from '@/shared/services'
import {
  ButtonsPanel,
  // AppDateTimeInput
} from '@/shared/ui'

import AppCrewMessage from './crewMessage'
// import AppTransportTable from './transportTable.vue'

export default defineComponent({
  name: 'CrewForm',
  components: {
    ButtonsPanel,
    // AppDateTimeInput,
    // AppTransportTable,
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
  setup() {
    const { v$, state: formState } = useCrewForm()
    return { v$, formState }
  },
  data() {
    return {
      crewId: null,
      loading: false,
      editTransportTable: false,
      crewEditable: false,
      actualDriverCrew: null,
      lastDriverCrew: null,
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
      if (!this.formState.tkName) return []
      else
        return this.$store.getters
          .driversForSelect(this.formState.tkName)
          .filter((d) => !d.dismissalDate)
    },
    allowUseTrailers() {
      return this.allowedToUseTrailersTrucksSet.has(this.formState.truck)
    },
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return (
        this.v$.$invalid || (this.allowUseTrailers && !this.formState.trailer)
      )
    },
    showTransportTable() {
      return (
        this.formState.driver &&
        this.formState.startDate &&
        !this.v$.startDate.$invalid &&
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

      return this.actualDriverCrew.transport.endDate
        ? this.actualDriverCrew.transport.endDate
        : this.actualDriverCrew.transport.startDate
    },
    startDateError() {
      const errors = []
      if (this.v$.startDate.$dirty && !this.v$.startDate.required)
        errors.push('Поле не может быть пустым')
      if (this.v$.startDate.$dirty && !this.v$.startDate.isLaterThan) {
        const dateStr = dayjs(this.v$.startDate.$params.isLaterThan.eq).format(
          'DD.MM.YYYY HH:mm'
        )
        errors.push(`Дата должна быть больше ${dateStr}`)
      }
      return errors
    },
    endDateError() {
      const errors = []
      if (!this.v$.endDate.isLaterThan)
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
        this.actualDriverCrew = null
        this.formState.transport = []
        if (val) {
          this.actualDriverCrew = await CrewService.getActualCrewByDriver(val)
        }
      },
    },
  },

  methods: {
    clearActualCrew() {
      this.actualDriverCrew = null
    },
    deleteLastItemInTransport() {
      this.crewEditable = false
      this.formState.transport.pop()
    },
    changeEditModeStatus(val) {
      this.editTransportTable = val
    },
    addItem(val) {
      const idx = this.formState.transport.length - 1
      if (idx >= 0 && !this.formState.transport[idx].endDate) {
        this.formState.transport[idx].endDate = val.startDate
        this.formState.transport[idx].updated = true
      }
      this.formState.transport.push(val)
    },
    tkNameChange() {
      this.formState.driver = null
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
      this.formState.tkName = val.tkName?._id || val.tkName
      this.formState.transport = val.transport
      this.formState.driver = val.driver?._id || val.driver
      this.formState.startDate = val.startDate || new Date().toISOString()
      this.formState.endDate = val.endDate
      this.formState.note = val.note
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = null
      })
      this.formState.transport = []
    },
  },
})
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
