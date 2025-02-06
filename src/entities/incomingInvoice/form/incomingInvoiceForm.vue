<template>
  <div class="wrapper">
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    />
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
          label="Дата"
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
          label="Плановая дата оплаты"
          v-model="state.plannedPayDate"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
        />
      </div>

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
    const { outsourceCarriers } = useCarriers()
    const {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      statusItems,
      invalidForm,
      allowedToChangeOrders,
    } = useForm(props, ctx)

    const needSave = computed(() => false) // TODO: fix it

    const hasOrders = computed(() => {
      return props.item?.orders?.length > 0
    })

    const disabledCarriers = computed(() => {
      return props.item?.orders?.length > 0 && !!state.value.carrier
    })
    const disabledAgreement = computed(() => {
      return !state.value.carrier // TODO: add logic
    })

    const carrierAgreements = computed(() => {
      if (!state.value.carrier) return []
      const currentCarier = outsourceCarriers.value.find(
        (carrier) => carrier._id === state.value.carrier
      )
      if (!currentCarier || !currentCarier.agreements) return []

      const carrierAgreementsIds = currentCarier.agreements.map(
        (i) => i.agreement
      )

      return props.agreementItems.filter((agreement) =>
        carrierAgreementsIds.includes(agreement._id)
      )
    })

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }
    const carrierChangeHandler = (val) => {
      const currentCarier = outsourceCarriers.value.find(
        (carrier) => carrier._id === state.value.carrier
      )

      const carrierAgreementsIds = currentCarier.agreements.map(
        (i) => i.agreement
      )
      if (!val || carrierAgreements.value.length === 0)
        state.value.agreement = null
      else if (carrierAgreements.value.length === 1)
        state.value.agreement = carrierAgreements.value[0]._id

      if (!carrierAgreementsIds.includes(state.value.agreement))
        state.value.agreement = null
    }

    return {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      statusItems,
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
