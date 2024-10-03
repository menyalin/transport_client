<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('address:write') || v$.$invalid
      "
      @cancel="cancel"
      @submit="submit"
    />
    <app-address-suggestion class="mt-3" @change="getParsedAddress" />

    <v-text-field
      v-model.trim="v$.name.$model"
      outlined
      label="Наименование"
      dense
      :errorMessages="nameErrors"
    />

    <v-text-field
      v-model="v$.shortName.$model"
      outlined
      dense
      label="Сокращенное наименование адреса"
    />
    <AutoCompleteWithActions
      :items="partnerItems"
      v-model="v$.partner.$model"
      item-value="_id"
      item-text="name"
      auto-select-first
      clearable
      dense
      outlined
      label="Партнер"
      @create="createPartnerHandler"
      @edit="updatePartnerHandler"
    />
    <v-autocomplete
      v-model="v$.region.$model"
      :items="$store.getters.regionsForAutocomplete"
      auto-select-first
      outlined
      dense
      label="Регион"
    />

    <v-autocomplete
      v-model="v$.city.$model"
      :items="$store.getters.citiesForAutocomplete"
      auto-select-first
      outlined
      dense
      label="Город"
    />

    <app-partner-autocomplete
      v-model="v$.partner.$model"
      dense
      outlined
      label="Партнер"
    />

    <v-text-field
      v-model="v$.note.$model"
      outlined
      dense
      label="Примечание к адресу"
    />

    <v-text-field
      v-model="v$.geo.$model"
      outlined
      dense
      label="Координаты"
      :errorMessages="geoErrors"
    />

    <app-zone-autocomplete
      v-model="v$.zones.$model"
      dense
      multiple
      outlined
      label="Зоны"
    />

    <v-text-field
      v-model="v$.contacts.$model"
      outlined
      dense
      label="Контакты"
    />

    <v-checkbox
      v-model="v$.isShipmentPlace.$model"
      label="Место погрузки"
      dense
    />
    <v-checkbox
      v-model="v$.isDeliveryPlace.$model"
      label="Место разгрузки"
      dense
    />
    <v-checkbox v-model="v$.isService.$model" label="Сервис" dense />

    <v-divider />

    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      class="mt-4"
      @click="$emit('delete')"
    >
      <v-icon left>mdi-delete</v-icon> Удалить
    </v-btn>
  </div>
</template>

<script>
import AppAddressSuggestion from '@/modules/profile/components/addressSuggestion'
import { ButtonsPanel, AutoCompleteWithActions } from '@/shared/ui'
import AppZoneAutocomplete from '@/modules/common/components/zoneAutocomplete'

import { useForm } from './useForm'

export default {
  name: 'AddressForm',
  components: {
    AppAddressSuggestion,
    ButtonsPanel,

    AppZoneAutocomplete,
    AutoCompleteWithActions,
  },
  props: {
    address: Object,
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
    formName: String,
    partnerItems: Array,
    partnerActions: Object,
  },
  setup(props, ctx) {
    const {
      state,
      v$,
      resetForm,
      nameErrors,
      geoErrors,
      submit,
      cancel,
      getParsedAddress,
      createPartnerHandler,
      updatePartnerHandler,
    } = useForm(props, ctx)

    return {
      state,
      v$,
      nameErrors,
      geoErrors,
      createPartnerHandler,
      updatePartnerHandler,
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
