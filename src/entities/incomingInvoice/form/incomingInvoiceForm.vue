<template>
  <div class="wrapper">
    <ButtonsPanel
      panelType="form"
      showSaveBtn
      :disabledSubmit="invalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
    >
      <DownloadDocTemplateMenu
        v-if="docTemplateIsVisible"
        :templates="templates"
        :disabledDownloadFiles="downloadDisabled"
        @downloadTemplate="downloadTemplateHandler"
      />
    </ButtonsPanel>
    <div id="form">
      <div class="fields-row">
        <v-autocomplete
          v-model="state.carrier"
          label="Перевозчик"
         
          required
          itemValue="_id"
          itemTitle="name"
          clearable
          variant="outlined"
       density="compact"
          :disabled="disabledCarriers"
          :items="outsourceCarriers"
          :style="{ minWidth: '400px' }"
          @update:model-value="carrierChangeHandler"
        />
        <v-autocomplete
          v-model="state.agreement"
          label="Соглашение"
         
          required
          itemValue="_id"
          itemTitle="name"
          clearable
          variant="outlined"
       density="compact"
          :disabled="disabledAgreement || hasOrders"
          :items="carrierAgreements"
          :style="{ minWidth: '400px' }"
        />
        <v-select
          v-model="state.status"
          label="Статус"
          :items="statusItems"
         
          variant="outlined"
       density="compact"
          :disabled="!allowToChangeStatus"
          :style="{ maxWidth: '200px' }"
          @update:model-value="statusChangeHandler"
        />
      </div>

      <div class="fields-row">
        <v-text-field
          v-model.trim="state.number"
          label="Номер"
         
          variant="outlined"
       density="compact"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          v-model="state.date"
          label="Дата акта"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
      </div>

      <div class="fields-row">
        <DateTimeInput
          v-model="state.receiptDate"
          label="Дата получения акта"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          v-model="state.plannedPayDate"
          label="Плановая дата оплаты"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          v-if="isVisiblePayDateField"
          v-model="state.payDate"
          label="Факт оплаты"
          dense
          outlined
          type="date"
          disabled
          :style="{ maxWidth: '250px' }"
        />
        <v-btn v-if="isVisiblePayInvoiceBtn" color="primary" @click="payInvoiceHandler">Счет оплачен</v-btn>
      </div>
      <v-dialog v-model="payDateDialog" persistent maxWidth="400">
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
        class="ma-3"
        :disabled="disabledPickOrders || needSave || invalidForm || !allowedToChangeOrders"
        @click="pickOrdersHandler"
      >
        Подобрать рейсы
      </v-btn>
      <OrdersTable :invoiceId="item._id" :allowDeleteOrders="allowedToChangeOrders" class="ma-3" />
      <v-text-field
        v-model="state.note"
        label="Примечание"
       
        variant="outlined"
       density="compact"
        hideDetails
        @blur="v$.note.$touch"
      />
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { incomingInvoiceStatuses } from '../config.js'
import OrdersTable from './ordersTable/ordersTable.vue'
import { useForm } from './useForm.js'

import { ButtonsPanel, DownloadDocTemplateMenu, DateTimeInput } from '@/shared/ui'
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
    const { downloadDisabled, docTemplateIsVisible, templates, downloadTemplateHandler } = usePrintForms(props)

    const { outsourceCarriers } = useCarriers()

    const statusItems = computed(() => {
      return incomingInvoiceStatuses.map(i => ({
        ...i,
        disabled: i.value === 'paid',
      }))
    })

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
      const currentCarier = outsourceCarriers.value.find(carrier => carrier._id === state.value.carrier)
      if (!currentCarier || !currentCarier.agreements) return []
      return currentCarier.agreements?.map(i => i.agreement) ?? []
    })

    const carrierAgreements = computed(() => {
      if (!state.value.carrier) return []
      return props.agreementItems.filter(agreement => carrierAgreementIds.value.includes(agreement._id))
    })

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }
    const carrierChangeHandler = val => {
      if (!val || carrierAgreements.value.length === 0) state.value.agreement = null
      else if (carrierAgreements.value.length === 1) state.value.agreement = carrierAgreements.value[0]._id

      if (!carrierAgreementIds.value.includes(state.value.agreement)) state.value.agreement = null
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
      statusItems,
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
    gap: 30px;
  }
  .fields-row > div {
    flex-grow: 0; /* позволяют растягиваться */
    flex-shrink: 1; /* позволяют сжиматься */
    flex-basis: content; /* базовая ширина по содержимому */
    min-width: 250px;
  }
</style>
