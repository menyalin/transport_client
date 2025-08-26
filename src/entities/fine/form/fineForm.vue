<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('fine:write') || isInvalidForm
      "
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="row-input">
      <v-text-field
        v-model="v$.form.date.$model"
        type="date"
        label="Дата постановления"
        outlined
        dense
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <v-text-field
        v-model.trim="v$.form.number.$model"
        label="Номер постановления"
        outlined
        dense
        :style="{ maxWidth: '350px' }"
        @blur="$emit('fineNumberUpdated', $event)"
      />
      <v-select
        v-model.trim="v$.form.category.$model"
        :items="$store.getters.fineCategories"
        label="Категория"
        outlined
        clearable
        dense
        :style="{ maxWidth: '450px' }"
      />
    </div>
    <v-text-field
      v-model.trim="v$.form.violation.$model"
      label="Нарушение"
      outlined
      dense
    />

    <div class="row-input mt-2">
      <v-text-field
        v-model.number="v$.form.discountedSum.$model"
        type="number"
        label="Сумма штрафа со скидкой"
        outlined
        dense
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model.number="v$.form.totalSum.$model"
        type="number"
        label="Общая сумма штрафа"
        outlined
        dense
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model="v$.form.expiryDateOfDiscount.$model"
        type="date"
        label="Скидка до"
        outlined
        dense
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />
    </div>

    <div class="row-input">
      <v-text-field
        v-model="form.violationDate"
        type="datetime-local"
        outlined
        dense
        label="Дата и время нарушения"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <v-autocomplete
        v-model="v$.form.truck.$model"
        label="Грузовик / Прицеп"
        :items="trucks"
        auto-select-first
        outlined
        dense
        :style="{ maxWidth: '250px' }"
      />
      <v-autocomplete
        v-model="v$.form.driver.$model"
        label="Водитель"
        :items="drivers"
        auto-select-first
        outlined
        dense
        :style="{ maxWidth: '350px' }"
        :append-outer-icon="
          form.truck && form.violationDate ? 'mdi-crosshairs' : null
        "
        @click:append-outer="getDriver"
      />
    </div>

    <v-text-field
      v-model="v$.form.address.$model"
      label="Место нарушения"
      outlined
      dense
    />
    <div class="row-input">
      <v-checkbox
        v-model="v$.form.isCulpritDriver.$model"
        dense
        label="Виноват водитель"
      />
      <v-checkbox
        v-if="form.isCulpritDriver"
        v-model="v$.form.isPaydByDriver.$model"
        :disabled="!!form.payingByWorker"
        dense
        label="Оплачен водителем"
      />
    </div>

    <div v-if="showPaymentBlock" class="row-input">
      <v-text-field
        v-model.number="v$.form.paymentSum.$model"
        type="number"
        label="Сумма оплаты"
        outlined
        dense
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model="v$.form.paymentDate.$model"
        type="date"
        outlined
        dense
        label="Дата оплаты"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <app-worker-autocomplete
        v-model="form.payingByWorker"
        label="Кто оплатил"
        dense
        outlined
        :style="{ maxWidth: '350px' }"
      />
      <v-select
        v-if="isNeedWithheldFromDriver"
        v-model="v$.form.kX.$model"
        :items="[1, 2, 4]"
        label="kX"
        outlined
        dense
        :style="{ maxWidth: '80px' }"
      />
      <v-text-field
        v-if="isNeedWithheldFromDriver"
        v-model.number="v$.form.withheldSum.$model"
        type="number"
        outlined
        readonly
        dense
        label="Удержать"
        :style="{ maxWidth: '250px' }"
      />
      <v-checkbox
        v-if="isNeedWithheldFromDriver && showIsWithheldField"
        v-model="v$.form.isWithheld.$model"
        label="Удержано"
        :disabled="isWithheldReadonly"
        dense
      />
    </div>
    <v-text-field
      v-model="v$.form.note.$model"
      label="Примечание"
      outlined
      dense
    />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'
import AppWorkerAutocomplete from '@/modules/common/components/workerAutocomplete'
import { CrewService } from '@/shared/services'

import { usePasteDateInput } from '@/modules/common/hooks/usePasteDateInput'

