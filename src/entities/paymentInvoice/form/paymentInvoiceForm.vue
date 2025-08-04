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
          :style="{ minWidth: '400px' }"
        />

        <v-select
          label="Статус"
          v-model="state.status"
          :items="statusItems"
          dense
          outlined
        />
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
        <v-text-field
          label="Дата акта"
          v-model="state.date"
          dense
          outlined
          type="date"
          @paste="pasteDate"
        />
      </div>

      <div class="fields-row">
        <DateTimeInput
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
          label="Дата оплаты"
          v-model="state.payDate"
          dense
          outlined
          type="date"
        />
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="disabledPickOrders || needSave || invalidForm"
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
import { usePasteDateInput } from '@/modules/common/hooks/usePasteDateInput'

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
    const { pasteDate } = usePasteDateInput()
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
    } = usePaymentInvoiceForm(props.item, ctx)

    const { docTemplates, newDocTemplates, newDownloadHandler } =
      usePaymentInvoiceDocTemplates(state, props)

    const showLoaderBtn = computed(() => {
      if (Array.isArray(props.item.orders) && props.item.orders.length > 0)
        return false
      return (
        !!loaderPath.value && !props.disabledPickOrders && !invalidForm.value
      )
    })

    function cancelHandler() {
      router.go(-1)
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

    const statusItems = computed(() => paymentInvoiceStatuses)

    const needSave = computed(() => {
      return (
        state?.value.client !== props.item.client ||
        state?.value.agreement !== props.item.agreementId
      )
    })

    const formState = computed(() => {
      return {
        ...state.value,
        sendDate: state.value.sendDate
          ? dayjs(state.value.sendDate).format()
          : null,
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
      pasteDate,
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
      needSave,
      changeClientHandler,
      showPickOrderDialog,
      downloadHandler,
      agreementItems,
      docTemplates,
      loaderPath,
      newDocTemplates,
      newDownloadHandler,
      showLoaderBtn,
    }
  },
  methods: {
    goToLoader() {
      if (!this.item._id || !this.loaderPath) return
      this.$router.replace({
        path: this.$route.path + '/' + this.loaderPath,
        query: {
          invoiceDate: this.state.sendDate,
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
  flex-grow: 0; /* позволяют растягиваться */
  flex-shrink: 1; /* позволяют сжиматься */
  flex-basis: content; /* базовая ширина по содержимому */
  min-width: 250px;
}
</style>
