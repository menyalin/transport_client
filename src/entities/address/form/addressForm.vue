<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="!$store.getters.hasPermission('address:write') || v$.$invalid"
      @cancel="cancel"
      @submit="submit"
    />
    <app-address-suggestion class="mt-3" @change="getParsedAddress" />

    <v-text-field v-model.trim="v$.name.$model" label="Наименование" :errorMessages="nameErrors" />

    <v-text-field v-model="v$.shortName.$model" label="Сокращенное наименование адреса" />
    <v-autocomplete
      :items="partnerItems"
      v-model="v$.partner.$model"
      item-value="_id"
      item-title="name"
      auto-select-first
      clearable
      label="Партнер"
    />
    <v-autocomplete
      v-model="v$.region.$model"
      :items="$store.getters.regionsForAutocomplete"
      auto-select-first
      label="Регион"
    />

    <v-autocomplete
      v-model="v$.city.$model"
      :items="$store.getters.citiesForAutocomplete"
      auto-select-first
      label="Город"
    />

    <v-text-field v-model="v$.note.$model" label="Примечание к адресу" />

    <v-text-field v-model="v$.geo.$model" label="Координаты" :errorMessages="geoErrors" />

    <v-text-field v-model="v$.contacts.$model" label="Контакты" />

    <v-checkbox v-model="v$.isShipmentPlace.$model" label="Место погрузки" />
    <v-checkbox v-model="v$.isDeliveryPlace.$model" label="Место разгрузки" />
    <v-checkbox v-model="v$.isService.$model" label="Сервис" />

    <v-divider />

    <v-btn v-if="displayDeleteBtn" color="error" class="mt-4" @click="$emit('delete')">
      <v-icon start>mdi-delete</v-icon> Удалить
    </v-btn>
  </div>
</template>

<script>
import AppAddressSuggestion from '@/modules/profile/components/addressSuggestion/index.vue'
import { ButtonsPanel } from '@/shared/ui'
import AppZoneAutocomplete from '@/modules/common/components/zoneAutocomplete/index.vue'

import { useForm } from './useForm'

export default {
  name: 'AddressForm',
  components: {
    AppAddressSuggestion,
    ButtonsPanel,

    AppZoneAutocomplete,
  },
  props: {
    address: Object,
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    formName: String,
    partnerItems: Array,
  },
  setup(props, ctx) {
    const { state, v$, resetForm, nameErrors, geoErrors, submit, cancel, getParsedAddress } =
      useForm(props, ctx)

    return {
      state,
      v$,
      nameErrors,
      geoErrors,
      submit,
      cancel,
      resetForm,
      getParsedAddress,
    }
  },
}
</script>

<style>
/* Добавьте стили, если необходимо */
</style>
