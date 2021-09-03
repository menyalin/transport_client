<template>
  <div>
    <app-buttons-panel
      :disabled-submit="isInvalidForm || loading"
      panel-type="form"
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
    <div
      v-else
      class="ma-3 text-caption"
    >
      Профиль настроек: {{ directoriesProfileName }}
    </div>

    <v-container fluid>
      <!-- название марка модель -->
      <v-row class="row-wrapper">
        <v-select
          v-model.trim="$v.form.tkName.$model"
          :items="tkNames"
          item-text="name"
          item-value="_id"
          label="ТК"
          dense
          outlined
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
      </v-row>
      <v-row class="row-wrapper">
        <v-select
          v-model="$v.form.type.$model"
          outlined
          label="Тип ТС"
          dense
          :items="truckTypes"
          :error-messages="typeErrors"
        />
        <v-select
          v-model="$v.form.kind.$model"
          outlined
          label="Вид ТС"
          dense
          :items="truckKinds"
        />
        <v-select
          v-model="$v.form.liftCapacityType.$model"
          outlined
          label="Тип грузоподъемности, тн"
          dense
          :items="liftCapacityTypes"
        />

        <v-text-field
          v-model.trim="$v.form.issueYear.$model"
          outlined
          label="Год выпуска"
          dense
        />

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
        <v-text-field
          v-model.trim="$v.form.win.$model"
          outlined
          label="WIN"
          dense
        />
      </v-row>
      <v-row class="row-wrapper">
        <v-text-field
          v-model.trim="$v.form.regNum.$model"
          outlined
          label="Гос.номер"
          dense
          :error-messages="regNumErrors"
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
        <v-text-field
          v-model.trim="$v.form.owner.$model"
          outlined
          label="Собственник"
          dense
        />
      </v-row>
      <v-row class="row-wrapper">
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
        <v-text-field
          v-model.number="$v.form.liftCapacity.$model"
          outlined
          label="Грузоподъемность ТС в кг"
          dense
          type="number"
        />
        <v-text-field
          v-model.number="$v.form.pltCount.$model"
          outlined
          label="Макс.кол-во плт"
          dense
          type="number"
        />
      </v-row>
      <v-row class="row-wrapper">
        <v-text-field
          v-model.trim="$v.form.note.$model"
          outlined
          label="Примечание"
          dense
        />
      </v-row>

      <v-row v-if="!!form.tkName && form.type === 'truck'">
        <app-allowed-drivers
          v-model="$v.form.allowedDrivers.$model"
          :tkName="
            typeof form.tkName === 'Object' ? form.tkName._id : form.tkName
          "
        />
      </v-row>
      <v-divider />
    </v-container>

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
import { mapGetters } from 'vuex'
import { required, numeric } from 'vuelidate/lib/validators'

import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppAllowedDrivers from './allowedDrivers.vue'

export default {
  name: 'TruckForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppAllowedDrivers,
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
      form: {
        brand: null,
        model: null,
        issueYear: null,
        startServiceDate: null,
        endServiceDate: null,
        tkName: null,
        type: null,
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
        if (!!val) this.setFormFields(val)
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
      const truck = { ...this.form, company: this.directoriesProfile }
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
      if (val.tkName?._id) this.form.tkName = val.tkName?._id
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
<style scoped>
.row-wrapper > * {
  padding: 0px 10px;
}
</style>
