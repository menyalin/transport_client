<template>
  <div>
    <buttons-panel
      :disabledSubmit="
        !$store.getters.hasPermission('truck:write') || isInvalidForm || loading
      "
      panel-type="form"
      @cancel="cancel"
      @submit="submit"
    />
    <div>
      <div class="row-wrapper first-row">
        <div class="base-info">
          <v-select
            v-model.trim="$v.form.tkName.$model"
            :items="tkNames"
            item-text="name"
            item-value="_id"
            label="ТК"
            dense
            outlined
          />
          <v-select
            v-model="$v.form.type.$model"
            outlined
            label="Тип ТС"
            dense
            :items="truckTypes"
            :error-messages="typeErrors"
          />
          <v-select
            v-model="$v.form.liftCapacityType.$model"
            outlined
            label="Грузоподъемность, тн"
            dense
            :items="liftCapacityTypes"
          />
          <template
            v-if="form.type === 'trailer' || form.liftCapacityType !== 20"
          >
            <v-select
              v-model="$v.form.kind.$model"
              outlined
              label="Вид ТС"
              dense
              :items="truckKinds"
            />

            <v-text-field
              v-model.number="$v.form.pltCount.$model"
              outlined
              label="Макс.кол-во плт"
              dense
              type="number"
            />
          </template>
        </div>
        <div class="servive-dates">
          <app-date-time-input
            v-model="$v.form.startServiceDate.$model"
            label="Дата ввода в эксплуатацию"
            hide-time-input
            hide-prepend-icon
          />

          <app-date-time-input
            v-model="$v.form.endServiceDate.$model"
            label="Дата вывода из эксплуатации"
            hide-time-input
            hide-prepend-icon
          />
        </div>
      </div>
      <div class="row-wrapper second-row">
        <v-text-field
          v-model.trim="$v.form.regNum.$model"
          outlined
          label="Гос.номер"
          dense
          :error-messages="regNumErrors"
        />
        <v-text-field
          v-model.trim="$v.form.brand.$model"
          outlined
          label="Марка"
          dense
        />

        <v-text-field
          v-model.trim="$v.form.model.$model"
          outlined
          label="Модель"
          dense
        />

        <v-text-field
          v-model.trim="$v.form.issueYear.$model"
          outlined
          label="Год выпуска"
          dense
        />

        <v-text-field
          v-model.number="$v.form.order.$model"
          outlined
          label="Индекс в списке"
          dense
          type="number"
        />
        <v-text-field
          v-model.number="$v.form.volumeFuel.$model"
          outlined
          label="Объем топливного бака"
          dense
          type="number"
        />
        <v-text-field
          v-model.number="$v.form.volumeRef.$model"
          outlined
          label="Объем бака рефа"
          dense
          type="number"
        />
      </div>
      <div class="row-wrapper third-row">
        <v-text-field
          v-model.trim="$v.form.win.$model"
          outlined
          label="WIN"
          dense
        />
        <v-text-field
          v-model.trim="$v.form.owner.$model"
          outlined
          label="Собственник"
          dense
        />

        <v-text-field
          v-model.trim="$v.form.sts.$model"
          outlined
          label="СТС"
          dense
        />
        <app-date-time-input
          v-model="$v.form.stsDate.$model"
          label="Дата СТС"
          hide-time-input
          hide-prepend-icon
        />
        <v-text-field
          v-model.trim="$v.form.pts.$model"
          outlined
          label="ПТС"
          dense
        />
      </div>
      <app-insurance
        v-model="insurance"
        title="Страховка"
        :truckType="form.type"
      />

      <app-permits
        v-if="form.type === 'truck'"
        v-model="permits"
        title="Разрешения"
      />
      <app-additional-details
        v-if="form.type === 'truck'"
        v-model="additionalDetails"
        title="Доп.реквизиты"
      />
      <div
        v-if="form.type === 'trailer' || form.liftCapacityType !== 20"
        id="sanpassport"
      >
        <app-date-time-input
          v-model="form.sanitaryPassportExpDate"
          label="Сан.паспорт действует до"
          hide-time-input
          hide-prepend-icon
        />
        <v-text-field
          v-model.trim="form.sanitaryPassportNote"
          outlined
          label="Комментарий к сан.паспорту"
          dense
        />
      </div>

      <div id="diagnostic-card">
        <app-date-time-input
          v-model="additionalDetails.diagnosticCardExpDate"
          label="ДК действительна до"
          hide-prepend-icon
          hide-time-input
        />
        <v-text-field
          v-model.trim="additionalDetails.diagnosticCardNote"
          outlined
          label="Комментарий к диагностической карте"
          dense
        />
      </div>
      <div id="leaders">
        <v-autocomplete
          v-model="form.brigadier"
          label="Бригадир"
          outlined
          :items="brigadiers"
          dense
        />
        <v-autocomplete
          v-model="form.mechanic"
          label="Механик"
          :items="mechanics"
          outlined
          dense
        />
      </div>
      <app-additional-notifications v-model="additionalNotifications" />
      <div class="row-wrapper my-3">
        <v-textarea
          v-model.trim="$v.form.note.$model"
          outlined
          rows="3"
          label="Примечание"
          dense
        />
      </div>

      <v-row v-if="!!form.tkName && form.type === 'truck'">
        <app-allowed-drivers
          v-model="$v.form.allowedDrivers.$model"
          :tkName="
            typeof form.tkName === 'Object' ? form.tkName._id : form.tkName
          "
        />
      </v-row>
      <div class="row-wrapper my-3">
        <v-checkbox
          v-model="form.hideInFines"
          label="Не показывать в штрафах"
        />
      </div>
      <v-divider />
    </div>
    <div class="delete-btn-row mt-3">
      <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
        <v-icon left dark> mdi-delete </v-icon>
        Удалить
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required, numeric } from 'vuelidate/lib/validators'

