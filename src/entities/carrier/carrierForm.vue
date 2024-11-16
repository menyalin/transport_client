<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('tkName:write') ||
        isInvalidForm ||
        loading
      "
      @cancel="cancelHandler"
      @submit="submitHandler"
    />

    <v-text-field v-model="state.name" outlined label="Название ТК" dense />
    <v-checkbox v-model="state.outsource" label="Привлеченный перевозчик" />
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
import { useForm } from './useForm'
import {
  ButtonsPanel,
  BankAccountInfoForm,
  CompanyInfoForm,
  ContactsInfo,
} from '@/shared/ui'

export default {
  name: 'CarrierForm',
  components: {
    ButtonsPanel,
    BankAccountInfoForm,
    CompanyInfoForm,
    ContactsInfo,
  },
  props: {
    loading: Boolean,
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
      // nameErrors,
    } = useForm(props, ctx)

    return {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      isInvalidForm,
      // nameErrors,
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
