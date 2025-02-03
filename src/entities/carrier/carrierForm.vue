<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('carrier:write') ||
        isInvalidForm ||
        loading
      "
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <v-text-field
      v-model="state.name"
      outlined
      label="Название ТК"
      dense
      hide-details
    />
    <v-checkbox v-model="state.outsource" label="Привлеченный перевозчик" />
    <v-select
      v-if="$store.getters.hasPermission('admin:only')"
      v-model="state.agreement"
      outlined
      item-text="name"
      item-value="_id"
      dense
      clearable
      label="НЕ ИСПОЛЬЗОВАТЬ! Основное соглашение"
      :style="{ maxWidth: '500px' }"
      :items="agreementItems"
    />
    <AllowedCarrierAgreements
      v-model="state.agreements"
      :agreementItems="agreementItems"
    />
    <v-divider />
    <CompanyInfoForm v-model="state.companyInfo" />
    <BankAccountInfoForm v-model="state.bankAccountInfo" />
    <ContactsInfo v-model="state.contacts" />

    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      @click="deleteHandler"
      class="mt-5"
    >
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import {
  ButtonsPanel,
  BankAccountInfoForm,
  CompanyInfoForm,
  ContactsInfo,
} from '@/shared/ui'
import { useForm } from './useForm'
import AllowedCarrierAgreements from './allowedCarrierAgreements'

export default {
  name: 'CarrierForm',
  components: {
    ButtonsPanel,
    BankAccountInfoForm,
    CompanyInfoForm,
    ContactsInfo,
    AllowedCarrierAgreements,
  },

  props: {
    loading: Boolean,
    agreementItems: Array,
    item: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      isInvalidForm,
      v$,
    } = useForm(props, ctx)

    return {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      v$,
      isInvalidForm,
    }
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
}
</style>
