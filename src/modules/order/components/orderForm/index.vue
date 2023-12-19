<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="top-panel">
          <buttons-panel
            :disabled-submit="disabledSubmitForm"
            show-save-btn
            panel-type="form"
            @cancel="cancel"
            @submit="submit($event)"
            @save="submit($event, true)"
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
            <v-btn icon @click="copyTimestamptsToClipboard">
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

            <v-dialog v-model="templateDialog" persistent max-width="600">
              <v-card>
                <v-card-title> Создать новый шаблон </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="templateName"
                    label="Название шаблона"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="cancelCreateTemplate"> Отмена </v-btn>
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
          <ClientBlock
            v-model="client"
            title="Информация о клиенте"
            class="client"
            :carrier="confirmedCrew.tkName"
            :isValidNum="isValidClientNum(agreement, client, state)"
            :isValidAuctionNum="isValidAuctionNum(agreement, client, state)"
            :routeDate="routeDate"
            @updateAgreement="updateAgreementHandler"
          />
          <CargoParams
            v-model="cargoParams"
            title="Параметры груза"
            class="cargo-params"
          />

          <ReqTransport
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
            :driverId="confirmedCrew.driver"
            title="Маршрут"
            :state="state"
            :cargoParams="cargoParams"
            :agreement="agreement"
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

          <div id="price">
            <payment-invoice-links :items="form.paymentInvoices" />
            <app-analytic-block
              v-model="analytics"
              :isValidRoute="isValidRoute"
              :coords="coords"
              title="Аналитика"
            />

            <app-payment-to-driver
              v-if="$store.getters.hasPermission('order:readPaymentToDriver')"
              id="payment-to-driver"
              v-model="paymentToDriver"
            />

            <app-price-block
              :isValidPrices="isValidPrices(agreement, prices, state)"
              :prices.sync="prices"
              :prePrices="prePrices"
              :outsourceCosts.sync="outsourceCosts"
              :agreement="agreement"
              :outsourceAgreementId="confirmedCrew.outsourceAgreement"
              :analytics="analytics"
              :route="route"
            />

            <app-price-dialog
              v-if="showFinalPriceDialog"
              :order="order"
              :agreement="agreement"
              :prePrices.sync="prePrices"
              :finalPrices="finalPrices"
              :dialog.sync="priceDialog"
            />
          </div>

          <div id="note">
            <v-text-field
              v-model="form.note"
              outlined
              label="Примечание"
              dense
            />
            <v-text-field
              v-model="form.noteAccountant"
              outlined
              label="Примечание для бухгалтера"
              dense
            />
          </div>

          <order-docs-list-form
            v-if="isShowDocs"
            id="docs"
            v-model="docs"
            title="Документы"
            :isValid="isValidDocs(docs)"
            :readonly="isReadonlyDocs"
          >
            <docs-registry-link :docsRegistry="form.docsRegistry" />
          </order-docs-list-form>

          <order-payment-parts
            v-if="routeDate"
            id="payment-parts"
            v-model="form.paymentParts"
            :routeDate="routeDate"
          />
        </div>
        <v-btn
          v-if="displayDeleteBtn"
          color="error"
          class="ma-4"
          @click="$emit('delete')"
        >
          <v-icon left dark> mdi-delete </v-icon>
          Удалить
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { OrderService, OrderTemplateService } from '@/shared/services'

import { ButtonsPanel } from '@/shared/ui'
import AppRoutePoints from './routePoints.vue'

import AppRouteState from './routeState.vue'
import AppConfirmedCrew from './confirmedCrew/index.vue'

import AppGradeBlock from './gradeBlock.vue'
import AppAnalyticBlock from './analyticBlock.vue'
import AppPriceBlock from './priceBlock/index.vue'
import AppPriceDialog from './priceDialog'
// TODO: Перенсти в OrderModel
import _putRouteDatesToClipboard from './_putRouteDatesToClipboard.js'
import {
  DocsRegistryLink,
  OrderDocsListForm,
  OrderPaymentParts,
  PaymentInvoiceLinks,
  ReqTransport,
  CargoParams,
  OrderModel,
  useOrderDocs,
  ClientBlock,
} from '@/entities/order'
import { useOrderValidations } from '../../hooks/useOrderValidations.js'
import AppPaymentToDriver from './paymentToDriver.vue'

