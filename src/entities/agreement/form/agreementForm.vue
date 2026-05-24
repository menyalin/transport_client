<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="!$store.getters.hasPermission('agreement:write') || isInvalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />
    <div>
      <div class="title-row">
        <v-text-field v-model="state.name" label="Название" :style="{ 'min-width': '500px' }" />
        <DateTimeInput v-model="state.date" label="Дата начала" />
        <DateTimeInput v-model="state.endDate" label="Дата окончания" />
        <VatRateSelect
          v-model="state.vatRate"
          label="Ставка НДС"
          disabled
          hint="поле будет удалено!"
          persistent-hint
        />
      </div>
      <div class="mb-4">
        <v-text-field
          label="Наименование исполнителя"
          v-model="state.executorName"
          class="mt-4"
          :style="{ width: '500px' }"
        />
        <v-autocomplete
          v-model="state.executor"
          label="Исполнитель"
          :items="carrierItems"
          item-value="_id"
          item-title="name"
          :style="{ width: '500px' }"
        />
        <v-select
          multiple
          :items="carrierItems"
          item-value="_id"
          item-title="name"
          label="Разрешенные ТК"
          :style="{ width: '500px' }"
          v-model="state.allowedCarriers"
          chips
          closable-chips
        />
        <v-text-field
          label="Договор (наименование)"
          v-model="state.contract"
          :style="{ width: '500px' }"
        />
        <app-clients v-model="state.clients" :style="{ 'max-width': '400px' }" />
        <v-divider />

        <v-checkbox v-model="state.usePriceWithVAT" label="Клиент оперирует ценами с НДС" />
        <v-checkbox
          v-model="state.calcWaitingByArrivalDateLoading"
          label="Расчет простоя по фактическому времени прибытия на погрузку"
          hide-details
        />
        <v-checkbox
          v-model="state.calcWaitingByArrivalDateUnloading"
          label="Расчет простоя по фактическому времени прибытия на выгрузку"
          hide-details
        />

        <v-checkbox
          v-model="state.noWaitingPaymentForAreLateLoading"
          label="Запрет оплаты простоя при опоздании на погрузку"
          hide-details
        />

        <v-checkbox
          v-model="state.noWaitingPaymentForAreLateUnloading"
          label="Запрет оплаты простоя при опоздании на выгрузку"
          hide-details
        />
        <v-divider class="mt-5" />
        <v-checkbox
          v-model="state.priceRequired"
          label="Обязательно заполнение аукционной цены"
          hide-details
        />

        <v-checkbox
          v-model="state.clientNumRequired"
          hide-details
          label="Обязательно заполнение номера заказа клиента"
        />

        <v-checkbox
          v-model="state.auctionNumRequired"
          hide-details
          label="Обязательно заполнение номера аукциона"
        />
      </div>

      <v-text-field v-model="state.actBasis" label="Основание для счета и акта выполненных работ" />
      <v-textarea
        rows="4"
        v-model="state.actDescription"
        label="Примечание для акта выполненных работ"
      />
      <v-text-field v-model="state.note" label="Примечание" />
      <div class="row mb-2">
        <v-checkbox
          v-model="state.useCustomPrices"
          class="pl-2"
          label="Разрешены индивидуальные тарифы"
        />
        <v-checkbox v-model="state.closed" class="pl-6" label="Соглашение закрыто" />
      </div>
    </div>

    <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler">
      <v-icon start> mdi-delete </v-icon>
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
    const { state, deleteHandler, submitHandler, cancelHandler, isInvalidForm } = useForm(
      props,
      ctx
    )

    return {
      state,
      deleteHandler,
      submitHandler,
      cancelHandler,
      isInvalidForm,
    }
  },
}
</script>
<style scoped>
.row-input {
  display: flex;
  flex-direction: row;
}
.list-move {
  transition: transform 1s;
}

.title-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}
.title-row > * {
  flex: 0 1 auto;
}
</style>