export default {
  name: 'FineForm',
  components: {
    ButtonsPanel,
    AppWorkerAutocomplete,
  },
  props: {
    item: { type: Object },
    displayDeleteBtn: { type: Boolean, default: false },
    openInModal: { type: Boolean, default: false },
  },
  setup() {
    const { pasteDate } = usePasteDateInput()
    return { pasteDate, v$: useVuelidate() }
  },
  data() {
    return {
      dateFields: ['date', 'paymentDate', 'expiryDateOfDiscount'],
      dateTimeFields: ['violationDate'],
      form: {
        date: null,
        number: null,
        category: null,
        violation: null,
        violationDate: null,
        truck: null,
        driver: null,
        totalSum: null,
        discountedSum: null,
        expiryDateOfDiscount: null,
        address: null,
        paymentDate: null,
        paymentSum: null,
        isPaydByDriver: false,
        payingByWorker: null,
        isCulpritDriver: false,
        kX: 2,
        withheldSum: 0,
        isWithheld: false,
        note: null,
      },
    }
  },

  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    showIsWithheldField() {
      return (
        this.isNeedWithheldFromDriver &&
        this.form.withheldSum > 0 &&
        this.$store.getters.hasPermission('fine:isWithheldRead')
      )
    },
    isWithheldReadonly() {
      return !this.$store.getters.hasPermission('fine:isWithheldWrite')
    },
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.v$.$invalid
    },
    isNeedWithheldFromDriver() {
      return this.form.isCulpritDriver && !this.form.isPaydByDriver
    },
    showPaymentBlock() {
      return !this.form.isPaydByDriver
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },

    formState() {
      const dates = {}
      this.dateFields.concat(this.dateTimeFields).forEach((item) => {
        dates[item] = this.form[item]
          ? dayjs(this.form[item]).toISOString()
          : null
      })
      const withheldParams = {}
      if (this.form.isPaydByDriver) {
        withheldParams.withheldSum = 0
        withheldParams.payingByWorker = null
      }
      return {
        ...this.form,
        company: this.directoriesProfile,
        ...dates,
        ...withheldParams,
      }
    },

    trucks() {
      return this.$store.getters
        .activeTrucksOnDate(this.form.violationDate)
        .filter((item) => ['truck', 'trailer'].includes(item.type))
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.regNum }))
    },

    drivers() {
      return this.$store.getters
        .activeDriversOnDate(this.form.violationDate)
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.fullName }))
    },
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
    'form.violationDate': {
      handler: function () {
        this.form.truck = null
        this.form.driver = null
      },
    },

    'form.paymentSum': {
      immediate: true,
      handler: function (val) {
        if (!val || !this.isNeedWithheldFromDriver) this.form.withheldSum = 0
        else this.form.withheldSum = this.form.kX * this.form.paymentSum
      },
    },
    'form.kX': {
      handler: function () {
        this.form.withheldSum = this.form.kX * this.form.paymentSum
      },
    },
  },

  validations() {
    return {
      form: {
        date: { required },
        number: { required },
        truck: { required },
        totalSum: { required },
        category: {},
        discountedSum: { required },
        expiryDateOfDiscount: {},
        driver: {},
        violation: {},
        violationDate: {},
        address: {},
        paymentDate: {},
        paymentSum: {},
        isPaydByDriver: {},
        payingByWorker: {},
        isCulpritDriver: {},
        kX: {},
        withheldSum: {},
        isWithheld: {},
        note: {},
      },
    }
  },
  methods: {
    async getDriver() {
      if (!this.form.truck || !this.form.violationDate) return null
      const crew = await CrewService.getCrewByTruckAndDate({
        truck: this.form.truck,
        date: new Date(this.form.violationDate).toISOString(),
      })
      if (crew) this.form.driver = crew.driver
      else {
        this.form.driver = null
        this.$store.commit('setError', 'Экипаж не найден')
      }
    },
    submit() {
      this.$emit('submit', this.formState)
      // this.resetForm()
    },
    cancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        if (this.dateFields.includes(key) && !!val[key]) {
          this.form[key] = dayjs(val[key]).format('YYYY-MM-DD')
        } else if (this.dateTimeFields.includes(key) && !!val[key]) {
          this.form[key] = dayjs(val[key]).format('YYYY-MM-DDTHH:mm')
        } else this.form[key] = val[key]
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
  flex-wrap: wrap;
  gap: 20px;
}
</style>
