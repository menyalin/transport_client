<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="top-panel">
          <app-buttons-panel
            :disabled-submit="disabledSubmitForm"
            panel-type="form"
            @cancel="cancel"
            @submit="submit"
          />
          <div class="template-panel">
            <v-autocomplete
              v-model="templateSelector"
              label="Заполнить из шаблона"
              clearable
              outlined
              :disabled="state.status !== 'needGet'"
              dense
              hide-details
              :items="$store.getters.orderTemplatesForSelect"
              :style="{ width: '350px' }"
            />
            <v-btn
              color="primary"
              :disabled="isInvalidForm || !!templateSelector"
              @click="templateDialog = true"
            >
              Создать шаблон
            </v-btn>
            <v-btn
              icon
              @click="copyTimestamptsToClipboard"
            >
              <v-icon>mdi-clock</v-icon>
            </v-btn>
            <v-btn
              v-if="showFinalPriceDialog"
              color="green"
              icon
              @click="openPriceDialog"
            >
              <v-icon>mdi-currency-usd</v-icon>
            </v-btn>
            <v-dialog
              v-model="templateDialog"
              persistent
              max-width="600"
            >
              <v-card>
                <v-card-title> Создать новый шаблон </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="templateName"
                    label="Название шаблона"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="cancelCreateTemplate">
                    Отмена
                  </v-btn>
                  <v-btn
                    color="secondary"
                    :disabled="!templateName"
                    :loading="createTemplateLoading"
                    @click="createTemplateHandler"
                  >
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>

        <v-alert
          v-if="!directoriesProfile"
          outlined
          class="ma-3 mb-5"
          type="error"
        >
          Профиль справочников не выбран, сохранение не возможно
        </v-alert>
        <div class="wrapper">
          <app-route-state
            v-model="state"
            :enableConfirm="enableConfirmOrder"
            :routeCompleted="routeCompleted"
            :enableRefuse="enableRefuseOrder"
            :isExistFirstArrivalDate="isExistFirstArrivalDate"
            :isValidGrade="isValidGrade"
            :readonly="disabledSubmitForm"
            title="Статус рейса"
            class="route-state"
          />
          <app-client-block
            v-model="client"
            title="Информация о клиенте"
            class="client"
            :routeDate="routeDate"
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

          <app-grade-block
            v-if="showGradeBlock"
            v-model="grade"
            :disabled="state.status === 'completed'"
            title="Оценка водителя"
            class="grade"
          />
          <app-route-points
            v-model="preparedRoute"
            title="Маршрут"
            :state="state"
            :confirmed="orderInProgress"
            class="route-points"
            :isValid="isValidRoute"
          />
          <app-confirmed-crew
            v-model="confirmedCrew"
            :date="dateForCrew"
            :confirmed="orderConfirmed"
            title="Экипаж"
            class="crew"
          />
          <app-analytic-block
            id="analytic"
            v-model="analytics"
            :isValidRoute="isValidRoute"
            :coords="coords"
            title="Аналитика"
          />
          <app-price-block
            id="price"
            :prices.sync="prices"
            :outsourceCosts.sync="outsourceCosts"
            :agreementId="client.agreement"
            :outsourceAgreementId="confirmedCrew.outsourceAgreement"
            :analytics="analytics"
            :route="route"
          />
          <app-price-dialog
            v-if="showFinalPriceDialog"
            :order="order"
            :agreementId="client.agreement"
            :prePrices.sync="prePrices"
            :finalPrices="finalPrices"
            :dialog.sync="priceDialog"
          />
          <div id="note">
            <v-text-field
              v-model="form.note"
              outlined
              label="Примечание"
              dense
            />
          </div>
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
import { mapGetters } from 'vuex'
import AgreementService from '@/modules/profile/services/agreement.service'
import OrderTemplateService from '@/modules/profile/services/orderTemplate.service'
import OrderService from '@/modules/order/services/order.service.js'

