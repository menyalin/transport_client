<template>
  <div class="top-panel">
    <buttons-panel
      :disabled-submit="disabledSubmitForm"
      show-save-btn
      panel-type="form"
      @cancel="cancel"
      @submit="submit($event)"
      @save="submit($event, true)"
    >
      <DownloadDocTemplateMenu
        v-if="docTemplateIsVisible"
        :templates="templates"
        :disabledDownloadFiles="downloadDisabled"
        @downloadTemplate="downloadTemplateHandler"
      />
      <PaymentInvoiceLinks :items="form.paymentInvoices" />
    </buttons-panel>
    <div class="template-panel">
      <v-autocomplete
        v-model="templateSelector"
        label="Заполнить из шаблона"
        :disabled="state.status !== 'needGet'"
        hide-details
        :items="orderTemplatesForSelect"
        :style="{ width: '350px' }"
      />
      <v-btn :disabled="isInvalidForm || !!templateSelector" @click="templateDialog = true">
        Создать шаблон
      </v-btn>
      <v-btn icon @click="copyTimestamptsToClipboard">
        <v-icon>mdi-clock</v-icon>
      </v-btn>
      <v-btn v-if="showFinalPriceDialog" color="green" icon @click="openPriceDialog">
        <v-icon>mdi-currency-usd</v-icon>
      </v-btn>

      <v-dialog v-model="templateDialog" persistent max-width="600">
        <v-card>
          <v-card-title> Создать новый шаблон </v-card-title>
          <v-card-text>
            <v-text-field v-model="templateName" label="Название шаблона" />
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
      :carrier="confirmedCrew.tkName || confirmedCrew.carrier"
      :isValidNum="isValidClientNum(agreement, client, state)"
      :isValidAuctionNum="isValidAuctionNum(agreement, client, state)"
      :orderConfirmed="orderConfirmed"
      :routeDate="routeDate"
      :agreementDisabled="hasPaymentInvoices"
      @updateAgreement="updateAgreement"
    />
    <CargoParams v-model="cargoParams" title="Параметры груза" class="cargo-params" />

    <ReqTransport v-model="reqTransport" title="Требования к транспорту" class="req-transport" />

    <app-grade-block
      v-if="showGradeBlock"
      v-model="grade"
      :disabled="state.status === 'completed'"
      title="Оценка водителя"
      class="grade"
    />
    <OrderRoute
      v-model="preparedRoute"
      :driverId="confirmedCrew.driver"
      title="Маршрут"
      :state="state"
      :cargoParams="cargoParams"
      :agreement="agreement"
      :confirmed="orderInProgress"
      :isValid="isValidRoute"
      class="route-points"
    />

    <ConfirmedCrew
      v-model="confirmedCrew"
      title="Экипаж"
      :date="dateForCrew"
      :confirmed="orderConfirmed"
      :hasIncomingInvoice="hasIncomingInvoice"
      :executorIdInClientAgreement="agreement ? agreement.executor : null"
      :carriersMap="carrierItemsMap"
      @update:model-value="changeCrewHandler"
      class="crew"
    />

    <div id="price">
      <app-analytic-block
        v-model="analytics"
        :isValidRoute="isValidRoute"
        :coords="coords"
        title="Аналитика"
      />

      <app-payment-to-driver
        v-if="showPaymentToDriver"
        id="payment-to-driver"
        v-model="paymentToDriver"
      />

      <PriceBlock
        :isValidPrices="isValidPrices(agreement, prices, state)"
        v-model:prices="prices"
        :prePrices="prePrices"
        v-model:outsourceCosts="outsourceCosts"
        :agreement="agreement"
        :clientVatRateInfo="client.vatRateInfo"
        :carrierVatRateInfo="carrierVatRateInfo"
        :carrierAgreement="carrierAgreement"
        :analytics="analytics"
        :route="route"
        :disabledInPaymentInvoice="disabledInPaymentInvoice"
        :hasIncomingInvoice="hasIncomingInvoice"
      >
        <IncomingInvoiceLink v-if="!!order" :invoice="order.incomingInvoice" />
      </PriceBlock>

      <FinalPriceDialog
        v-if="showFinalPriceDialog"
        :order="order"
        :readonly="disabledInPaymentInvoice"
        :agreement="agreement"
        :vatRateInfo="client.vatRateInfo"
        :prePrices="prePrices"
        :finalPrices="finalPrices"
        v-model:dialog="priceDialog"
      />
    </div>

    <div id="note">
      <v-text-field v-model="form.note" label="Примечание" />
      <v-text-field v-model="form.noteAccountant" label="Примечание для бухгалтера" />
    </div>
    <EntityFiles id="order-files" v-if="order && order._id" :itemId="order._id" docType="order" />
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
    <div id="transport-waybills">
      <slot name="transport_waybills" />
    </div>
  </div>

  <v-btn v-if="displayDeleteBtn" color="error" class="ma-4" @click="emit('delete')">
    <v-icon start> mdi-delete </v-icon>
    Удалить
  </v-btn>
