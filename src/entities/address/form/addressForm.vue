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
    <app-address-suggestion
      class="mt-3"
      @update:model-value="getParsedAddress"
    />

    <v-text-field
      v-model.trim="v$.name.$model"
      variant="outlined"
      label="Наименование"
      density="compact"
      :errorMessages="nameErrors"
    />
    <v-text-field
      v-model="v$.shortName.$model"
      variant="outlined"
      density="compact"
      label="Сокращенное наименование адреса"
    />
    <AutoCompleteWithActions
      v-model="v$.partner.$model"
      :items="partnerItems"
      item-value="_id"
      item-title="name"
      auto-select-first
      clearable
      density="compact"
      variant="outlined"
      label="Партнер"
      @create="createPartnerHandler"
      @edit="updatePartnerHandler"
    />
    <v-autocomplete
      v-model="v$.region.$model"
      :items="$store.getters.regionsForAutocomplete"
      auto-select-first
      variant="outlined"
      density="compact"
      label="Регион"
    />
    <v-autocomplete
      v-model="v$.city.$model"
      :items="$store.getters.citiesForAutocomplete"
      auto-select-first
      variant="outlined"
      density="compact"
      label="Город"
    />
    <v-text-field
      v-model="v$.note.$model"
      variant="outlined"
      density="compact"
      label="Примечание к адресу"
    />
    <v-text-field
      v-model="v$.geo.$model"
      variant="outlined"
      density="compact"
      label="Координаты"
      :errorMessages="geoErrors"
    />
    <app-zone-autocomplete
      v-model="v$.zones.$model"
      density="compact"
      multiple
      variant="outlined"
      label="Зоны"
    />
    <v-text-field
      v-model="v$.contacts.$model"
      variant="outlined"
      density="compact"
      label="Контакты"
    />
    <v-checkbox
      v-model="v$.isShipmentPlace.$model"
      label="Место погрузки"
      density="compact"
    />
    <v-checkbox
      v-model="v$.isDeliveryPlace.$model"
      label="Место разгрузки"
      density="compact"
    />
    <v-checkbox
      v-model="v$.isService.$model"
      label="Сервис"
      density="compact"
    />

    <v-divider />

    <v-btn
      v-if="displayDeleteBtn"
      color="error"
      class="mt-4"
      @click="$emit('delete')"
    >
      <v-icon start>mdi-delete</v-icon> Удалить
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
