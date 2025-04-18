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
          label="Название"
          v-model.trim="state.name"
          dense
          outlined
          :style="{ maxWidth: '500px' }"
        />
        <VatRateSelect
          v-model="state.vatRate"
          :disabled="vatRateDisabled"
          outlined
          dense
          label="Ставка НДС"
          :style="{ maxWidth: '150px' }"
        />
        <v-text-field
          type="number"
          v-model.number="state.paymentOfDays"
          outlined
          dense
          label="Отсрочка оплаты, раб.дней"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          label="Заказчик"
          v-model="state.customer"
          auto-select-first
          dense
          item-text="name"
          item-value="_id"
          outlined
          clearable
          :items="carrierItems"
          :style="{ maxWidth: '300px' }"
        />
      </div>

      <div class="fields-row">
        <v-textarea
          v-model="state.paymentDescription"
          rows="4"
          outlined
          label="Описание условий оплаты (для заявки)"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.orderContractNote"
          rows="10"
          outlined
          label="Примечание для Договора-заявки"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          label="Основание для входящего акта об оказании услуг"
          v-model="state.actBasis"
          outlined
          dense
          hide-details
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.actDescription"
          rows="10"
          outlined
          label="Примечание для входящего акта об оказании услуг"
        />
      </div>
      <div class="fields-row">
        <v-checkbox
          v-model="state.usePriceWithVAT"
          label="Показывать цены с НДС"
          :disabled="!state.vatRate"
        />
      </div>
      <div class="fields-row">
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
  </div>
</template>
<script>
import { useForm } from './useForm.js'

import { ButtonsPanel, DateTimeInput, VatRateSelect } from '@/shared/ui'

export default {
  name: 'IncomingInvoiceForm',
  components: {
    DateTimeInput,
    ButtonsPanel,
    VatRateSelect,
  },
  props: {
    readonly: Boolean,
    item: Object,
  },
  setup(props, ctx) {
    const {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      invalidForm,
      vatRateDisabled,
      carrierItems,
    } = useForm(props, ctx)

    return {
      carrierItems,
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      invalidForm,
      vatRateDisabled,
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
