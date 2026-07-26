<template>
  <div class="wrapper">
    <ButtonsPanel
      panel-type="form"
      show-save-btn
      @cancel="cancelHandler"
      :disabled-submit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    />
    <div id="form">
      <div class="fields-row">
        <v-text-field label="Название" v-model.trim="state.name" :style="{ maxWidth: '500px' }" />
        <VatRateSelect
          v-model="state.vatRate"
          :disabled="vatRateDisabled"
          label="Ставка НДС"
          :style="{ maxWidth: '150px' }"
        />
        <v-text-field
          type="number"
          v-model.number="state.paymentOfDays"
          label="Отсрочка оплаты, раб.дней"
          :style="{ maxWidth: '200px' }"
        />
        <v-autocomplete
          label="Заказчик"
          v-model="state.customer"
          auto-select-first
          item-title="name"
          item-value="_id"
          clearable
          :items="allowUseCustomerRoleCarriers"
          :style="{ maxWidth: '300px' }"
        />
        <v-checkbox
          v-model="state.usePriceWithVAT"
          label="Перевозчик оперирует ценами с НДС"
          :disabled="!state.vatRate"
        />
      </div>

      <div class="fields-row">
        <v-textarea
          v-model="state.paymentDescription"
          rows="4"
          label="Описание условий оплаты (для заявки)"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.orderContractNote"
          rows="10"
          label="Примечание для Договора-заявки"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          label="Основание для входящего акта об оказании услуг и счета"
          v-model="state.actBasis"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.actDescription"
          rows="10"
          label="Примечание для входящего акта об оказании услуг"
        />
      </div>
      <div class="fields-row">
        <v-textarea
          v-model="state.paymentBillDescription"
          rows="10"
          label="Примечание для cчета на оплату"
        />
      </div>

      <div class="fields-row">
        <v-text-field v-model="state.note" label="Примечание" @blur="v$.note.$touch" hide-details />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from './useForm.js'

import { ButtonsPanel, VatRateSelect } from '@/shared/ui'

defineOptions({ name: 'CarrierAgreementForm' })

const props = defineProps({
  readonly: Boolean,
  item: Object,
  allowUseCustomerRoleCarriers: { type: Array, required: true },
})

const emit = defineEmits(['submit', 'save', 'cancel'])

const { state, v$, submitHandler, cancelHandler, saveHandler, invalidForm, vatRateDisabled } =
  useForm(props, { emit })
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}
.fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
}
</style>
