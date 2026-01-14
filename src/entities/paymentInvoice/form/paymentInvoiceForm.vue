<template>
  <div>
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <download-doc-template-menu
        :templates="docTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        @downloadTemplate="downloadHandler"
      />
      <download-doc-template-menu
        :templates="newDocTemplates"
        :disabledDownloadFiles="disabledDownloadFiles"
        @downloadTemplate="newDownloadHandler"
        class="mx-3"
      />
      <v-btn
        v-if="showLoaderBtn"
        class="mx-3"
        @click="goToLoader"
        color="primary"
      >
        Загрузить из реестра
      </v-btn>
      <span v-else-if="loaderPath" class="text-caption mx-3">
        Для использования загрузчика необходимо очистить список рейсов.
      </span>
    </buttons-panel>
    <div id="form">
      <div class="fields-row">
        <v-autocomplete
          v-model="state.client"
          label="Клиент"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="disabledMainFields"
          :items="clientItems"
          @blur="v$.client.$touch"
          :error-messages="clientErrorMessages"
          @change="changeClientHandler"
          :style="{ minWidth: '400px' }"
        />
        <v-autocomplete
          v-model="state.agreement"
          label="Соглашение"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="!state.client || disabledMainFields"
          :items="agreementItems"
          @blur="v$.client.$touch"
          :error-messages="agreementErrorMessages"
          @change="changeAgreementHandler"
          :style="{ minWidth: '400px' }"
        />

        <v-select
          label="Статус"
          v-model="state.status"
          :items="statusItems"
          dense
          outlined
          @change="changeStatusHandler"
        />
        <v-btn
          v-if="showSendInvoiceBtn"
          color="primary"
          @click="sendInvoiceBtnHandler('sendDate')"
        >
          Отправлено клиенту
        </v-btn>
        <v-btn
          v-if="showAcceptedInvoiceBtn"
          color="primary"
          @click="acceptInvoiceBtnHandler"
        >
          Принято клиентом
        </v-btn>
        <v-btn
          v-if="showPaidInvoiceBtn"
          color="primary"
          @click="paidInvoiceBtnHandler"
        >
          Оплачено
        </v-btn>
      </div>
      <div class="fields-row">
        <v-text-field
          label="Номер реестра клиента"
          v-model.trim="state.numberByClient"
          dense
          outlined
        />
        <DateTimeInput
          label="Дата реестра клиента"
          v-model="state.dateByClient"
          dense
          outlined
          type="date"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          label="Номер акта"
          v-model.trim="state.number"
          dense
          outlined
        />
        <DateTimeInput
          label="Дата акта"
          v-model="state.date"
          dense
          outlined
          type="date"
          :disabled="isActDateDisabled"
        />
      </div>

      <div class="fields-row">
        <DateTimeInput
          readonly
          label="Дата отправки"
          v-model="state.sendDate"
          dense
          outlined
          type="date"
        />
        <DateTimeInput
          label="Плановая дата оплаты"
          v-model="state.plannedPayDate"
          dense
          outlined
          type="date"
        />
        <DateTimeInput
          readonly
          label="Дата оплаты"
          v-model="state.payDate"
          dense
          outlined
          type="date"
        />
      </div>

      <v-alert v-if="isNeedSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-dialog v-model="showDateDialog" persistent max-width="400">
        <v-card>
          <v-card-title>{{ dateDialogTitle }}</v-card-title>
          <v-card-text>
            <DateTimeInput
              label="Укажите дату"
              v-model="dialogFieldData"
              type="date"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="cancelDialog">Отмена</v-btn>
            <v-btn
              @click="saveDialogDataHandler"
              color="primary"
              :disabled="!dialogFieldData"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="
          disabledPickOrders || isNeedSave || invalidForm || !isInProcess
        "
      >
        Подобрать рейсы
      </v-btn>
      <v-text-field
        v-model="state.note"
        label="Примечание"
        dense
        outlined
        @blur="v$.note.$touch"
        hide-details
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { computed, watch, ref } from 'vue'
import router from '@/router'
import store from '@/store'
import { paymentInvoiceStatuses } from '@/shared/constants'
import {
  ButtonsPanel,
  DownloadDocTemplateMenu,
  DateTimeInput,
} from '@/shared/ui'
import usePaymentInvoiceForm from './usePaymentInvoiceForm.js'
import { usePaymentInvoiceDocTemplates } from './usePaymentInvoiceDocTemplates.js'

