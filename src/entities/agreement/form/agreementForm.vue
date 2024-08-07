<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('agreement:write') || isInvalidForm
      "
      @cancel="cancel"
      @submit="submit"
    />
    <div>
      <div id="title-row">
        <v-text-field
          v-model="$v.form.name.$model"
          class="mt-3"
          label="Название"
          outlined
          dense
          :style="{ 'max-width': '500px' }"
        />
        <DateTimeInput
          v-model="$v.form.date.$model"
          label="Дата начала"
          hideTimeInput
          hidePrependIcon
          class="mb-4"
          :style="{ 'max-width': '300px' }"
        />
        <v-select
          v-model="$v.form.vatRate.$model"
          label="Ставка НДС"
          :items="vatRates"
          :readonly="!!agreement && !!agreement._id"
          dense
          outlined
          :style="{ 'max-width': '130px' }"
        />
        <v-checkbox
          v-model="form.isOutsourceAgreement"
          label="Соглашение с перевозчиком"
          color="primary"
          :readonly="!!agreement && !!agreement._id"
        />
      </div>
      <div v-if="form.isOutsourceAgreement">
        <v-divider />
        <app-tknames
          v-model="form.outsourceCarriers"
          :style="{ 'max-width': '400px' }"
        />
        <v-checkbox
          v-model="form.cashPayment"
          label="Оплата наличными"
          color="primary"
        />
      </div>
      <div v-else class="mb-4">
        <v-divider />
        <v-text-field
          label="Наименование исполнителя"
          outlined
          v-model="form.executorName"
          class="mt-4"
          :style="{ width: '400px' }"
        />
        <v-select
          multiple
          outlined
          :items="carriers"
          label="Разрешенные ТК"
          :style="{ width: '500px' }"
          v-model="form.allowedCarriers"
          chips
          deletable-chips
        />
        <app-clients v-model="form.clients" :style="{ 'max-width': '400px' }" />

        <v-checkbox
          v-model="form.usePriceWithVAT"
          :disabled="form.vatRate === 0"
          color="primary"
          label="При выгрузке показывать ставку с НДС"
        />
        <v-checkbox
          v-model="form.calcWaitingByArrivalDateLoading"
          color="primary"
          label="Расчет простоя по фактическому времени прибытия на погрузку"
          hide-details
        />
        <v-checkbox
          v-model="form.calcWaitingByArrivalDateUnloading"
          color="primary"
          label="Расчет простоя по фактическому времени прибытия на выгрузку"
          hide-details
        />

        <v-checkbox
          v-model="form.noWaitingPaymentForAreLateLoading"
          color="primary"
          label="Запрет оплаты простоя при опоздании на погрузку"
          hide-details
        />

        <v-checkbox
          v-model="form.noWaitingPaymentForAreLateUnloading"
          color="primary"
          label="Запрет оплаты простоя при опоздании на выгрузку"
          hide-details
        />
        <v-divider class="mt-5" />
        <v-checkbox
          v-model="form.priceRequired"
          color="primary"
          label="Обязательно заполнение аукционной цены"
          hide-details
        />

        <v-checkbox
          v-model="form.clientNumRequired"
          color="primary"
          hide-details
          label="Обязательно заполнение номера заказа клиента"
        />

        <v-checkbox
          v-model="form.auctionNumRequired"
          color="primary"
          hide-details
          label="Обязательно заполнение номера аукциона"
        />
      </div>
      <v-text-field
        v-if="isOutsourceAgreement"
        v-model.number="form.commsission"
        type="number"
        label="Комиссия экспедитора (скидка в акте)"
        outlined
        dense
        class="mt-5"
        suffix="%"
        :style="{ maxWidth: '400px' }"
      />
      <v-text-field v-model="form.note" label="Примечание" outlined dense />
      <div class="row mb-2">
        <v-checkbox
          v-model="form.useCustomPrices"
          class="pl-2"
          label="Разрешены индивидуальные тарифы"
        />
        <v-checkbox
          v-model="form.closed"
          class="pl-6"
          label="Соглашение закрыто"
        />
      </div>
    </div>

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { required } from 'vuelidate/lib/validators'
import { ButtonsPanel, DateTimeInput } from '@/shared/ui'
import AppClients from './clients.vue'
import AppTknames from './tkNames.vue'

export default {
  name: 'AgreementForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AppClients,
    AppTknames,
  },
  props: {
    agreement: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    openInModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: null,
        isOutsourceAgreement: false,
        cashPayment: false,
        note: null,
        date: null,
        vatRate: null,
        usePriceWithVAT: false,
        useCustomPrices: true,
        calcWaitingByArrivalDateLoading: false,
        calcWaitingByArrivalDateUnloading: false,
        noWaitingPaymentForAreLateLoading: false,
        noWaitingPaymentForAreLateUnloading: false,
        clients: [],
        outsourceCarriers: [],
        closed: null,
        agreement: 0,
        priceRequired: false,
        clientNumRequired: false,
        auctionNumRequired: false,
        commission: 0,
        executorName: null,
        allowedCarriers: [],
      },
    }
  },

  computed: {
    isInvalidForm() {
      return this.$v.$invalid
    },

    formState() {
      return {
        ...this.form,
        company: this.$store.getters.directoriesProfile,
        date: dayjs(this.form.date).toISOString(),
      }
    },
    vatRates() {
      return this.$store.getters.vatRates
    },
    carriers() {
      return this.$store.getters.tkNames
        .map((i) => ({
          value: i._id,
          text: i.name,
        }))
        .sort((a, b) => a - b)
    },
    isOutsourceAgreement() {
      return this.form.isOutsourceAgreement
    },
  },
  watch: {
    agreement: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
    ['form.vatRate']: {
      handler: function (val) {
        if (val === 0) this.form.usePriceWithVAT = false
      },
    },
  },

  validations() {
    return {
      form: {
        name: { required },
        date: { required },
        vatRate: { required },
      },
    }
  },

  methods: {
    submit() {
      this.$emit('submit', this.formState)
      this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
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
