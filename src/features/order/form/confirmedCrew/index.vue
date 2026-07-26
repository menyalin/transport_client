<template>
  <div>
    <BlockTitle class="mt-2">{{ title }}</BlockTitle>
    <div class="confirmed-crew-block">
      <v-autocomplete
        :model-value="model.truck"
        label="Грузовик"
        :loading="loading"
        :clearable="!confirmed"
        :readonly="truckReadOnly"
        :items="trucks"
        hide-details
        @update:model-value="changeTruckHandler"
        :style="{ minWidth: '200px' }"
      />
      <v-autocomplete
        label="Водитель"
        :model-value="model.driver"
        :items="drivers"
        readonly
        hide-details
        :style="{ minWidth: '300px' }"
      />
      <v-autocomplete
        label="Прицеп"
        :model-value="model.trailer"
        :items="trailers"
        readonly
        hide-details
        :style="{ minWidth: '200px' }"
      />
      <v-btn variant="text" size="small" @click="copyHandler"> Скопировать данные </v-btn>
    </div>
    <v-alert v-if="crewEmptyError" type="error" :style="{ maxWidth: '400px' }">
      Экипаж не задан
    </v-alert>
    <div v-if="showOutsourceAgreementRow" class="outsource-agreement-row ml-4">
      <small>Перевозчик: {{ carrierName }}</small>
      <small
        :class="{
          'deep-orange--text text--darken-4 font-weight-bold ': executorAndCustomerMissmatch,
        }"
      >
        Соглашение: {{ outsourceAgreementName }}
        {{ model.directiveAgreement ? '(Установлено вручную)' : '' }}
      </small>
      <v-btn
        v-if="allowChangeOutsourceAgreement"
        size="small"
        variant="text"
        @click="changeOutsourceAgreementHandler"
      >
        Изменить соглашение
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { BlockTitle } from '@/shared/ui'
import { useConfirmedCrew } from './useConfirmedCrew'

defineOptions({ name: 'ConfirmedCrew' })
const model = defineModel({ type: Object })

const props = defineProps({
  confirmed: Boolean,
  hasIncomingInvoice: Boolean,
  title: String,
  date: String,
  executorIdInClientAgreement: String,
  carriersMap: {
    type: Map,
    required: true,
  },
})
const emits = defineEmits(['update:model-value'])

const {
  loading,
  showOutsourceAgreementRow,
  outsourceAgreementName,
  trucks,
  drivers,
  trailers,
  allowChangeOutsourceAgreement,
  changeOutsourceAgreementHandler,
  changeTruckHandler,
  copyHandler,
  truckReadOnly,
  crewEmptyError,
  executorAndCustomerMissmatch,
} = useConfirmedCrew(model, props, emits)

const carrierName = computed(() => props.carriersMap.get(model.value.tkName)?.name || ' - ')
</script>
<style scoped>
.confirmed-crew-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
}
.confirmed-crew-block > * {
  flex: none;
}
.outsource-agreement-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
</style>