import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppCargoParams from './cargoParams.vue'
import AppRoutePoints from './routePoints.vue'
import AppReqTransport from './reqTransport.vue'
import AppRouteState from './routeState.vue'
import AppConfirmedCrew from './confirmedCrew/index.vue'
import AppClientBlock from './clientBlock.vue'
import AppGradeBlock from './gradeBlock.vue'
import AppAnalyticBlock from './analyticBlock.vue'
import AppPriceBlock from './priceBlock/index.vue'
import AppPriceDialog from './priceDialog'
import _putRouteDatesToClipboard from './_putRouteDatesToClipboard.js'

export default {
  name: 'OrderForm',
  components: {
    AppButtonsPanel,
    AppReqTransport,
    AppCargoParams,
    AppRoutePoints,
    AppRouteState,
    AppConfirmedCrew,
    AppClientBlock,
    AppGradeBlock,
    AppAnalyticBlock,
    AppPriceBlock,
    AppPriceDialog,
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
  provide() {
    return {
      updateFinalPrices: (val) => {
        this.finalPrices = [...val]
      },
      getOrderAgreement: async (val) => {
        if (!val && !this.client.agreement) return null
        const agreement = await AgreementService.getById(
          val || this.client.agreement
        )
        return agreement
      },
    }
  },
  data() {
    return {
      priceDialog: false,
      createTemplateLoading: false,
      templateDialog: false,
      templateName: null,
      templateSelector: null,
      loading: false,
      orderId: null,
      prePrices: [],
      prices: [],
      finalPrices: [],
      outsourceCosts: [],
      client: {
        client: null,
        agreement: null,
      },
      cargoParams: {
        weight: null,
        places: null,
        note: null,
        tRegime: null,
      },
      grade: {
        grade: null,
        note: null,
      },
      analytics: {},
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
        note: null,
      },
    }
  },

  computed: {
    ...mapGetters(['directoriesProfile', 'myCompanies']),
    showFinalPriceDialog() {
      return (
        !!this.$store.getters.hasPermission('readFinalPrices') &&
        !!this.client?.agreement &&
        !!this.order?._id &&
        !!this.isValidRoute
      )
    },
    disabledSubmitForm() {
      let hasPermission
      if (this.state.status === 'completed') {
        hasPermission = this.$store.getters.allowedPeriodForPermission({
          permission: 'order:daysForWrite',
          date: this.route[this.route.length - 1].departureDate,
        })
      } else
        hasPermission = this.$store.getters.hasPermission('order:daysForWrite')

      return this.isInvalidForm || this.loading || !hasPermission
    },
    currentPointInd() {
      return this.route.findIndex((p) => !p.departureDate)
    },
    routeDate() {
      return this.route[0].plannedDate
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
    dateForCrew() {
      if (this.route[0]?.plannedDate) return this.route[0]?.plannedDate
      return this.form.startPositionDate
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
    showGradeBlock() {
      return this.routeCompleted
    },
    isValidGrade() {
      if (!this.grade.grade) return false
      if (this.grade.grade === 2) return true
      else return !!this.grade.note
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
    enableConfirmOrder() {
      return !!this.confirmedCrew.driver
    },
    enableRefuseOrder() {
      return !this.confirmedCrew.truck && !!this.form.note
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
    isExistFirstArrivalDate() {
      return !!this.route[0]?.arrivalDate
    },
    addressMap() {
      return this.$store.getters.addressMap
    },
    coords() {
      let tmp = []
      this.route
        .filter((p) => !p.isReturn)
        .forEach((point) => {
          if (this.addressMap.has(point.address)) {
            tmp.push(
              this.addressMap
                .get(point.address)
                ?.geo.split(', ')
                .map((s) => parseFloat(s))
                .reverse()
            )
          }
        })
      return tmp
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
        grade: this.grade,
        analytics: this.analytics,
        prices: this.prices,
        prePrices: this.prePrices,
        outsourceCosts: this.outsourceCosts,
      }
    },
  },
  watch: {
    templateSelector(value) {
      if (!value) return null
      const template = this.$store.getters.orderTemplatesMap.get(value)
      if (!template) return null
      this.client = Object.assign({}, this.client, { client: template.client })
      this.reqTransport = Object.assign(
        {},
        this.reqTransport,
        template.reqTransport
      )
      const plannedDate = this.route[0].plannedDate
      this.analytics = { ...template.analytics }
      this.route = template.route
      this.route[0].plannedDate = plannedDate
      this.cargoParams = Object.assign(
        {},
        this.cargoParams,
        template.cargoParams
      )
    },
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
      handler: function (newRouteValue, oldVal) {
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
          // this.form.endPositionDate = this.getEndPositionDate(newRouteValue)
        }
        // проверяю изменились ли адреса в рейсе и если изменились, очищаю расстояния в аналитике
        if (
          this.isValidRoute &&
          newRouteValue.map((r) => r.address).join() !==
            oldVal.map((r) => r.address).join()
        ) {
          this.analytics.distanceDirect = 0
          this.analytics.distanceRoad = 0
        }
      },
    },
  },

  methods: {
    openPriceDialog() {
      this.priceDialog = true
    },
    copyTimestamptsToClipboard() {
      _putRouteDatesToClipboard(this.route)
    },
    async createTemplateHandler() {
      try {
        this.createTemplateLoading = true
        await OrderTemplateService.create(
          Object.assign({}, this.formState, {
            name: this.templateName,
            client: this.formState.client.client,
          })
        )
        this.createTemplateLoading = false
        this.templateName = null
        this.templateDialog = false
      } catch (e) {
        this.createTemplateLoading = false
        this.$store.commit('setError', e.message)
      }
    },
    cancelCreateTemplate() {
      this.templateDialog = false
      this.templateName = null
    },
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
    async submit() {
      if (!this.directoriesProfile || this.isInvalidForm) return null
      if (!this.analytics.distanceDirect)
        this.analytics.distanceDirect = OrderService.getDirectDistance(
          this.coords
        )
      if (!this.analytics.distanceRoad) {
        const { distanceRoad } = await OrderService.getDistance(this.coords)
        this.analytics.distanceRoad = distanceRoad
      }

      this.$emit('submit', this.formState)
    },
    cancel() {
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      if (val.grade) this.grade = val.grade
      if (val.client) this.client = val.client
      if (val.confirmedCrew) this.confirmedCrew = val.confirmedCrew
      if (val.state) this.state = val.state
      if (val.route) this.route = val.route
      if (val.cargoParams) this.cargoParams = val.cargoParams
      if (val.reqTransport) this.reqTransport = val.reqTransport
      if (val.analytics) this.analytics = val.analytics
      if (val.prices) this.prices = val.prices
      if (val.prePrices) this.prePrices = val.prePrices
      if (val.outsourceCosts) this.outsourceCosts = val.outsourceCosts
      if (val.finalPrices) this.finalPrices = val.finalPrices

      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      this.route = []
      this.grade = { ...{} }
      this.client = { ...{} }
      this.confirmedCrew = { ...{} }
      this.state = { ...{} }
      this.cargoParams = { ...{} }
      this.reqTransport = { ...{} }
      this.analytics = { ...{} }
      this.prices = []
      this.prePrices = []
      this.finalPrices = []
      this.outsourceCosts = []
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style scoped>
.top-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.template-panel {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
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
  gap: 10px;
}
.route-state {
  grid-column: 1/2;
  grid-row: 1/5;
}

.grade {
  grid-column: 1/2;
  grid-row: 5;
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
  grid-column: 2/4;
  grid-row: 5/8;
}
.crew {
  grid-column: 2/4;
  grid-row: 4/5;
}
#analytic {
  grid-column: 3/4;
  grid-row: 1/2;
}
#price {
  grid-column: 3/4;
  grid-row: 2/4;
}
#note {
  grid-column: 2/4;
  grid-row: 8/8;
}
</style>
