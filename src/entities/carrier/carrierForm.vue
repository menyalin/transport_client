<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="!$store.getters.hasPermission('carrier:write') || isInvalidForm || loading"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <v-text-field v-model="state.name" variant="outlined" label="Название ТК" density="compact" hideDetails />
    <div class="row-input">
      <v-checkbox v-model="state.outsource" label="Привлеченный перевозчик" />
      <v-checkbox
        v-model="state.allowUseCustomerRole"
        label="Может выступать заказчиком для привлеченного перевозчика"
      />
    </div>

    <AllowedCarrierAgreements v-model="state.agreements" :agreementItems="agreementItems" />
    <v-divider />
    <CompanyInfoForm v-model="state.companyInfo" />
    <BankAccountInfoForm v-model="state.bankAccountInfo" />
    <ContactsInfo v-model="state.contacts" />
    <EntityFiles v-if="item && item._id" :itemId="item._id" docType="carrier" />
    <v-btn v-if="displayDeleteBtn" color="error" class="mt-5" @click="deleteHandler">
      <v-icon start>mdi-delete</v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
  import { ButtonsPanel, BankAccountInfoForm, CompanyInfoForm, ContactsInfo, EntityFiles } from '@/shared/ui'
  import { useForm } from './useForm'
  import AllowedCarrierAgreements from './allowedCarrierAgreements'

  export default {
    name: 'CarrierForm',
    components: {
      EntityFiles,
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
      const { state, deleteHandler, submitHandler, cancelHandler, isInvalidForm, v$ } = useForm(props, ctx)

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
    gap: 15px;
    justify-content: flex-start;
  }
</style>
