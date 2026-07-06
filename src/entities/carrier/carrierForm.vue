<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="!$store.getters.hasPermission('carrier:write') || isInvalidForm || loading"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <v-text-field v-model="state.name" label="Название ТК" hide-details />
    <div class="row-input">
      <v-checkbox v-model="state.outsource" label="Привлеченный перевозчик" />
      <v-checkbox
        v-model="state.allowUseCustomerRole"
        label="Может выступать заказчиком для привлеченного перевозчика"
      />
    </div>

    <AllowedAgreements v-model="state.agreements" :agreementItems="agreementItems" />

    <VatRatesInfo showTitle v-model="state.vatRates" />
    <CompanyInfoForm v-model="state.companyInfo" />
    <BankAccountInfoForm v-model="state.bankAccountInfo" />
    <ContactsInfo v-model="state.contacts" />
    <EntityFiles v-if="item && item._id" :itemId="item._id" docType="carrier" />
    <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler" class="mt-5">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script setup>
import {
  ButtonsPanel,
  BankAccountInfoForm,
  CompanyInfoForm,
  ContactsInfo,
  EntityFiles,
  VatRatesInfo,
  AllowedAgreements,
} from '@/shared/ui'
import { useForm } from './useForm'

defineOptions({ name: 'CarrierForm' })

const props = defineProps({
  loading: Boolean,
  agreementItems: Array,
  item: {
    type: Object,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'submit', 'cancel'])

const { state, deleteHandler, submitHandler, cancelHandler, isInvalidForm } = useForm(props, emit)
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: flex-start;
}
</style>
