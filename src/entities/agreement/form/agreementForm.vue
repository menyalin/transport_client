<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('agreement:write') || isInvalidForm
      "
      @cancel="cancelHandler"
      @submit="submitHandler"
    />
    <div>
      <div id="title-row">
        <v-text-field
          v-model="state.name"
          class="mt-3"
          label="Название"
          outlined
          :style="{ 'max-width': '500px' }"
        />
        <DateTimeInput
          v-model="state.date"
          label="Дата начала"
          outlined
          hideTimeInput
          hidePrependIcon
          class="mb-4"
          :style="{ 'max-width': '300px' }"
        />
        <DateTimeInput
          v-model="state.endDate"
          label="Дата окончания"
          outlined
          hideTimeInput
          hidePrependIcon
          class="mb-4"
          :style="{ 'max-width': '300px' }"
        />
        <VatRateSelect
          v-model="state.vatRate"
          label="Ставка НДС"
          :disabled="!!agreement && !!agreement._id"
          outlined
          :style="{ 'max-width': '130px' }"
        />
      </div>
      <div class="mb-4">
        <v-text-field
          label="Наименование исполнителя"
          outlined
          v-model="state.executorName"
          class="mt-4"
          :style="{ width: '400px' }"
        />
        <v-autocomplete
          v-model="state.executor"
          label="Исполнитель"
          :items="carrierItems"
          item-value="_id"
          item-text="name"
          outlined
          auto-select-first
          :style="{ width: '400px' }"
        />
        <v-select
          multiple
          outlined
          :items="carriers"
          label="Разрешенные ТК"
          :style="{ width: '500px' }"
          v-model="state.allowedCarriers"
          chips
          deletable-chips
        />
        <app-clients
          v-model="state.clients"
          :style="{ 'max-width': '400px' }"
        />

        <v-checkbox
          v-model="state.usePriceWithVAT"
          :disabled="state.vatRate === 0"
          color="primary"
          label="Клиент оперирует ценами с НДС"
        />
        <v-checkbox
          v-model="state.calcWaitingByArrivalDateLoading"
          color="primary"
          label="Расчет простоя по фактическому времени прибытия на погрузку"
          hide-details
        />
        <v-checkbox
          v-model="state.calcWaitingByArrivalDateUnloading"
          color="primary"
          label="Расчет простоя по фактическому времени прибытия на выгрузку"
          hide-details
        />

        <v-checkbox
          v-model="state.noWaitingPaymentForAreLateLoading"
          color="primary"
          label="Запрет оплаты простоя при опоздании на погрузку"
          hide-details
        />

        <v-checkbox
          v-model="state.noWaitingPaymentForAreLateUnloading"
          color="primary"
          label="Запрет оплаты простоя при опоздании на выгрузку"
          hide-details
        />
        <v-divider class="mt-5" />
        <v-checkbox
          v-model="state.priceRequired"
          color="primary"
          label="Обязательно заполнение аукционной цены"
          hide-details
        />

        <v-checkbox
          v-model="state.clientNumRequired"
          color="primary"
          hide-details
          label="Обязательно заполнение номера заказа клиента"
        />

        <v-checkbox
          v-model="state.auctionNumRequired"
          color="primary"
          hide-details
          label="Обязательно заполнение номера аукциона"
        />
      </div>

      <v-text-field
        v-model="state.actBasis"
        label="Основание для счета и акта выполненных работ"
        outlined
        dense
      />
      <v-textarea
        rows="4"
        v-model="state.actDescription"
        label="Примечание для акта выполненных работ"
        outlined
        dense
      />
      <v-text-field v-model="state.note" label="Примечание" outlined dense />
      <div class="row mb-2">
        <v-checkbox
          v-model="state.useCustomPrices"
          class="pl-2"
          label="Разрешены индивидуальные тарифы"
        />
        <v-checkbox
          v-model="state.closed"
          class="pl-6"
          label="Соглашение закрыто"
        />
      </div>
    </div>

    <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { ButtonsPanel, DateTimeInput, VatRateSelect } from '@/shared/ui'
import AppClients from './clients.vue'
import { useForm } from './useForm'

export default {
  name: 'AgreementForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AppClients,
    VatRateSelect,
  },
  props: {
    agreement: {
      type: Object,
    },
    carrierItems: Array,
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    openInModal: {
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
      vatRates,
      carriers,
    } = useForm(props, ctx)

    return {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      isInvalidForm,
      vatRates,
      carriers,
    }
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
}
.list-move {
  transition: transform 1s;
}

#title-row {
  display: flex;
  flex-direction: row;
}
#title-row > * {
  margin: 10px;
}
</style>
