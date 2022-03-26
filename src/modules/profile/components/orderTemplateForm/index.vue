<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('orderTemplate:write') || isInvalidForm
      "
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
    <div class="body-wrapper">
      <v-text-field
        v-model.trim="$v.form.name.$model"
        outlined
        label="Название шаблона"
        dense
      />
      <app-partner-autocomplete
        v-model="$v.form.client.$model"
        label="Заказчик"
        outlined
        dense
        only-clients
        hide-details
      />
      <app-req-transport
        v-model="reqTransport"
        title="Требования к транспорту"
      />
      <app-cargo-params
        v-model="cargoParams"
        title="Параметры груза"
      />
      <v-checkbox
        v-model="form.fixedTimeSlots"
        hide-details
        color="primary"
        label="Маршрут имеет фиксированные временные окна"
      />
      <app-route-points
        v-model="route"
        title="Маршрут"
        :isValid="isValidRoute"
        :fixedTimeSlots="form.fixedTimeSlots"
        is-template
      />
    </div>

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
import { required } from 'vuelidate/lib/validators'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppReqTransport from '@/modules/order/components/orderForm/reqTransport'
import AppRoutePoints from '@/modules/order/components/orderForm/routePoints'
import AppCargoParams from '@/modules/order/components/orderForm/cargoParams'
export default {
  name: 'OrderTemplateForm',
  components: {
    AppButtonsPanel,
    AppPartnerAutocomplete,
    AppRoutePoints,
    AppReqTransport,
    AppCargoParams,
  },
  props: {
    orderTemplate: {
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
      route: [{ type: 'loading' }, { type: 'unloading' }],
      cargoParams: {},
      reqTransport: {},
      form: {
        name: null,
        client: null,
        fixedTimeSlots: false,
      },
    }
  },

  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid || !this.isValidRoute
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },
    isValidRoute() {
      if (!this.route || this.route.length === 0) return false
      const length = this.route.length >= 2
      const firstPoint = this.route[0]?.type === 'loading'
      const lastPoint = this.route[this.route.length - 1].type === 'unloading'
      const hasAddresses =
        this.route.filter((item) => !!item.address).length === this.route.length
      return length && firstPoint && lastPoint && hasAddresses
    },

    formState() {
      return {
        ...this.form,
        company: this.directoriesProfile,
        reqTransport: this.reqTransport,
        route: this.route,
        cargoParams: this.cargoParams,
      }
    },
  },
  watch: {
    orderTemplate: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations() {
    return {
      form: {
        name: { required },
        client: { required },
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
      if (val.cargoParams) this.cargoParams = val.cargoParams
      if (val.reqTransport) this.reqTransport = val.reqTransport
      if (val.route.length) this.route = val.route
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      this.reqTransport = Object.assign({})
      this.route = []
      this.cargoParams = Object.assign({})
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = null
      })
    },
  },
}
</script>
<style scoped>
.body-wrapper {
  margin-bottom: 20px;
  padding: 10px;
  display: grid;
  gap: 15px;
}

.row-input {
  display: flex;
  flex-direction: row;
}
</style>
