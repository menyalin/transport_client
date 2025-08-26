<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('orderTemplate:write') || isInvalidForm
      "
      @cancel="cancel"
      @submit="submit"
    />
    <div class="body-wrapper">
      <v-text-field
        v-model.trim="v$.form.name.$model"
        outlined
        label="Название шаблона"
        dense
      />
      <div id="client-row">
        <v-autocomplete
          v-model="v$.form.client.$model"
          :items="clientItems"
          item-text="name"
          item-value="_id"
          label="Заказчик"
          outlined
          dense
          hide-details
          :style="{ 'max-width': '350px' }"
        />

        <v-select
          v-model="analytics.type"
          label="Тип рейса"
          :items="$store.getters.orderAnalyticTypes"
          clearable
          hide-details
          dense
          outlined
          :style="{ 'max-width': '180px' }"
        />
      </div>

      <ReqTransport v-model="reqTransport" title="Требования к транспорту" />
      <CargoParams v-model="cargoParams" title="Параметры груза" />
      <v-checkbox
        v-model="form.fixedTimeSlots"
        hide-details
        color="primary"
        label="Маршрут имеет фиксированные временные окна"
      />
      <OrderRoute
        v-model="route"
        title="Маршрут"
        :isValid="isValidRoute"
        :fixedTimeSlots="form.fixedTimeSlots"
        is-template
      />
    </div>

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { ButtonsPanel } from '@/shared/ui'
import { OrderRoute } from '@/entities/order'
import { ReqTransport, CargoParams } from '@/entities/order'
import store from '@/store/index'
export default {
  name: 'OrderTemplateForm',
  components: {
    ButtonsPanel,

    OrderRoute,
    ReqTransport,
    CargoParams,
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
  setup() {
    return {
      clientItems: store.getters.partners.filter((partner) => partner.isClient),
      v$: useVuelidate(),
    }
  },
  data() {
    return {
      route: [{ type: 'loading' }, { type: 'unloading' }],
      cargoParams: {},
      reqTransport: {},
      analytics: {
        type: null,
      },
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
      return this.v$.$invalid || !this.isValidRoute
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
        analytics: this.analytics,
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
      if (val.analytics) this.analytics = val.analytics
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      this.reqTransport = Object.assign({})
      this.route = []
      this.cargoParams = Object.assign({})
      this.analytics = Object.assign({})
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
#client-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
