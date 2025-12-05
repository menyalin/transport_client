<template>
  <div class="wrapper">
    <ButtonsPanel
      panelType="form"
      showSaveBtn
      :disabledSubmit="invalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
    />
    <div id="form">
      <div class="fields-row">
        <v-text-field
          v-model.trim="state.name"
          label="Название"
         
          variant="outlined"
       density="compact"
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
          v-model.number="state.paymentOfDays"
          type="number"
          variant="outlined"
       density="compact"
         
          label="Отсрочка оплаты, раб.дней"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          v-model="state.customer"
          label="Заказчик"
          autoSelectFirst
         
          itemTitle="name"
          itemValue="_id"
          variant="outlined"
       density="compact"
          clearable
          :items="carrierItems"
          :style="{ maxWidth: '300px' }"
        />
      </div>

      <div class="fields-row">
        <v-textarea
          v-model="state.paymentDescription"
          rows="4"
          variant="outlined"
       density="compact"
          label="Описание условий оплаты (для заявки)"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.orderContractNote"
          rows="10"
          variant="outlined"
       density="compact"
          label="Примечание для Договора-заявки"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          v-model="state.actBasis"
          label="Основание для входящего акта об оказании услуг и счета"
          variant="outlined"
       density="compact"
         
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.actDescription"
          rows="10"
          variant="outlined"
       density="compact"
          label="Примечание для входящего акта об оказании услуг"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.paymentBillDescription"
          rows="10"
          variant="outlined"
       density="compact"
          label="Примечание для cчета на оплату"
        />
      </div>
      <div class="fields-row">
        <v-checkbox v-model="state.usePriceWithVAT" label="Показывать цены с НДС" :disabled="!state.vatRate" />
      </div>
      <div class="fields-row">
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
    const { state, v$, submitHandler, cancelHandler, saveHandler, invalidForm, vatRateDisabled, carrierItems } =
      useForm(props, ctx)

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
