<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="!$store.getters.hasPermission('address:write') || v$.$invalid"
      @cancel="cancel"
      @submit="submit"
    />
    <address-suggestion class="mt-3" @change="getParsedAddress" />

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

    <v-autocomplete v-model="v$.city.$model" :items="cityItems" label="Город" item-title="title" />

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

<script setup>
import AddressSuggestion from '@/entities/address/addressSuggestion.vue'
import { ButtonsPanel } from '@/shared/ui'
import { useForm } from './useForm'

defineOptions({ name: 'AddressForm' })

const props = defineProps({
  address: Object,
  cityItems: { type: Array, required: true },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
  formName: String,
  partnerItems: Array,
})

const emit = defineEmits(['delete', 'submit', 'cancel'])

const { v$, nameErrors, geoErrors, submit, cancel, getParsedAddress } = useForm(props, emit)
</script>
