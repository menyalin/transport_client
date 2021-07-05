<template>
  <div>
    <app-buttons-panel
      panelType="form"
      @cancel="cancel"
      :disabledSubmit="isInvalidForm || loading"
      @submit="submit"
    />
    <v-alert outlined class="ma-3 mb-5" type="error" v-if="!directoriesProfile">
      Профиль справочников не выбран, сохранение адреса не возможно
    </v-alert>
    <div v-else class="ma-3 text-caption">
      Профиль настроек: {{ directoriesProfileName }}
    </div>
    <app-address-autocomplete @change="getParsedAddress" class="mt-3" />

    <v-text-field
      outlined
      label="Наименование"
      dense
      v-model.trim="$v.form.name.$model"
      :hint="addressNameHint"
      :error-messages="nameErrors"
    />
    <v-text-field
      outlined
      dense
      label="Сокращенное наименование адреса"
      v-model="$v.form.shortName.$model"
      :hint="addressShortNameHint"
    />
    <v-text-field
      outlined
      dense
      label="Примечание к адресу"
      v-model="$v.form.note.$model"
      :hint="addressShortNameHint"
    />
    <v-text-field
      outlined
      dense
      label="Координаты"
      v-model="$v.form.geo.$model"
      :hint="addressGeoHint"
      :error-messages="geoErrors"
    />
    <v-text-field
      outlined
      dense
      label="Метки для поиска"
      v-model="$v.form.label.$model"
      :hint="addressLabelHint"
    />
    <v-checkbox label="Место погрузки" v-model="form.isShipmentPlace" dense />
    <v-checkbox label="Место разгрузки" v-model="form.isDeliveryPlace" dense />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить</v-btn
    >
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import AppAddressAutocomplete from '@/modules/profile/components/addressAutocomplete'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

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
  },
  props: {
    address: {
      type: Object,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
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
      },
    }
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
    },
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
    },
    resetForm() {
      this.form.name = null
      this.form.label = null
      this.form.geo = null
      this.form.shortName = null
      this.form.note = null
      this.form.isShipmentPlace = false
      this.form.isDeliveryPlace = false
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
