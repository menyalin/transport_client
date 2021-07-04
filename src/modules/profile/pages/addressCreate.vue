<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert
          outlined
          class="ma-3 mb-5"
          type="error"
          v-if="!directoriesProfile"
        >
          Профиль справочников не выбран, сохранение адреса не возможно
        </v-alert>
        <div v-else class="ma-3 text-caption">
          Профиль настроек: {{ directoriesProfileName }}
        </div>
        <app-buttons-panel
          panelType="form"
          @cancel="cancel"
          :disabledSubmit="isInvalidForm || loading"
          @submit="submit"
        />
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
        <v-checkbox
          label="Место погрузки"
          v-model="form.isShipmentPlace"
          dense
        />
        <v-checkbox
          label="Место разгрузки"
          v-model="form.isDeliveryPlace"
          dense
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import AppAddressAutocomplete from '../components/addressAutocomplete'
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
  name: 'AddressCreate',
  components: {
    AppAddressAutocomplete,
    AppButtonsPanel,
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
  methods: {
    submit() {
      this.loading = true
      const newAddress = { ...this.form, company: this.directoriesProfile }
      this.$store
        .dispatch('createAddress', newAddress)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'AddressList' })
        })
        .catch((e) => {
          this.loading = false
          console.log('Ошибка: ', e?.message)
        })
    },
    cancel() {
      this.resetForm()
      this.$router.go(-1)
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
}
</script>
<style></style>