import { ButtonsPanel } from '@/shared/ui'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppAllowedDrivers from './allowedDrivers.vue'
import AppInsurance from './insurance.vue'
import AppPermits from './permits.vue'
import AppAdditionalDetails from './additionalDetails .vue'
import AppAdditionalNotifications from '@/modules/common/components/additionalNotifications'

export default {
  name: 'TruckForm',
  components: {
    ButtonsPanel,
    AppDateTimeInput,
    AppAllowedDrivers,
    AppInsurance,
    AppPermits,
    AppAdditionalDetails,
    AppAdditionalNotifications,
  },
  props: {
    truck: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      insurance: {},
      additionalDetails: {},
      additionalNotifications: [],
      permits: {},
      form: {
        brigadier: null,
        mechanic: null,
        sanitaryPassportExpDate: null,
        sanitaryPassportNote: null,
        brand: null,
        model: null,
        issueYear: null,
        startServiceDate: null,
        endServiceDate: null,
        tkName: null,
        type: 'truck',
        kind: null,
        liftCapacityType: null,
        regNum: null,
        win: null,
        sts: null,
        stsDate: null,
        pts: null,
        owner: null,
        volumeFuel: null,
        volumeRef: null,
        liftCapacity: null,
        pltCount: null,
        note: null,
        allowedDrivers: null,
        order: 50,
        hideInFines: false,
      },
    }
  },

  computed: {
    ...mapGetters([
      'myCompanies',
      'directoriesProfile',
      'truckTypes',
      'truckKinds',
      'liftCapacityTypes',
      'tkNames',
    ]),
    brigadiers() {
      return this.$store.getters.brigadiersForSelect
    },
    mechanics() {
      return this.$store.getters.mechanicsForSelect
    },
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      )?.name
    },
    nameErrors() {
      const errors = []
      if (
        this.$v.form.name.$dirty &&
        this.$v.form.name.$invalid &&
        !this.loading
      )
        errors.push('Имя не может быть пустым')
      return errors
    },
    regNumErrors() {
      const errors = []
      if (
        this.$v.form.regNum.$dirty &&
        this.$v.form.regNum.$invalid &&
        !this.loading
      )
        errors.push('Гос.номер должен быть заполнен')
      return errors
    },
    typeErrors() {
      const errors = []
      if (
        this.$v.form.type.$dirty &&
        this.$v.form.type.$invalid &&
        !this.loading
      )
        errors.push('Тип должен быть заполнен')
      return errors
    },
  },
  watch: {
    truck: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },
  validations: {
    form: {
      brand: {},
      model: {},
      issueYear: {},
      startServiceDate: {},
      endServiceDate: {},
      tkName: { required },
      type: { required },
      kind: {},
      liftCapacity: { numeric },
      liftCapacityType: { required, numeric },
      regNum: { required },
      win: {},
      sts: {},
      stsDate: {},
      pts: {},
      owner: {},
      volumeFuel: { numeric },
      volumeRef: { numeric },
      pltCount: { numeric },
      note: {},
      allowedDrivers: {},
      order: { numeric },
    },
  },

  methods: {
    submit() {
      const truck = {
        ...this.form,
        company: this.directoriesProfile,
        insurance: this.insurance,
        permits: this.permits,
        additionalDetails: this.additionalDetails,
        additionalNotifications: this.additionalNotifications,
      }
      this.$emit('submit', truck)
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
      if (val.additionalNotifications)
        this.additionalNotifications = val.additionalNotifications
      if (val.insurance) this.insurance = val.insurance
      if (val.permits) this.permits = val.permits
      if (val.additionalDetails) this.additionalDetails = val.additionalDetails
      if (val.tkName?._id) this.form.tkName = val.tkName._id
    },
    resetForm() {
      const keys = Object.keys(this.form)
      this.insurance = { ...{} }
      this.permits = { ...{} }
      this.additionalNotifications = []
      this.additionalDetails = { ...{} }
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style scoped>
.row-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.first-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.base-info {
  display: grid;
  grid-template-columns: 250px 130px 130px 180px 180px;
  gap: 10px;
}
.servive-dates {
  display: flex;
  flex-direction: row;
}
.servive-dates > * {
  margin-right: 10px;
  width: 230px;
}
.delete-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.second-row {
  display: grid;
  grid-template-columns: 180px 1fr 1fr 150px 150px 170px 170px;
  gap: 10px;
}
.third-row {
  display: grid;
  gap: 10px;
  grid-template-columns: 250px 250px 250px 200px 250px;
}
#sanpassport {
  display: grid;
  gap: 10px;
  grid-template-columns: 200px auto;
}
#leaders {
  display: grid;
  gap: 10px;
  grid-template-columns: 300px 300px;
}
#diagnostic-card {
  display: grid;
  gap: 10px;
  grid-template-columns: 220px 400px;
}
</style>
