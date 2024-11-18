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
          v-model="state.agreement"
          label="Соглашение"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :disabled="disabledAgreements"
          :items="agreementItems"
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
    const needSave = computed(() => false) // TODO: fix it
    const disabledAgreements = computed(() => {
      return props.item?.orders?.length > 0
    })
    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }

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
      disabledAgreements,
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
