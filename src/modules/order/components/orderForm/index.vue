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
          <div
            v-if="false"
            class="dates-position-block"
          >
            <div class="text-caption px-5 py-2">
              Период отображения рейса
            </div>
            <app-date-time-input
              v-model="form.startPositionDate"
              label="Дата начала"
              hideDetails
              readonly
            />
          </div>

          <app-route-state
            v-model="state"
            :enableConfirm="enableConfirmOrder"
            :routeCompleted="routeCompleted"
            :enableRefuse="enableRefuseOrder"
            title="Статус рейса"
            class="route-state"
          />
          <app-client-block
            v-model="client"
            title="Информация о клиенте"
            class="client"
          />
          <app-cargo-params
            v-model="cargoParams"
            title="Параметры груза"
            class="cargo-params"
          />

          <app-req-transport
            v-model="reqTransport"
            title="Требования к транспорту"
            class="req-transport"
          />

          <app-route-points
            v-model="preparedRoute"
            title="Маршрут"
            :confirmed="orderInProgress"
            class="route-points"
            :isValid="isValidRoute"
          />
          <app-confirmed-crew
            v-model="confirmedCrew"
            :date="form.startPositionDate"
            :confirmed="orderConfirmed"
            title="Экипаж"
            class="crew"
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
import AppClientBlock from './clientBlock.vue'

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
    AppClientBlock,
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
      client: {},
      cargoParams: {
        weight: null,
        places: null,
        note: null,
        tRegime: null,
      },
      state: {
        status: 'needGet',
      },
      route: [
        { type: 'loading', address: null, plannedDate: '', note: '' },
        { type: 'unloading', address: null, plannedDate: '', note: '' },
      ],
      reqTransport: {},
      confirmedCrew: {},
      form: {
        startPositionDate: null,
      },
    }
  },

  computed: {
    ...mapGetters(['directoriesProfile', 'myCompanies']),
    currentPointInd() {
      return this.route.findIndex((p) => !p.departureDate)
    },
    preparedRoute: {
      get: function () {
        return this.route.map((point, ind) => ({
          ...point,
          arrivalDateDisabled: this.isDisabledArrivalDate(ind),
          departureDateDisabled: this.isDisabledDepartureDate(ind),
          minArrivalDate: this.getMinArrivalDate(ind),
        }))
      },
      set: function (val) {
        this.route = val
      },
    },
    isInvalidForm() {
      return (
        !this.form.startPositionDate ||
        !this.isValidRoute ||
        !this.isValidClientInfo
      )
    },
    isValidDatesInRoute() {
      let dates = []
      this.route.forEach((p) => {
        if (p.arrivalDate) dates.push(new Date(p.arrivalDate))
        if (p.departureDate) dates.push(new Date(p.departureDate))
      })
      if (dates.length < 2) return true
      for (let i = 1; i < dates.length; i++) {
        if (dates[i] < dates[i - 1]) return false
      }
      return true
    },
    isValidRoute() {
      if (!this.route) return false
      const length = this.route.length >= 2
      const firstPoint = this.route[0].type === 'loading'
      const lastPoint = this.route[this.route.length - 1].type === 'unloading'
      const hasAddresses =
        this.route.filter((item) => !!item.address).length === this.route.length
      return (
        length &&
        firstPoint &&
        lastPoint &&
        hasAddresses &&
        this.isValidDatesInRoute
      )
    },
    isValidClientInfo() {
      return !!this.client?.client
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
    enableConfirmOrder() {
      return !!this.confirmedCrew.driver
    },
    enableRefuseOrder() {
      return !this.confirmedCrew.truck
    },
    orderConfirmed() {
      return this.state.driverNotified || this.state.clientNotified
    },
    orderInProgress() {
      return this.orderConfirmed && this.state.status === 'inProgress'
    },
    routeCompleted() {
      return this.route.filter((point) => !point.departureDate).length === 0
    },
    formState() {
      return {
        ...this.form,
        client: this.client,
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

  methods: {
    getMinArrivalDate(ind) {
      if (!ind) return null
      if (ind > 0 && !!this.route[ind - 1].departureDate)
        return this.route[ind - 1].departureDate
      return null
    },
    isDisabledArrivalDate(ind) {
      if (this.currentPointInd === ind && !!this.route[ind].departureDate)
        return true
      if (this.currentPointInd !== ind) return true
      return false
    },
    isDisabledDepartureDate(ind) {
      if (this.currentPointInd === ind && !this.route[ind].arrivalDate)
        return true
      if (this.currentPointInd !== -1 && !this.route[ind].arrivalDate)
        return true
      if (ind + 1 <= this.route.length - 1 && !!this.route[ind + 1].arrivalDate)
        return true
      return false
    },
    submit() {
      if (!this.directoriesProfile || this.isInvalidForm) return null
      this.$emit('submit', this.formState)
    },
    cancel() {
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      if (val.client) this.client = val.client
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
      this.client = { ...{} }
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
.wrapper {
  display: grid;
  align-content: start;
  justify-content: start;
  grid-template-columns: 1fr 4fr;
}
.route-state {
  grid-column: 1/2;
  grid-row: 1/5;
}
.client {
  grid-column: 2/3;
  grid-row: 1/2;
}
.req-transport {
  grid-column: 2/3;
  grid-row: 2/3;
}
.cargo-params {
  grid-column: 2/3;
  grid-row: 3/4;
}
.route-points {
  grid-column: 2/3;
  grid-row: 5/8;
}
.crew {
  grid-column: 2/3;
  grid-row: 4/5;
}
</style>
