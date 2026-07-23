<template>
  <FormWrapper>
    <ButtonsPanel
      panel-type="form"
      submit-title="Загрузить"
      :disabled-submit="disabledSubmitBtn"
      @submit="submitHandler"
      @cancel="cancelHandler"
    >
      <v-btn class="mx-2" @click="refetchHandler">Обновить</v-btn>
      <v-btn class="mx-2" @click="clearUploadedOrders">Очистить</v-btn>
    </ButtonsPanel>
    <XlsxFileInput label="Выберите файл с реестром" @change="uploadHandler" />

    <UploadedInfo :items="uploadedOrders" :errors="errors" :totalPickedSum="totalPickedSum" />
    <CompareItemsTable :items="compareItems" />
  </FormWrapper>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { PaymentInvoiceService } from '@/shared/services'
import { FormWrapper, ButtonsPanel } from '@/shared/ui'
import { XlsxFileInput } from '@/shared/ui/index'
import { ParsedOrderDTO, usePageData, CompareItem } from './cherkizovoLoader.model'
import UploadedInfo from './uploadedInfo.vue'
import CompareItemsTable from './compareItemsTable.vue'

defineOptions({ name: 'CherkizovoInvoiceLoaderPage' })

const props = defineProps({
  id: String,
})

const route = useRoute()
const router = useRouter()
const store = useStore()

const { pickOrdersByClientNumbers } = usePageData()

const uploadedOrders = ref([])
const errors = ref([])
const pickedOrders = ref([])
const compareItems = ref([])

const disabledSubmitBtn = computed(() => {
  return compareItems.value.filter((i) => i.isOrderPicked).length === 0
})
const totalPickedSum = computed(() => {
  return pickedOrders.value.reduce((sum, order) => (sum += order.total?.price), 0)
})
const orderNumbers = computed(() => uploadedOrders.value.map((i) => i.num))
const queryPeriod = computed(() => {
  const date = route.query.invoiceDate
  if (!date || !dayjs(date).isValid()) return null
  return [dayjs(date).add(-1, 'YEAR').toISOString(), dayjs(date).endOf('day').toISOString()]
})

const pickOrdersQueryParams = computed(() => ({
  company: store.getters.directoriesProfile,
  paymentInvoiceId: props.id,
  period: queryPeriod.value,
  client: route.query.client,
  agreement: route.query.agreement,
  numbers: orderNumbers.value,
}))

const pickedOrderIds = computed(() => {
  if (pickedOrders.value.length === 0) return []
  return compareItems.value.filter((i) => i.isOrderPicked).map((i) => i._id)
})

onMounted(() => {
  if (sessionStorage.getItem(props.id)) {
    uploadedOrders.value = JSON.parse(sessionStorage.getItem(props.id))?.map(
      (i) => new ParsedOrderDTO(i)
    )
    pickOrders()
  }
})

function clearUploadedOrders() {
  pickedOrders.value = []
  compareItems.value = []
  uploadedOrders.value = []
  errors.value = []
  sessionStorage.removeItem(props.id)
}

async function submitHandler() {
  if (pickedOrderIds.value.length === 0) return
  try {
    await PaymentInvoiceService.addOrdersToPaymentInvoice({
      company: store.getters.directoriesProfile,
      paymentInvoiceId: props.id,
      orders: pickedOrderIds.value,
      registryData: compareItems.value.filter((i) => i.isOrderPicked).map((i) => i.exportData()),
    })
    clearUploadedOrders()
    router.replace({
      name: 'PaymentInvoiceDetail',
      params: { id: props.id },
    })
  } catch (e) {
    store.commit('setError', e.message)
  }
}

function cancelHandler() {
  if (window.history.length > 2) router.back()
  else
    router.replace({
      name: 'PaymentInvoiceDetail',
      params: { id: props.id },
    })
}

async function pickOrders() {
  pickedOrders.value = await pickOrdersByClientNumbers(pickOrdersQueryParams.value)
  compareItems.value = CompareItem.createEntities(uploadedOrders.value, pickedOrders.value)
}

async function refetchHandler() {
  if (uploadedOrders.value.length > 0) await pickOrders()
}

async function uploadHandler(uploadData) {
  if (!uploadData || !uploadData.length) {
    clearUploadedOrders()
    return
  }
  try {
    errors.value = []
    uploadedOrders.value = Object.assign(
      [],
      uploadData.map((i) => new ParsedOrderDTO(i))
    )
    sessionStorage.setItem(props.id, JSON.stringify(uploadedOrders.value))
    await pickOrders()
  } catch (e) {
    errors.value.push(e)
  }
}
</script>

<style scoped></style>