</template>

<script setup>
import { computed, watch, provide, nextTick } from 'vue'
import { useStore } from 'vuex'
import { OrderService, OrderTemplateService } from '@/shared/services'
import { ButtonsPanel, DownloadDocTemplateMenu, EntityFiles } from '@/shared/ui'
import AppRouteState from './routeState.vue'
import ConfirmedCrew from './confirmedCrew/index.vue'
import AppGradeBlock from './gradeBlock.vue'
import AppAnalyticBlock from '@/entities/order/form/analyticBlock.vue'
import _putRouteDatesToClipboard from './_putRouteDatesToClipboard.js'

import {
  OrderRoute,
  DocsRegistryLink,
  OrderDocsListForm,
  PaymentInvoiceLinks,
  IncomingInvoiceLink,
  ReqTransport,
  CargoParams,
  OrderModel,
  useOrderDocs,
  ClientBlock,
  useOrderValidations,
  useOrderPrintForms,
  PriceBlock,
} from '@/entities/order'

import FinalPriceDialog from './finalPriceDialog/index.vue'
import AppPaymentToDriver from './paymentToDriver.vue'
import { useOrderForm } from './composables/useOrderForm'

defineOptions({ name: 'OrderForm' })

const props = defineProps({
  order: {
    type: Object,
    default: () => null,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  addressActions: {
    type: Object,
    default: () => ({}),
  },
  getCarrierAgreementById: {
    type: Function,
    required: true,
  },
  carrierItemsMap: {
    type: Map,
    required: true,
  },
})

const emit = defineEmits(['delete', 'cancel', 'save', 'submit', 'change'])
const vuexStore = useStore()

// Используем новый composable
const {
  processingBeforeSubmit,
  orderId,
  docs,
  paymentToDriver,
  priceDialog,
  createTemplateLoading,
  templateDialog,
  templateName,
  templateSelector,
  cargoParams,
  grade,
  analytics,
  state,
  reqTransport,
  confirmedCrew,
  form,
  route,
  routeDate,
  routeCompleted,
  isExistFirstArrivalDate,
  isValidRoute,
  preparedRoute,
  prices,
  prePrices,
  finalPrices,
  outsourceCosts,
  agreement,
  carrierAgreement,
  client,
  isValidClientInfo,
  hasIncomingInvoice,
  hasPaymentInvoices,
  disabledInPaymentInvoice,
  showPaymentToDriver,
  showFinalPriceDialog,
  disabledSubmitForm,
  dateForCrew,
  carrierVatRateInfo,
  isValidGrade,
  enableConfirmOrder,
  enableRefuseOrder,
  orderConfirmed,
  orderInProgress,
  showGradeBlock,
  coords,
  openPriceDialog,
  cancelCreateTemplate,
  changeCrewHandler,
  setFormFields,
  resetForm,
  updateAgreement,
  setRoute,
} = useOrderForm(props)

// Provide
provide('addressActions', props.addressActions)
provide('updateFinalPrices', (val) => {
  finalPrices.length = 0
  finalPrices.push(...val)
})

// Composables
const { templates, docTemplateIsVisible, downloadTemplateHandler, downloadDisabled } =
  useOrderPrintForms({ order: props.order })

const { isValidDocs, isReadonlyDocs, isShowDocs } = useOrderDocs()
const { isValidPrices, isValidClientNum, isValidAuctionNum } = useOrderValidations()

// Store getters as computed
const orderTemplatesForSelect = computed(() => vuexStore.getters.orderTemplatesForSelect)
const orderTemplatesMap = computed(() => vuexStore.getters.orderTemplatesMap)

// Additional computed
const isInvalidForm = computed(() => {
  return (
    !form.startPositionDate ||
    !isValidRoute.value ||
    !isValidDocs(docs.value) ||
    !isValidPrices(agreement.value, prices.value, state.value) ||
    !isValidClientNum(agreement.value, client.value, state.value) ||
    !isValidAuctionNum(agreement.value, client.value, state.value) ||
    !isValidClientInfo.value ||
    !reqTransport.value.kind ||
    !reqTransport.value.liftCapacity
  )
})

const formState = computed(() => ({
  ...form,
  client: client.value,
  state: state.value,
  route: route.value,
  company: vuexStore.getters.directoriesProfile,
  cargoParams: cargoParams.value,
  reqTransport: reqTransport.value,
  confirmedCrew: confirmedCrew.value,
  grade: grade.value,
  analytics: analytics.value,
  prices: prices.value,
  prePrices: prePrices.value,
  outsourceCosts: outsourceCosts.value,
  docs: docs.value,
  paymentToDriver: paymentToDriver.value,
  isAdmin: vuexStore.getters.hasPermission('fake permission. for admin only') ? true : null,
}))

// Methods
function updateOrderType() {
  const regions = route.value
    .map((i) => (i.address ? vuexStore.getters.addressMap.get(i.address)?.region : null))
    .filter((i) => !!i)
  nextTick(() => {
    analytics.value.type = new Set(regions).size >= 2 ? 'region' : 'city'
  })
}

function copyTimestamptsToClipboard() {
  _putRouteDatesToClipboard(route.value)
}

async function createTemplateHandler() {
  try {
    createTemplateLoading.value = true
    await OrderTemplateService.create({
      ...formState.value,
      name: templateName.value,
      client: formState.value.client.client,
    })
    createTemplateLoading.value = false
    templateName.value = null
    templateDialog.value = false
  } catch (e) {
    createTemplateLoading.value = false
    vuexStore.commit('setError', e.message)
  }
}

async function submit(_val, saveOnly) {
  if (isInvalidForm.value) return null
  processingBeforeSubmit.value = true
  if (!analytics.value.distanceDirect)
    analytics.value.distanceDirect = OrderService.getDirectDistance(coords.value)
  if (!analytics.value.distanceRoad) {
    const { distanceRoad } = await OrderService.getDistance(coords.value)
    analytics.value.distanceRoad = distanceRoad
  }

  processingBeforeSubmit.value = false
  emit(saveOnly ? 'save' : 'submit', formState.value)
}

function cancel() {
  emit('cancel')
}

// Expose для внешнего доступа
defineExpose({ resetForm })

// Watch
watch(templateSelector, (value) => {
  if (!value) return null
  const template = orderTemplatesMap.value.get(value)
  if (!template) return null
  client.value = { ...client.value, client: template.client }
  reqTransport.value = { ...reqTransport.value, ...template.reqTransport }
  const plannedDate = route.value[0]?.plannedDate
  analytics.value = { ...template.analytics }
  setRoute(OrderModel.fillRouteFromTemplate(template, plannedDate))
  cargoParams.value = { ...cargoParams.value, ...template.cargoParams }
})

watch(
  () => props.order,
  (val) => {
    if (val) {
      setFormFields(val)
    }
  },
  { immediate: true }
)

watch(
  route,
  (newRouteValue, oldVal) => {
    if (isValidRoute.value) updateOrderType()
    if (Array.isArray(newRouteValue) && newRouteValue.length) {
      const firstPoint = newRouteValue[0]
      if (!orderId.value) form.startPositionDate = firstPoint.plannedDate
    }
    if (
      isValidRoute.value &&
      newRouteValue.map((r) => r.address).join() !== oldVal.map((r) => r.address).join()
    ) {
      analytics.value.distanceDirect = 0
      analytics.value.distanceRoad = 0
    }
  },
  { deep: true }
)
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
  justify-content: flex-start;
  align-items: center;
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
  grid-template-columns: auto 1fr auto;
  gap: 15px;
  align-content: stretch;
}
.route-state {
  grid-column: 1/1;
  grid-row: 1/6;
}

.grade {
  grid-column: 1/2;
  grid-row: 6;
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
  grid-column: 2/3;
  grid-row: 8/8;
  margin-top: 10px;
}
#docs {
  grid-column: 2/3;
  grid-row: 9/9;
}

#order-files {
  grid-column: 2/3;
  grid-row: 10/10;
}
#transport-waybills {
  grid-column: 2/3;
  grid-row: 11/11;
}
</style>