export default {
  name: 'PaymentInvoiceForm',
  components: {
    ButtonsPanel,
    DownloadDocTemplateMenu,
    DateTimeInput,
  },
  props: {
    item: Object,
    disabledPickOrders: {
      type: Boolean,
    },
    disabledMainFields: {
      type: Boolean,
    },
    disabledDownloadFiles: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const showPickOrderDialog = ref(true)

    const {
      v$,
      state,
      invalidForm,
      clientErrorMessages,
      agreementErrorMessages,
      agreementItems,
      changeClientHandler,
      setFormState,
      loaderPath,
      showSendInvoiceBtn,
      sendInvoiceBtnHandler,
      showDateDialog,
      dateDialogTitle,
      cancelDialog,
      dialogFieldData,
      saveDialogDataHandler,
      changeStatusHandler,
      showAcceptedInvoiceBtn,
      acceptInvoiceBtnHandler,
      showPaidInvoiceBtn,
      paidInvoiceBtnHandler,
      isActDateDisabled,
    } = usePaymentInvoiceForm(props.item, ctx)

    const {
      docTemplates,
      newDocTemplates,
      newDownloadHandler,
      updatePrintForms,
    } = usePaymentInvoiceDocTemplates(state, props)

    const showLoaderBtn = computed(() => {
      if (props.item?.ordersCount > 0) return false
      return (
        !!loaderPath.value && !props.disabledPickOrders && !invalidForm.value
      )
    })
    const isInProcess = computed(() => state.value.status === 'inProcess')

    function cancelHandler() {
      router.go(-1)
    }
    function changeAgreementHandler(val) {
      if (val) updatePrintForms()
    }
    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }

    function submitHandler() {
      ctx.emit('submit', formState.value)
    }

    function saveHandler() {
      ctx.emit('save', formState.value)
    }

    function downloadHandler(filename) {
      ctx.emit('download', filename)
    }

    const clientItems = computed(
      () => store.getters?.partners.filter((i) => i.isClient) || []
    )
    const isPaid = computed(() => props.item?.status === 'paid')
    const hasOrders = computed(() => (props.item.ordersCount || 0) > 0)

    const statusItems = computed(() =>
      paymentInvoiceStatuses.map((i) => ({
        ...i,
        disabled:
          (isPaid.value && !['accepted'].includes(i.value)) ||
          (['sended', 'accepted', 'paid'].includes(i.value) && !isPaid.value) ||
          (i.value === 'prepared' && !hasOrders.value),
      }))
    )

    const isNeedSave = computed(() => {
      return (
        !props.item?._id ||
        state?.value.client !== props.item.client ||
        state?.value.agreement !== props.item.agreementId
      )
    })

    const formState = computed(() => {
      return {
        ...state.value,
        date: state.value.date ? dayjs(state.value.date).format() : null,
      }
    })
    watch(
      () => props.item,
      () => {
        setFormState(props.item)
      },
      { immediate: true }
    )
    return {
      v$,
      cancelHandler,
      clientItems,
      statusItems,
      state,
      invalidForm,
      clientErrorMessages,
      submitHandler,
      saveHandler,
      agreementErrorMessages,
      pickOrdersHandler,
      isNeedSave,
      changeClientHandler,
      showPickOrderDialog,
      downloadHandler,
      agreementItems,
      docTemplates,
      loaderPath,
      newDocTemplates,
      newDownloadHandler,
      showLoaderBtn,
      showSendInvoiceBtn,
      sendInvoiceBtnHandler,
      showDateDialog,
      dateDialogTitle,
      cancelDialog,
      dialogFieldData,
      saveDialogDataHandler,
      isInProcess,
      changeStatusHandler,
      changeAgreementHandler,
      showAcceptedInvoiceBtn,
      acceptInvoiceBtnHandler,
      showPaidInvoiceBtn,
      paidInvoiceBtnHandler,
      isActDateDisabled,
    }
  },
  methods: {
    goToLoader() {
      if (!this.item._id || !this.loaderPath) return
      this.$router.replace({
        path: this.$route.path + '/' + this.loaderPath,
        query: {
          invoiceDate: this.state.date,
          client: this.state.client,
          agreement: this.state.agreement,
        },
      })
    },
  },
}
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
}
.fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
}
.fields-row > div {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: content;
  min-width: 250px;
}
</style>
