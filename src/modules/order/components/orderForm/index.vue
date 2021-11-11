<template>
  <v-container>
    <v-row>
      <v-col>
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

          <app-route-state
            v-model="state"
            title="Статус рейса"
          />

          <app-cargo-params
            v-model="cargoParams"
            title="Параметры груза"
          />

          <app-req-transport
            v-model="reqTransport"
            title="Требования к транспорту"
          />

          <app-route-points
            v-model="route"
            title="Маршрут"
          />
          <app-confirmed-crew
            v-model="confirmedCrew"
            title="Экипаж"
          />
        </div>
        <v-btn
          v-if="displayDeleteBtn"
          color="error"
          class="ma-4"
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppCargoParams from './cargoParams.vue'
import AppRoutePoints from './routePoints.vue'
import AppReqTransport from './reqTransport.vue'
import AppRouteState from './routeState.vue'
import AppConfirmedCrew from './confirmedCrew.vue'

import { required, numeric } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppReqTransport,
    AppCargoParams,
    AppRoutePoints,
    AppRouteState,
    AppConfirmedCrew,
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
      cargoParams: {
        weight: null,
        places: null,
        note: null,
        tRegime: null,
      },
      state: {},
      route: [
        { type: 'loading', address: null, plannedDate: '', note: '' },
        { type: 'unloading', address: null, plannedDate: '', note: '' },
      ],
      reqTransport: {},
      confirmedCrew: {},
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
    formState() {
      return {
        ...this.form,
        state: this.state,
        route: this.route,
        company: this.directoriesProfile,
        cargoParams: this.cargoParams,
        reqTransport: this.reqTransport,
        confirmedCrew: this.confirmedCrew,
      }
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
    route: {
      // редактирование маршрута
      deep: true,
      handler: function (newRouteValue) {
        // при создании рейса
        if (
          // !this.orderId &&
          newRouteValue &&
          Array.isArray(newRouteValue) &&
          newRouteValue.length
        ) {
          const firstPoint = newRouteValue[0]
          if (!this.orderId)
            this.form.startPositionDate = firstPoint.plannedDate
          this.form.endPositionDate = this.getEndPositionDate(newRouteValue)
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
      this.$emit('submit', this.formState)
    },
    cancel() {
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      if (val.confirmedCrew) this.confirmedCrew = val.confirmedCrew
      if (val.state) this.state = val.state
      if (val.route) this.route = val.route
      if (val.cargoParams) this.cargoParams = val.cargoParams
      if (val.reqTransport) this.reqTransport = val.reqTransport
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      this.route = []
      this.confirmedCrew = { ...{} }
      this.state = { ...{} }
      this.cargoParams = { ...{} }
      this.reqTransport = { ...{} }
      keys.forEach((key) => {
        this.form[key] = null
      })
    },

    getEndPositionDate(route) {
      let dates = []
      const dateFields = ['plannedDate', 'arrivalDate', 'departureDate']
      dateFields.forEach((field) => {
        dates.push(
          route
            .filter((i) => i[field])
            .map((i) => i[field])
            .reverse()[0]
        )
      })
      return dates.sort((a, b) => new Date(b) - new Date(a))[0]
    },
  },
}
</script>
<style scoped>
.dates-position-block {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 10px;
}
.dates-position-block > div {
  padding: 0px 15px;
}
</style>
