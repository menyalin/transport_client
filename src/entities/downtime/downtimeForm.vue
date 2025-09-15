<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('downtime:write') || isInvalidForm
      "
      @cancel="cancel"
      @submit="submit"
    />

    <v-autocomplete
      v-model="state.truck"
      label="Грузовик"
      :items="truckItems"
      auto-select-first
      variant="outlined"
      density="compact"
    />
    <v-select
      v-model="state.type"
      label="Тип простоя"
      :items="downtimeTypes"
      variant="outlined"
      density="compact"
    />
    <v-text-field
      v-model.trim="state.title"
      variant="outlined"
      label="Заголовок"
      density="compact"
    />

    <AutoCompleteWithActions
      v-if="state.type === 'repair'"
      v-model="state.partner"
      :items="serviceItems"
      label="Партнер"
      :hint="partnerContactsHint"
      :persistentHint="!!partnerContactsHint"
      variant="outlined"
      @create="createPartnerHandler"
      @edit="updatePartnerHandler"
    />

    <AutoCompleteWithActions
      v-if="state.type === 'repair'"
      v-model="state.address"
      :items="serviceAdressItems"
      label="Адрес сервиса"
      variant="outlined"
      @create="createAddressHandler"
      @edit="updateAddressHandler"
    />

    <div class="row-input my-4">
      <DateTimeInput
        v-model="state.startPositionDate"
        label="Дата начала"
        type="datetime-local"
        variant="outlined"
        density="compact"
        :style="{ 'max-width': '200px' }"
      />
      <DateTimeInput
        v-model="state.endPositionDate"
        label="Дата завешения"
        type="datetime-local"
        :minDate="state.startPositionDate"
        variant="outlined"
        density="compact"
        :style="{ 'max-width': '200px' }"
      />
    </div>
    <v-text-field
      v-model="state.note"
      label="Примечание"
      variant="outlined"
      hide-details
      density="compact"
    />
    <v-checkbox
      v-model="state.inOrderTime"
      label="Разрешить пересечение с рейсом"
    />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import {
  ButtonsPanel,
  DateTimeInput,
  AutoCompleteWithActions,
} from '@/shared/ui'

import { useForm } from './useForm'

export default {
  name: 'DowntimeForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AutoCompleteWithActions,
  },
  props: {
    downtime: { type: Object },
    displayDeleteBtn: { type: Boolean, default: false },
    addressActions: {
      type: Object,
      required: true,
    },
    partnerActions: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const {
      state,
      isInvalidForm,
      resetForm,
      submit,
      cancel,
      truckItems,
      serviceAdressItems,
      serviceItems,
      downtimeTypes,
      createAddressHandler,
      updateAddressHandler,
      createPartnerHandler,
      updatePartnerHandler,
      partnerContactsHint,
    } = useForm(props, ctx)
    return {
      state,
      isInvalidForm,
      resetForm,
      submit,
      cancel,
      truckItems,
      serviceAdressItems,
      serviceItems,
      downtimeTypes,
      createAddressHandler,
      updateAddressHandler,
      createPartnerHandler,
      updatePartnerHandler,
      partnerContactsHint,
    }
  },
}
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: flex-start;
}
</style>
