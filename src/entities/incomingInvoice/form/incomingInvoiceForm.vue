<template>
  <div class="wrapper">
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <DownloadDocTemplateMenu
        v-if="docTemplateIsVisible"
        :templates="templates"
        :disabledDownloadFiles="downloadDisabled"
        @downloadTemplate="downloadTemplateHandler"
      />
    </buttons-panel>
    <div id="form">
      <div class="fields-row">
        <v-text-field
          label="Номер"
          v-model.trim="state.number"
          dense
          outlined
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          label="Дата документа"
          v-model="state.date"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <v-select
          label="Статус"
          v-model="state.status"
          :items="incomingInvoiceStatuses"
          dense
          outlined
          :disabled="!allowToChangeStatus"
          @change="statusChangeHandler"
          :style="{ maxWidth: '200px' }"
        />

        <v-autocomplete
          v-model="state.carrier"
          label="Перевозчик"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="disabledCarriers"
          :items="outsourceCarriers"
          :style="{ maxWidth: '300px' }"
          @change="carrierChangeHandler"
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
          :disabled="disabledAgreement || hasOrders"
          :items="carrierAgreements"
          :style="{ maxWidth: '300px' }"
        />
      </div>
      <div class="fields-row">
        <DateTimeInput
          label="Дата получения документа"
          v-model="state.receiptDate"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          label="Плановая дата оплаты"
          v-model="state.plannedPayDate"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          v-if="isVisiblePayDateField"
          label="Факт оплаты"
          v-model="state.payDate"
          dense
          outlined
          type="date"
          disabled
          :style="{ maxWidth: '250px' }"
        />
        <v-btn
          v-if="isVisiblePayInvoiceBtn"
          color="primary"
          @click="payInvoiceHandler"
        >
          Счет оплачен
        </v-btn>
      </div>
      <v-dialog v-model="payDateDialog" persistent max-width="400">
        <v-card>
          <v-card-title>Дата оплаты</v-card-title>
          <v-card-text>
            <DateTimeInput v-model="payDateFieldData" type="date" outlined />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="payDateDialog = false">Отмена</v-btn>
            <v-btn color="primary" @click="savePayDateHandler">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="
          disabledPickOrders ||
          needSave ||
          invalidForm ||
          !allowedToChangeOrders
        "
      >
        Подобрать рейсы
      </v-btn>
      <OrdersTable
        :invoiceId="item._id"
        :allowDeleteOrders="allowedToChangeOrders"
        class="ma-3"
      />
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
import { computed } from 'vue'
import { incomingInvoiceStatuses } from '../config.js'
import OrdersTable from './ordersTable/ordersTable.vue'
import { useForm } from './useForm.js'

import {
  ButtonsPanel,
  DownloadDocTemplateMenu,
  DateTimeInput,
} from '@/shared/ui'
import { useCarriers } from '@/entities/carrier/useCarriers.js'
import { usePrintForms } from './usePrintForms.js'

export default {
  name: 'IncomingInvoiceForm',
  components: {
    DateTimeInput,
    ButtonsPanel,
    DownloadDocTemplateMenu,
    OrdersTable,
  },
  props: {
    disabledPickOrders: Boolean,
    agreementItems: Array,
    readonly: Boolean,
    item: Object,
  },
  setup(props, ctx) {
    const {
      downloadDisabled,
      docTemplateIsVisible,
      templates,
      downloadTemplateHandler,
    } = usePrintForms(props)

    const { outsourceCarriers } = useCarriers()

    const hasOrders = computed(() => {
      return props.item?.orders?.length > 0
    })

    const {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      payInvoiceHandler,
      invalidForm,
      isVisiblePayDateField,
      allowedToChangeOrders,
      isVisiblePayInvoiceBtn,
      payDateDialog,
      savePayDateHandler,
      payDateFieldData,
      allowToChangeStatus,
      statusChangeHandler,
    } = useForm(props, ctx, hasOrders)

    const needSave = computed(() => false) // TODO: fix it

    const disabledCarriers = computed(() => {
      return props.item?.orders?.length > 0 && !!state.value.carrier
    })
    const disabledAgreement = computed(() => {
      return !state.value.carrier // TODO: add logic
    })
    const carrierAgreementIds = computed(() => {
      if (!state.value.carrier) return []
      const currentCarier = outsourceCarriers.value.find(
        (carrier) => carrier._id === state.value.carrier
      )
      if (!currentCarier || !currentCarier.agreements) return []
      return currentCarier.agreements?.map((i) => i.agreement) ?? []
    })

    const carrierAgreements = computed(() => {
      if (!state.value.carrier) return []
      return props.agreementItems.filter((agreement) =>
        carrierAgreementIds.value.includes(agreement._id)
      )
    })

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }
    const carrierChangeHandler = (val) => {
      if (!val || carrierAgreements.value.length === 0)
        state.value.agreement = null
      else if (carrierAgreements.value.length === 1)
        state.value.agreement = carrierAgreements.value[0]._id

      if (!carrierAgreementIds.value.includes(state.value.agreement))
        state.value.agreement = null
    }

    return {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      payInvoiceHandler,
      isVisiblePayDateField,
      invalidForm,
      incomingInvoiceStatuses,
      needSave,
      pickOrdersHandler,
      allowedToChangeOrders,
      disabledAgreement,
      carrierAgreements,
      hasOrders,
      outsourceCarriers,
      disabledCarriers,
      carrierChangeHandler,
      downloadDisabled,
      docTemplateIsVisible,
      templates,
      downloadTemplateHandler,
      isVisiblePayInvoiceBtn,
      payDateDialog,
      savePayDateHandler,
      payDateFieldData,
      allowToChangeStatus,
      statusChangeHandler,
    }
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
  gap: 5px;
}
</style>
