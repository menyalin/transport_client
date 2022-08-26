<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('fine:write') || isInvalidForm
      "
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert
      v-if="!directoriesProfile"
      outlined
      class="ma-3 mb-5"
      type="error"
    >
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>

    
    <div class="row-input">
      <v-text-field 
        v-model="$v.form.date.$model"
        type="date"
        label="Дата постановления"
        outlined
        dense
        :style="{maxWidth: '250px'}"
      />

      <v-text-field 
        v-model.trim="$v.form.number.$model"
        label="Номер постановления"
        outlined
        dense
        :style="{maxWidth: '350px'}"
      />
      <v-select 
        v-model.trim="$v.form.category.$model"
        :items="$store.getters.fineCategories"
        label="Категория"
        outlined
        dense
        :style="{maxWidth: '450px'}"
      />
    </div>

    <div class="row-input mt-2"> 
      <v-text-field 
        v-model.number="$v.form.discountedSum.$model"
        type="number"
        label="Сумма штрафа со скидкой"
        outlined
        dense
        :style="{maxWidth: '300px'}"
      />

      <v-text-field 
        v-model.number="$v.form.totalSum.$model"
        type="number"
        label="Общая сумма штрафа"
        outlined
        dense
        :style="{maxWidth: '300px'}"
      />

      <v-text-field 
        v-model="$v.form.expiryDateOfDiscount.$model"
        type="date"
        label="Скидка до"
        outlined
        dense
        :style="{maxWidth: '250px'}"
      />
    </div>  
    
    <div class="row-input">
      <v-text-field
        v-model="form.violationDate"
        type="datetime-local"
        outlined
        dense 
        label="Дата и время нарушения"
        :style="{maxWidth: '250px'}"
      />
      
      <v-autocomplete
        v-model="$v.form.truck.$model"
        label="Грузовик"
        :items="trucks"
        auto-select-first
        outlined
        dense
        :style="{maxWidth: '250px'}"
      />
      <v-autocomplete
        v-model="$v.form.driver.$model"
        label="Водитель"
        :items="drivers"
        auto-select-first
        outlined
        dense
        :style="{maxWidth: '350px'}"
        :append-outer-icon="form.truck && form.violationDate ? 'mdi-crosshairs' : null"
        @click:append-outer="getDriver"
      />
    </div>
    
    <v-text-field
      v-model="$v.form.address.$model"
      label="Место нарушения"
      outlined
      
      dense
    />
    <div class="row-input">
      <v-checkbox 
        v-model="$v.form.isCulpritDriver.$model"
        dense
        label="Виноват водитель"
      />
      <v-checkbox 
        v-if="form.isCulpritDriver"
        v-model="$v.form.isPaydByDriver.$model"
        :disabled="!!form.payingByWorker"
        dense
        label="Оплачен водителем"
      /> 
    </div>

    <div 
      v-if="isNeedWithheldFromDriver"
      class="row-input" 
    >
      <v-text-field 
        v-model.number="$v.form.paymentSum.$model"
        type="number"
        label="Сумма оплаты"
        outlined
        dense
        :style="{maxWidth: '300px'}"
      />
      <v-text-field
        v-model="$v.form.paymentDate.$model"
        type="date"
        outlined
        dense 
        label="Дата оплаты"
        :style="{maxWidth: '250px'}"
      />
      
      <app-worker-autocomplete 
        v-model="form.payingByWorker"
        label="Кто оплатил"
        dense
        outlined
        :style="{maxWidth: '350px'}"
      />
      <v-select 
        v-model="$v.form.kX.$model"
        :items="[1, 2, 4]"
        label="kX"
        outlined
        dense
        :style="{maxWidth: '80px'}"
      />
      <v-text-field
        v-model.number="$v.form.withheldSum.$model"
        type="number"
        outlined
        readonly
        dense 
        label="Удержано"
        :style="{maxWidth: '250px'}"
      />
    </div>
    <v-text-field
      v-model="$v.form.note.$model"
      label="Примечание"
      outlined
      dense
    />


    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      @click="$emit('delete')"
    >
      <v-icon
        left
        dark
      >
        mdi-delete
      </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppWorkerAutocomplete from '@/modules/common/components/workerAutocomplete'
import crewService from '../../services/crew.service'

export default {
  name: 'FineForm',
  components: {
    AppButtonsPanel,
    AppWorkerAutocomplete,
  },
  props: {
    item: { type: Object },
    displayDeleteBtn: { type: Boolean, default: false },
    openInModal: { type: Boolean, default: false },
  },
  data() {
    return {
      dateFields: ['date', 'paymentDate', 'expiryDateOfDiscount'],
      dateTimeFields: ['violationDate'],
      form: {
        date: null,
        number: null,
        category: null,
        truck: null,
        driver: null,
        totalSum: null,
        discountedSum: null,
        expiryDateOfDiscount: null,
        violationDate: null,
        address: null,
        paymentDate: null,
        paymentSum: null,
        isPaydByDriver: true,
        payingByWorker: null,
        isCulpritDriver: true,
        kX: 2,
        withheldSum: 0,
        note: null,
      },
    }
  },

  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    isNeedWithheldFromDriver () {
      return this.form.isCulpritDriver && !this.form.isPaydByDriver
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },

    formState() {
      const dates = {}
      this.dateFields.forEach(item => {        
          dates[item] = this.form[item] ? dayjs(this.form[item]).toISOString() : null
      })
      const withheldParams = {}
      if (this.form.isPaydByDriver) {
        withheldParams.withheldSum = 0
        withheldParams.payingByWorker = null
      }
      return { ...this.form, company: this.directoriesProfile, ...dates, ...withheldParams }
    },
    
    trucks() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .map((item) => ({ value: item._id, text: item.regNum }))
    },

    drivers() {
      return this.$store.getters.activeDriversOnDate(this.form.violationDate)
      .map((item) => ({ value: item._id, text: item.fullName }))
    }
    
    
  },
  watch: {
    item: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
    'form.paymentSum': {
      immediate: true,
      handler: function(val) {
        if (!val ) this.form.withheldSum = 0
        else this.form.withheldSum = this.form.kX * this.form.paymentSum
      },
    },
    'form.kX': {
      handler: function() {
        this.form.withheldSum = this.form.kX * this.form.paymentSum
      }
    }
  },

  validations() {
    return {
      form: {
        date: { required },
        number: { required },
        truck: { required },
        totalSum: { required },
        category: { required },
        discountedSum: { required },
        expiryDateOfDiscount: {},
        driver: {},
        violationDate: {},
        address: {},
        paymentDate: {},
        paymentSum: {},
        isPaydByDriver: {},
        payingByWorker: {},
        isCulpritDriver: {},
        kX: {},
        withheldSum: {},
        note: {},
      },
    }
  },
  methods: {
    async getDriver() {
      if (!this.form.truck || !this.form.violationDate) return null
      const crew = await crewService.getCrewByTruckAndDate({ truck: this.form.truck, date: this.form.violationDate})
      if (crew) this.form.driver = crew.driver
      else { 
        this.form.driver = null
        this.$store.commit('setError', 'Экипаж не найден')
      }

    },
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
 