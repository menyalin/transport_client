<template>
  <FormWrapper>
    <ButtonsPanel
      panelType="form"
      submitTitle="Загрузить"
      :disabledSubmit="disabledSubmitBtn"
      @submit="submitHandler"
      @cancel="cancelHandler"
    >
      <v-btn class="mx-2" @click="refetchHandler">Обновить</v-btn>
      <v-btn class="mx-2" @click="clearUploadedOrders">Очистить</v-btn>
    </ButtonsPanel>
    <XlsxFileInput label="Выберите файл с реестром" @change="uploadHandler" />

    <UploadedInfo
      :items="uploadedOrders"
      :errors="errors"
      :totalPickedSum="totalPickedSum"
    />
    <CompareItemsTable :items="compareItems" />
  </FormWrapper>
</template>

<script>
import { PaymentInvoiceService } from '@/shared/services'
import { FormWrapper, ButtonsPanel } from '@/shared/ui'
import { XlsxFileInput } from '@/shared/ui/index'
import {
  ParsedOrderDTO,
  usePageData,
  CompareItem,
} from './cherkizovoLoader.model'
import UploadedInfo from './uploadedInfo.vue'
import CompareItemsTable from './compareItemsTable.vue'
import dayjs from 'dayjs'

export default {
  name: 'CherkizovoInvoiceLoaderPage',
  props: {
    id: String,
  },
  components: {
    FormWrapper,
    ButtonsPanel,
    XlsxFileInput,
    UploadedInfo,
    CompareItemsTable,
  },
  data() {
    return {
      uploadedOrders: [],
      errors: [],
      pickedOrders: [],
      compareItems: [],
    }
  },
  setup() {
    const { pickOrdersByClientNumbers, getCompareItems } = usePageData()
    return { pickOrdersByClientNumbers, getCompareItems }
  },
  mounted() {
    if (sessionStorage.getItem(this.id)) {
      this.uploadedOrders = JSON.parse(sessionStorage.getItem(this.id))?.map(
        (i) => new ParsedOrderDTO(i)
      )
      this.pickOrders()
    }
  },

  computed: {
    disabledSubmitBtn() {
      return this.compareItems.filter((i) => i.isOrderPicked).length === 0
    },
    totalPickedSum() {
      return this.pickedOrders.reduce(
        (sum, order) => (sum += order.total?.price),
        0
      )
    },
    orderNumbers() {
      return this.uploadedOrders.map((i) => i.num)
    },
    queryPeriod() {
      const date = this.$route.query.invoiceDate
      if (!date || !dayjs(date).isValid()) return null
      return [
        dayjs(date).add(-1, 'YEAR').toISOString(),
        dayjs(date).endOf('day').toISOString(),
      ]
    },

    pickOrdersQueryParams() {
      return {
        company: this.$store.getters.directoriesProfile,
        paymentInvoiceId: this.id,
        period: this.queryPeriod,
        client: this.$route.query.client,
        agreement: this.$route.query.agreement,
        numbers: this.orderNumbers,
      }
    },
    pickedOrderIds() {
      if (this.pickedOrders.length === 0) return []
      return this.compareItems.filter((i) => i.isOrderPicked).map((i) => i._id)
    },
  },

  methods: {
    clearHandler() {
      this.clearUploadedOrders()
    },
    clearUploadedOrders() {
      this.pickedOrders = []
      this.compareItems = []
      this.uploadedOrders = []
      this.errors = []
      sessionStorage.removeItem(this.id)
    },
    async submitHandler() {
      if (this.pickedOrderIds.length === 0) return
      try {
        await PaymentInvoiceService.addOrdersToPaymentInvoice({
          company: this.$store.getters.directoriesProfile,
          paymentInvoiceId: this.id,
          orders: this.pickedOrderIds,
          registryData: this.compareItems
            .filter((i) => i.isOrderPicked)
            .map((i) => i.exportData()),
        })
        this.clearHandler()
        this.$router.replace({
          name: 'PaymentInvoiceDetail',
          params: { id: this.id },
        })
      } catch (e) {
        this.$store.commit('setError', e.message)
      }
    },
    cancelHandler() {
      if (window.history.length > 2) this.$router.back()
      else
        this.$router.replace({
          name: 'PaymentInvoiceDetail',
          params: { id: this.id },
        })
    },

    async pickOrders() {
      this.pickedOrders = await this.pickOrdersByClientNumbers(
        this.pickOrdersQueryParams
      )
      this.compareItems = CompareItem.createEntities(
        this.uploadedOrders,
        this.pickedOrders
      )
    },

    async refetchHandler() {
      if (this.uploadedOrders.length > 0) this.pickOrders()
    },

    async uploadHandler(uploadData) {
      if (!uploadData || !uploadData.length) {
        this.clearUploadedOrders()
        return
      }
      try {
        this.errors = []
        this.uploadedOrders = Object.assign(
          [],
          uploadData.map((i) => new ParsedOrderDTO(i))
        )
        sessionStorage.setItem(this.id, JSON.stringify(this.uploadedOrders))
        this.pickOrders()
      } catch (e) {
        this.errors.push(e)
      }
    },
  },
}
</script>
<style scoped></style>
