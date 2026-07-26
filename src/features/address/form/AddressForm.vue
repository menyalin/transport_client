<template>
  <FormWrapper>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="!$store.getters.hasPermission('address:write') || v$.$invalid"
      @cancel="cancel"
      @submit="submit"
    />
    <AddressSuggestion class="mt-3" @change="getParsedAddress" :style="{ minWidth: '800px' }" />

    <v-text-field
      v-model.trim="v$.name.$model"
      label="Наименование"
      :errorMessages="nameErrors"
      :style="{ minWidth: '800px' }"
    />

    <v-text-field
      v-model="v$.shortName.$model"
      label="Сокращенное наименование адреса"
      :style="{ minWidth: '800px' }"
    />
    <v-autocomplete
      v-model="v$.partner.$model"
      item-value="_id"
      :items="partnerItems"
      item-title="name"
      label="Партнер"
      :style="{ minWidth: '800px' }"
    />
    <v-autocomplete
      v-model="v$.region.$model"
      :items="$store.getters.regionsForAutocomplete"
      label="Регион"
      :style="{ minWidth: '800px' }"
    />

    <v-autocomplete
      v-model="v$.city.$model"
      :items="cityItems"
      label="Город"
      item-title="title"
      :style="{ minWidth: '800px' }"
    />

    <v-text-field
      v-model="v$.note.$model"
      label="Примечание к адресу"
      :style="{ minWidth: '800px' }"
    />

    <v-text-field
      v-model="v$.geo.$model"
      label="Координаты"
      :errorMessages="geoErrors"
      :style="{ minWidth: '800px' }"
    />

    <v-autocomplete
      v-model="v$.zones.$model"
      :items="zoneItems"
      label="Зоны"
      multiple
      item-title="title"
      :style="{ minWidth: '800px' }"
    />

    <v-text-field v-model="v$.contacts.$model" label="Контакты" :style="{ minWidth: '800px' }" />

    <v-checkbox v-model="v$.isShipmentPlace.$model" label="Место погрузки" hide-details />
    <v-checkbox v-model="v$.isDeliveryPlace.$model" label="Место разгрузки" hide-details />
    <v-checkbox v-model="v$.isService.$model" label="Сервис" hide-details />

    <v-divider />

    <v-btn v-if="displayDeleteBtn" color="error" class="mt-4" @click="$emit('delete')">
      <v-icon start>mdi-delete</v-icon> Удалить
    </v-btn>
  </FormWrapper>
</template>

<script setup>
import AddressSuggestion from '@/entities/address/addressSuggestion.vue'
import { ButtonsPanel, FormWrapper } from '@/shared/ui'
import { useForm } from './useAddressForm.js'

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

const { v$, nameErrors, geoErrors, submit, cancel, getParsedAddress, zoneItems } = useForm(
  props,
  emit
)
</script>
