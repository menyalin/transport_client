<template>
  <div>
    <ButtonsPanel
      :disabledSubmit="!$store.getters.hasPermission('truck:write') || isInvalidForm || loading"
      panelType="form"
      @cancel="cancel"
      @submit="submit"
    />
    <div>
      <div class="row-wrapper first-row">
        <div class="base-info">
          <v-autocomplete
            v-model.trim="$v.form.tkName.$model"
            :items="tkNames"
            itemTitle="name"
            itemValue="_id"
            label="ТК"
            autoSelectFirst
            variant="outlined"
            density="compact"
          />
          <v-select
            v-model="$v.form.type.$model"
            variant="outlined"
            density="compact"
            label="Тип ТС"
            :items="truckTypes"
            :errorMessages="typeErrors"
          />
          <v-select
            v-model="$v.form.liftCapacityType.$model"
            variant="outlined"
            density="compact"
            label="Грузоподъемность, тн"
            :items="liftCapacityTypes"
          />
          <template v-if="form.type === 'trailer' || form.liftCapacityType !== 20">
            <v-select
              v-model="$v.form.kind.$model"
              variant="outlined"
              label="Вид ТС"
              density="compact"
              :items="truckKinds"
            />

            <v-text-field
              v-model.number="$v.form.pltCount.$model"
              variant="outlined"
              density="compact"
              label="Макс.кол-во плт"
              type="number"
            />
          </template>
        </div>
        <div class="servive-dates">
          <DateTimeInput
            v-model="$v.form.startServiceDate.$model"
            label="Дата ввода в эксплуатацию"
            hideTimeInput
            hidePrependIcon
            outlined
            dense
            hideDetails
          />

          <DateTimeInput
            v-model="$v.form.endServiceDate.$model"
            label="Дата вывода из эксплуатации"
            hideTimeInput
            hidePrependIcon
            outlined
            dense
            hideDetails
          />
        </div>
      </div>
      <div class="row-wrapper second-row">
        <v-text-field
          v-model.trim="$v.form.regNum.$model"
          variant="outlined"
          density="compact"
          label="Гос.номер"
          :errorMessages="regNumErrors"
        />
        <v-text-field v-model.trim="$v.form.brand.$model" variant="outlined" label="Марка" density="compact" />

        <v-text-field v-model.trim="$v.form.model.$model" variant="outlined" label="Модель" density="compact" />

        <v-text-field
          v-model.trim="$v.form.issueYear.$model"
          variant="outlined"
          label="Год выпуска"
          density="compact"
        />

        <v-text-field
          v-model.number="$v.form.order.$model"
          variant="outlined"
          density="compact"
          label="Индекс в списке"
          type="number"
        />
        <v-text-field
          v-model.number="$v.form.volumeFuel.$model"
          variant="outlined"
          density="compact"
          label="Объем топливного бака"
          type="number"
        />
        <v-text-field
          v-model.number="$v.form.volumeRef.$model"
          variant="outlined"
          density="compact"
          label="Объем бака рефа"
          type="number"
        />
      </div>
      <div class="row-wrapper third-row">
        <v-text-field v-model.trim="$v.form.win.$model" variant="outlined" label="WIN" density="compact" />
        <v-text-field v-model.trim="$v.form.owner.$model" variant="outlined" label="Собственник" density="compact" />

        <v-text-field v-model.trim="$v.form.sts.$model" variant="outlined" label="СТС" density="compact" />
        <DateTimeInput
          v-model="$v.form.stsDate.$model"
          label="Дата СТС"
          hideTimeInput
          hidePrependIcon
          outlined
          dense
          hideDetails
        />
        <v-text-field v-model.trim="$v.form.pts.$model" variant="outlined" label="ПТС" density="compact" />
      </div>
      <AppInsurance v-model="insurance" title="Страховка" :truckType="form.type" />

      <AppPermits v-if="form.type === 'truck'" v-model="permits" title="Разрешения" />
      <AppAdditionalDetails v-if="form.type === 'truck'" v-model="additionalDetails" title="Доп.реквизиты" />
      <div v-if="form.type === 'trailer' || form.liftCapacityType !== 20" id="sanpassport">
        <DateTimeInput
          v-model="form.sanitaryPassportExpDate"
          label="Сан.паспорт действует до"
          hideTimeInput
          hidePrependIcon
          outlined
          dense
          hideDetails
        />
        <v-text-field
          v-model.trim="form.sanitaryPassportNote"
          variant="outlined"
          density="compact"
          label="Комментарий к сан.паспорту"
        />
      </div>

      <div id="diagnostic-card">
        <DateTimeInput
          v-model="additionalDetails.diagnosticCardExpDate"
          label="ДК действительна до"
          hidePrependIcon
          hideTimeInput
          outlined
          dense
          hideDetails
        />
        <v-text-field
          v-model.trim="additionalDetails.diagnosticCardNote"
          variant="outlined"
          density="compact"
          label="Комментарий к диагностической карте"
        />
      </div>
      <div id="leaders">
        <v-autocomplete
          v-model="form.brigadier"
          label="Бригадир"
          variant="outlined"
          density="compact"
          :items="brigadiers"
        />
        <v-autocomplete v-model="form.mechanic" label="Механик" :items="mechanics" variant="outlined" />
        density="compact"
      </div>
      <AdditionalNotifications v-model="additionalNotifications" />
      <div class="row-wrapper my-3">
        <v-textarea
          v-model.trim="$v.form.note.$model"
          variant="outlined"
          density="compact"
          rows="3"
          label="Примечание"
        />
      </div>

      <v-row v-if="!!form.tkName && form.type === 'truck'">
        <AppAllowedDrivers
          v-model="$v.form.allowedDrivers.$model"
          :tkName="typeof form.tkName === 'Object' ? form.tkName._id : form.tkName"
        />
      </v-row>
      <div class="row-wrapper my-3">
        <v-checkbox v-model="form.alwaysInSchedule" label="Всегда в распределении" />
        <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />
        <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
      </div>
      <v-divider />
    </div>
    <EntityFiles v-if="truck && truck._id" :itemId="truck._id" docType="truck" />

    <div class="delete-btn-row mt-3">
      <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
        <v-icon start>mdi-delete</v-icon>
        Удалить
      </v-btn>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { required, numeric } from '@vuelidate/validators'

  import { ButtonsPanel, DateTimeInput, AdditionalNotifications, EntityFiles } from '@/shared/ui'

  import AppAllowedDrivers from './allowedDrivers.vue'
  import AppInsurance from './insurance.vue'
  import AppPermits from './permits.vue'
  import AppAdditionalDetails from './additionalDetails.vue'

  export default {
    name: 'TruckForm',
    components: {
      ButtonsPanel,
      DateTimeInput,
      EntityFiles,
      AppAllowedDrivers,
      AppInsurance,
      AppPermits,
      AppAdditionalDetails,
      AdditionalNotifications,
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
          alwaysInSchedule: false,
          hideInFines: false,
          hasScans: false,
        },
      }
    },

    computed: {
      ...mapGetters(['myCompanies', 'directoriesProfile', 'truckTypes', 'truckKinds', 'liftCapacityTypes', 'tkNames']),
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
        return this.myCompanies.find(item => item._id === this.directoriesProfile)?.name
      },
      nameErrors() {
        const errors = []
        if (this.$v.form.name.$dirty && this.$v.form.name.$invalid && !this.loading)
          errors.push('Имя не может быть пустым')
        return errors
      },
      regNumErrors() {
        const errors = []
        if (this.$v.form.regNum.$dirty && this.$v.form.regNum.$invalid && !this.loading)
          errors.push('Гос.номер должен быть заполнен')
        return errors
      },
      typeErrors() {
        const errors = []
        if (this.$v.form.type.$dirty && this.$v.form.type.$invalid && !this.loading)
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
        liftCapacityType: { required },
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
        alwaysInSchedule: {},
        hasScans: {},
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
        keys.forEach(key => {
          this.form[key] = val[key]
        })
        if (val.additionalNotifications) this.additionalNotifications = val.additionalNotifications
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
        keys.forEach(key => {
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
    gap: 15px;
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
