<template>
  <div>
    <app-buttons-panel
      panel-type="form"
      :disabled-submit="isInvalidForm || loading"
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
    <app-address-autocomplete
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
    <app-autocomplete
      v-model="$v.form.partner.$model"
      dense
      outlined
      label="Партнер"
      itemsGetter="partnersForAutocomplete"
      :formName="formName"
      createItemPath="/profile/partners/create"
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

import AppAddressAutocomplete from '@/modules/profile/components/addressAutocomplete'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppAutocomplete from '@/modules/common/components/autocomplete'

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
    AppAddressAutocomplete,
    AppButtonsPanel,
    AppAutocomplete,
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
      form: {
        name: null,
        label: null,
        geo: null,
        shortName: null,
        note: null,
        isShipmentPlace: false,
        isDeliveryPlace: false,
        partner: null,
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
  },
  beforeDestroy() {
    this.$emit('saveToCache', this.formState)
  },
  validations: {
    form: {
      name: { required },
      label: {},
      geo: {
        required,
        validCoordinates,
      },
      shortName: {},
      note: {},
      partner: {},
    },
  },

  methods: {
    submit() {
      const address = { ...this.form, company: this.directoriesProfile }
      this.$emit('submit', address)
      this.resetForm()
    },
    cancel() {
      this.resetForm()
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
    },
    getParsedAddress(val) {
      if (!val) {
        this.resetForm()
      } else {
        // ---------------------------
        this.parsedAddress = Object.assign({}, val)
        this.form.name = val.value
        if (val.geo) this.geo = val.geo
        else if (!!val.data.geo_lat && val.data.geo_lon)
          this.form.geo = `${val.data.geo_lat}, ${val.data.geo_lon}`
        // ---------------------------
      }
    },
  },
}
</script>
<style></style>
