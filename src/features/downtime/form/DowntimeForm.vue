<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabled-submit="!canWrite"
      @cancel="cancel"
      @submit="submit"
    />

    <v-autocomplete
      v-model="state.truck"
      label="Грузовик"
      :items="truckItems"
      item-value="_id"
      item-title="regNum"
    />
    <v-select v-model="state.type" label="Тип простоя" :items="downtimeTypes" itemTitle="text" />
    <v-text-field v-model.trim="state.title" label="Заголовок" />

    <AppAutocomplete
      v-if="state.type === 'repair'"
      v-model="state.partner"
      :items="serviceItems"
      label="Партнер"
      show-action
      :hint="partnerContactsHint"
      :persistentHint="!!partnerContactsHint"
      @create="$emit('need-create-partner')"
      @edit="$emit('need-edit-partner', $event)"
      class="mb-4"
    />

    <v-autocomplete
      v-if="state.type === 'repair'"
      :items="serviceAdressItems"
      v-model="state.address"
      label="Адрес сервиса"
    />

    <div class="row-input my-4">
      <DateTimeInput v-model="state.startPositionDate" label="Дата начала" type="datetime-local" />
      <DateTimeInput
        v-model="state.endPositionDate"
        label="Дата завешения"
        type="datetime-local"
        :minDate="state.startPositionDate"
      />
    </div>
    <v-text-field v-model="state.note" label="Примечание" hide-details />
    <v-checkbox v-model="state.inOrderTime" label="Разрешить пересечение с рейсом" />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ButtonsPanel, DateTimeInput } from '@/shared/ui'
import { useForm } from './useDowntimeForm'
import type { DowntimeFormState } from './useDowntimeForm'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

const vuexStore = useStore()
defineOptions({ name: 'DowntimeForm' })

interface Props {
  downtime?: DowntimeFormState | null
  displayDeleteBtn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  downtime: null,
  displayDeleteBtn: false,
})

const emit = defineEmits<{
  submit: [value: Record<string, unknown>]
  cancel: []
  delete: []
  'need-create-partner': []
  'need-edit-partner': [partnerId: string]
}>()
const canWrite = computed(() => {
  return vuexStore.getters.hasPermission('downtime:write') && !isInvalidForm.value
})
const {
  state,
  isInvalidForm,
  cancel,
  truckItems,
  serviceAdressItems,
  serviceItems,
  downtimeTypes,
  partnerContactsHint,
  submit,
} = useForm(props, emit)
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: flex-start;
}
</style>
