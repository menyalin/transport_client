<template>
  <v-container>
    <v-row>
      <v-col>
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
        <div class="wrapper">
          <div class="text-caption px-5 py-2">
            Период отображения рейса
          </div>
          <p>{{ formState }}</p>

          <div class="dates-position-block">
            <app-date-time-input
              v-model="$v.form.startPositionDate.$model"
              label="Дата начала"
              hideDetails
              @blur="$v.form.startPositionDate.$touch()"
            />
            <app-date-time-input
              v-model="$v.form.endPositionDate.$model"
              :disabled="!form.startPositionDate"
              label="Дата завершения"
              :errorMessages="endPositionDateErrors"
              :minDate="form.startPositionDate"
              hideDetails
              @blur="$v.form.endPositionDate.$touch()"
            />
          </div>
          <h6>Параметры груза</h6>
          <app-cargo-params v-model="cargoParams" />
          <h6>Требования к транспорту</h6>
          <app-req-transport v-model="reqTransport" />
          <h6>Маршрут</h6>
          <app-route-points v-model="points" />
        </div>
        <v-btn
          v-if="displayDeleteBtn"
          color="error"
          class="ma-4"
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppCargoParams from './cargoParams.vue'
import AppRoutePoints from './routePoints.vue'
import AppReqTransport from './reqTransport.vue'
import { required, numeric } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderForm',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
    AppReqTransport,
    AppCargoParams,
    AppRoutePoints,
  },
  props: {
    order: {
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
      orderId: null,
      cargoParams: {
        weight: null,
        places: null,
        note: null,
        tRegime: null,
      },
      points: [
        { type: 'loading', address: null, plannedDate: '', note: '' },
        { type: 'unloading', address: null, plannedDate: '', note: '' },
      ],
      reqTransport: {},
      form: {
        startPositionDate: null,
        endPositionDate: null,
      },
    }
  },

  computed: {
    ...mapGetters(['directoriesProfile', 'myCompanies']),
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
    endPositionDateErrors() {
      let errors = []
      if (!this.$v.form.endPositionDate.isLaterThan)
        errors.push('Дата должна быть больше начальной даты')
      return errors
    },
    formState() {
      return {
        ...this.form,
        points: this.points,
        company: this.directoriesProfile,
        cargoParams: this.cargoParams,
        reqTransport: this.reqTransport,
      }
    },
  },
  watch: {
    order: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.orderId = val._id
          this.setFormFields(val)
        }
      },
    },
  },
  validations() {
    return {
      form: {
        startPositionDate: { required },
        endPositionDate: {
          required,
          isLaterThan: isLaterThan(this.form.startPositionDate),
        },
        note: {},
      },
    }
  },
  methods: {
    submit() {
      if (!this.directoriesProfile) return null

      this.$emit('submit', this.formState)
    },
    cancel() {
      this.$emit('cancel')
    },
    setFormFields(val) {
      const keys = Object.keys(this.form)
      if (val.points) this.points = val.points
      if (val.cargoParams) this.cargoParams = val.cargoParams
      if (val.reqTransport) this.reqTransport = val.reqTransport
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      this.points = []
      this.cargoParams = { ...{} }
      this.reqTransport = { ...{} }
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style scoped>
.dates-position-block {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 10px;
}
.dates-position-block > div {
  padding: 0px 15px;
}
</style>
