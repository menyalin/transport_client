<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="disableSubmitBtn"
      @submit="submitHandler"
    />
    <v-text-field label="Название" v-model="state.name" />
    <v-autocomplete
      :items="agreements"
      item-text="name"
      item-value="_id"
      label="Соглашение"
      v-model="state.agreement"
    />
    <v-text-field label="Дата начала" type="date" v-model="state.startDate" />
    <v-text-field label="Дата окончания" type="date" v-model="state.endDate" />
    <v-select
      label="Тип рейса"
      v-model="state.orderType"
      :items="orderTypeItems"
    />
    <v-checkbox
      color="primary"
      v-model="state.withVat"
      label="Тарифы указаны с НДС"
    />

    <v-text-field label="Примечание" v-model="state.note" />
    <v-divider />
    state: {{ state }}
    <v-divider />
    invalid : {{ disableSubmitBtn }}
  </div>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { useTariffContractForm } from './useTariffContractForm'
export default {
  name: 'TariffContractForm',
  components: {
    ButtonsPanel,
  },
  props: {
    agreements: Array,
  },

  setup() {
    const { state, v$, orderTypeItems, disableSubmitBtn, submitHandler } =
      useTariffContractForm()

    return {
      state,
      v$,
      disableSubmitBtn,
      orderTypeItems,
      submitHandler,
    }
  },
}
</script>
./useTariffContractForm
