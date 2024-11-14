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

    <v-text-field
      v-model.trim="state.name"
      :error-messages="nameErrors"
      outlined
      label="Название ТК"
      dense
    />
    <v-checkbox v-model="state.outsource" label="Привлеченный перевозчик" />
    <CompanyInfoForm v-model="state.companyInfo" />
    <BankAccountInfoForm v-model="state.bankAccountInfo" />
    <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { ButtonsPanel, BankAccountInfoForm } from '@/shared/ui'
import { useForm } from './useForm'
import { CompanyInfoForm } from '@/shared/ui'

export default {
  name: 'CarrierForm',
  components: {
    ButtonsPanel,
    BankAccountInfoForm,
    CompanyInfoForm,
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
      nameErrors,
    } = useForm(props, ctx)

    return {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      isInvalidForm,
      nameErrors,
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