export default {
  name: 'OrderForm',
  components: {
    PaymentInvoiceLinks,
    ButtonsPanel,
    ReqTransport,
    CargoParams,
    AppRoutePoints,
    AppRouteState,
    AppConfirmedCrew,
    ClientBlock,
    AppGradeBlock,
    AppAnalyticBlock,
    AppPriceBlock,
    AppPriceDialog,
    OrderDocsListForm,
    DocsRegistryLink,
    AppPaymentToDriver,
    OrderPaymentParts,
  },
  props: {
    order: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
  },
  provide() {
    return {
      updateFinalPrices: (val) => {
        this.finalPrices = [...val]
      },
    }
  },
  setup() {
    const { isValidDocs, isReadonlyDocs, isShowDocs } = useOrderDocs()
    const { isValidPrices, isValidClientNum, isValidAuctionNum } =
      useOrderValidations()

    return {
      isValidDocs,
      isReadonlyDocs,
      isShowDocs,
      isValidPrices,
      isValidClientNum,
      isValidAuctionNum,
    }
  },
  data() {
    return {
      processingBeforeSubmit: false,
      agreement: null,
      docs: [],
      paymentToDriver: {},
      priceDialog: false,
      createTemplateLoading: false,
      templateDialog: false,
      templateName: null,
      templateSelector: null,
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
        noteAccountant: null,
        docsRegistry: null,
        paymentParts: [],
        paymentInvoices: [],
      },
    }
  },

  computed: {
    showFinalPriceDialog() {
      return (
        !!this.$store.getters.hasPermission('order:readFinalPrices') &&
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

      return (
        this.processingBeforeSubmit ||
        this.isInvalidForm ||
        this.loading ||
        !hasPermission
      )
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
        !this.isValidDocs(this.docs) ||
        !this.isValidPrices(this.agreement, this.prices, this.state) ||
        !this.isValidClientNum(this.agreement, this.client, this.state) ||
        !this.isValidAuctionNum(this.agreement, this.client, this.state) ||
        !this.isValidClientInfo ||
        !this.reqTransport.kind ||
        !this.reqTransport.liftCapacity
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
        company: this.$store.getters.directoriesProfile,
        cargoParams: this.cargoParams,
        reqTransport: this.reqTransport,
        confirmedCrew: this.confirmedCrew,
        grade: this.grade,
        analytics: this.analytics,
        prices: this.prices,
        prePrices: this.prePrices,
        outsourceCosts: this.outsourceCosts,
        docs: this.docs,
        paymentToDriver: this.paymentToDriver,
        isAdmin: this.$store.getters.hasPermission(
          'fake permission. for admin only'
        )
          ? true
          : null,
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
      const plannedDate = this.route[0]?.plannedDate
      this.analytics = { ...template.analytics }
      this.route = OrderModel.fillRouteFromTemplate(template, plannedDate)
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
        // при изменении маршрута определяется тип рейса город / регион
        if (this.isValidRoute) this.updateOrderType()
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
    updateAgreementHandler(agreement) {
      this.agreement = Object.assign({}, agreement)
    },

    updateOrderType() {
      const regions = this.route
        .map((i) =>
          i.address
            ? this.$store.getters.addressMap.get(i.address)?.region
            : null
        )
        .filter((i) => !!i)
      this.$nextTick(() => {
        this.analytics.type = new Set(regions).size >= 2 ? 'region' : 'city'
      })
    },

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
    updatePricesUseAgreement(prices, agreement) {
      if (!Array.isArray(prices) || prices.length === 0) return []
      const vatKoef = agreement.vatRate / 100
      const updatedPrices = []
      prices.forEach((item) => {
        updatedPrices.push({
          ...item,
          sumVat: item.priceWOVat * vatKoef,
          price: item.priceWOVat * (1 + vatKoef),
        })
      })
      return updatedPrices
    },

    async submit(_val, saveOnly) {
      if (this.isInvalidForm) return null
      this.processingBeforeSubmit = true
      if (!this.analytics.distanceDirect)
        this.analytics.distanceDirect = OrderService.getDirectDistance(
          this.coords
        )
      if (!this.analytics.distanceRoad) {
        const { distanceRoad } = await OrderService.getDistance(this.coords)
        this.analytics.distanceRoad = distanceRoad
      }

      this.prePrices = this.updatePricesUseAgreement(
        this.prePrices,
        this.agreement
      )
      this.prices = this.updatePricesUseAgreement(this.prices, this.agreement)
      this.finalPrices = this.updatePricesUseAgreement(
        this.finalPrices,
        this.agreement
      )

      this.processingBeforeSubmit = false
      this.$emit(saveOnly ? 'save' : 'submit', this.formState)
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
      if (val.docs) this.docs = val.docs
      if (val.paymentToDriver) this.paymentToDriver = val.paymentToDriver

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
      this.paymentToDriver = { ...{} }
      this.prices = []
      this.prePrices = []
      this.finalPrices = []
      this.outsourceCosts = []

      this.docs = []
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
  justify-content: flex-start;
  grid-template-columns: 1fr 4fr;
  gap: 1px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  grid-column: 3/4;
  grid-row: 1/4;
}
#note {
  grid-column: 2/4;
  grid-row: 8/8;
  margin-top: 10px;
}
#docs {
  grid-column: 2/4;
  grid-row: 9/9;
}

#payment-parts {
  grid-column: 2/4;
  grid-row: 10/10;
}
</style>
