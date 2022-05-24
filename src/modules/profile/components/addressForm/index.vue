<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('address:write') ||
          isInvalidForm ||
          loading
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
      Профиль справочников не выбран, сохранение адреса не возможно
    </v-alert>
    <div
      v-else
      class="ma-3 text-caption"
    >
      Профиль настроек: {{ directoriesProfileName }}
    </div>
    <app-address-suggestion
      class="mt-3"
      @change="getParsedAddress"
    />

    <v-text-field
      v-model.trim="$v.form.name.$model"
      outlined
      label="Наименование"
      dense
      :hint="addressNameHint"
      :error-messages="nameErrors"
    />
    <v-text-field
      v-model="$v.form.shortName.$model"
      outlined
      dense
      label="Сокращенное наименование адреса"
      :hint="addressShortNameHint"
    />
    <v-text-field
      v-model="$v.form.region.$model"
      outlined
      dense
      label="Регион (область)"
    />
    <v-text-field
      v-model="$v.form.city.$model"
      outlined
      dense
      label="Город (населенный пункт)"
    />
    <app-partner-autocomplete
      v-model="$v.form.partner.$model"
      dense
      outlined
      label="Партнер"
    />
    <v-text-field
      v-model="$v.form.note.$model"
      outlined
      dense
      label="Примечание к адресу"
      :hint="addressShortNameHint"
    />
    <v-text-field
      v-model="$v.form.geo.$model"
      outlined
      dense
      label="Координаты"
      :hint="addressGeoHint"
      :error-messages="geoErrors"
    />
    <app-zone-autocomplete
      v-model="$v.form.zones.$model"
      dense
      multiple
      outlined
      label="Зоны"
    />
    <v-text-field
      v-model="$v.form.contacts.$model"
      outlined
      dense
      label="Контакты"
    />
    <v-text-field
      v-model="$v.form.label.$model"
      outlined
      dense
      label="Метки для поиска"
      :hint="addressLabelHint"
    />
    <v-checkbox
      v-model="form.isShipmentPlace"
      label="Место погрузки"
      dense
    />
    <v-checkbox
      v-model="form.isDeliveryPlace"
      label="Место разгрузки"
      dense
    />
    <v-checkbox
      v-model="form.isService"
      label="Сервис"
      dense
    />
    <app-similar-addresses
      v-if="!displayDeleteBtn && similarAddresses.length"
      :addresses="similarAddresses"
    />
    <v-divider />
    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      class="mt-4"
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

import AppAddressSuggestion from '@/modules/profile/components/addressSuggestion'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import AppZoneAutocomplete from '@/modules/common/components/zoneAutocomplete'
import AppSimilarAddresses from './similarAddresses.vue'
import addressService from '../../services/address.service'

const validCoordinates = (val) => {
  if (!val) return true
  const arr = val.split(',')
  return (
    arr.length === 2 &&
    +arr[0] >= -90 &&
    +arr[0] <= 90 &&
    +arr[1] >= -180 &&
    +arr[1] <= 180
  )
}

export default {
  name: 'AddressForm',
  components: {
    AppAddressSuggestion,
    AppButtonsPanel,
    AppPartnerAutocomplete,
    AppSimilarAddresses,
    AppZoneAutocomplete,
  },
  props: {
    address: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    formName: String,
  },
  data() {
    return {
      loading: false,
      addressNameHint: 'Наименование адреса',
      addressLabelHint: 'Будет использоваться для поиска по ключевым словам',
      addressGeoHint:
        'Координаты адреса в формате "Ширина, Долгота", пример "55.75396, 37.620393"',
      addressShortNameHint: 'Сокращенное наименование адреса',
      parsedAddress: null,
      similarAddresses: [],
      form: {
        name: null,
        label: null,
        region: null,
        city: null,
        geo: null,
        shortName: null,
        note: null,
        isShipmentPlace: false,
        isDeliveryPlace: false,
        isService: false,
        partner: null,
        zones: [],
        contacts: null,
      },
    }
  },

  computed: {
    ...mapGetters(['myCompanies', 'directoriesProfile']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },
    nameErrors() {
      const errors = []
      if (this.$v.form.name.$dirty && this.$v.form.name.$invalid)
        errors.push('Наименование адреса не может быть пустым')
      return errors
    },
    geoErrors() {
      const errors = []
      if (this.$v.form.geo.$dirty && this.$v.form.geo.$invalid)
        errors.push('Введенные координаты не корректны')
      return errors
    },
    formState() {
      return { ...this.form }
    },
  },
  watch: {
    address: {
      immediate: true,
      handler: function (val) {
        if (!!val) this.setFormFields(val)
      },
    },
    ['form.name']: {
      handler: async function (val) {
        if (!val) {
          this.similarAddresses = []
          return null
        }
        await this.searchSimilarAddresses()
      },
    },
  },
  validations: {
    form: {
      name: { required },
      label: {},
      geo: {
        validCoordinates,
      },
      shortName: {},
      note: {},
      region: {},
      city: {},
      partner: {},
      zones: {},
      contacts: {},
    },
  },

  methods: {
    async searchSimilarAddresses() {
      this.similarAddresses = await addressService.search({
        search: this.form.name,
        profile: this.directoriesProfile,
      })
    },
    submit() {
      const address = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', address)
      this.$nextTick(() => {
        this.resetForm()
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    setFormFields(val) {
      this.form.name = val.name
      this.form.label = val.label
      this.form.geo = val.geo
      this.form.shortName = val.shortName
      this.form.note = val.note
      this.form.isShipmentPlace = val.isShipmentPlace
      this.form.isDeliveryPlace = val.isDeliveryPlace
      this.form.partner = val.partner
      this.form.isService = val.isService
      this.form.zones = val.zones
      this.form.contacts = val.contacts
      this.form.region = val.region
      this.form.city = val.city
    },
    resetForm() {
      this.form.name = null
      this.form.label = null
      this.form.geo = null
      this.form.shortName = null
      this.form.note = null
      this.form.isShipmentPlace = false
      this.form.isDeliveryPlace = false
      this.form.partner = null
      this.form.isService = false
      this.form.zones = []
      this.form.contacts = null
      this.form.region = null
      this.form.city = null
    },
    getParsedAddress(val) {
      if (!val) this.resetForm()
      else {
        this.parsedAddress = Object.assign({}, val)
        this.form.name = val.value
        this.form.region = val.data?.region_with_type
        this.form.city = val.data.city || val.data.settlement
        if (val.geo) this.geo = val.geo
        else if (!!val.data.geo_lat && val.data.geo_lon)
          this.form.geo = `${val.data.geo_lat}, ${val.data.geo_lon}`
      }
    },
  },
}
</script>
<style></style>
