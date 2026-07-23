<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabled-submit="disableSubmitBtn"
      @submit="submitHandler"
      @cancel="cancelHandler"
    />
    <v-text-field label="Название" v-model="state.name" />
    <div class="main-block">
      <v-autocomplete
        :items="agreements"
        item-title="name"
        item-value="_id"
        label="Соглашения"
        :readonly="agreementReadonly"
        v-model="state.agreements"
        multiple
        chips
        closable-chips
        auto-select-first
      />
      <v-text-field
        label="Дата начала"
        type="date"
        v-model="state.startDate"
        :style="{ maxWidth: '150px' }"
      />
      <v-text-field
        label="Дата окончания"
        type="date"
        v-model="state.endDate"
        :style="{ maxWidth: '150px' }"
      />

      <v-checkbox color="primary" v-model="state.withVat" label="Тарифы указаны с НДС" />
    </div>
    <v-divider />
    <TariffListWrapper
      title="Базовые тарифы по зонам"
      formTitle="Базовый тариф по зонам"
      v-model="state.zonesTariffs"
      :tariffListComponent="ZoneBaseTariffList"
      :tariffFormComponent="ZoneBaseTariffForm"
      class="mb-6"
    />
    <v-divider />
    <TariffListWrapper
      title="Базовые тарифы по линейке от зоны погрузки"
      formTitle="Базовый тариф по линейке"
      v-model="state.directDistanceZonesTariffs"
      :tariffListComponent="DirectDistanceZonesTariffList"
      :tariffFormComponent="DirectDistanceZonesTariffForm"
    />
    <v-divider />

    <TariffListWrapper
      title="Простой по типу рейса"
      formTitle="Тариф для расчета простоя ТС"
      v-model="state.idleTimeTariffs"
      :tariffListComponent="IdleTimeTariffList"
      :tariffFormComponent="IdleTimeTariffForm"
    />
    <v-divider />
    <TariffListWrapper
      title="Возврат: % от базового тарифа"
      formTitle="Тариф на возврат"
      v-model="state.returnPercentTariffs"
      :tariffListComponent="ReturnPercentTariffList"
      :tariffFormComponent="ReturnPercentTariffForm"
    />
    <v-divider />
    <v-text-field label="Примечание" v-model="state.note" />
    <EntityFiles v-if="item && item._id" :item-id="item._id" docType="tariffContract" />
  </div>
</template>

<script setup>
import { ButtonsPanel, EntityFiles } from '@/shared/ui'
import { useTariffContractForm } from './useTariffContractForm'
import TariffListWrapper from './tariffListWrapper'
import ZoneBaseTariffList from './zonesBaseTariffList.vue'
import ZoneBaseTariffForm from './zonesBaseTariffForm.vue'
import DirectDistanceZonesTariffList from './directDistanceZonesTariffList.vue'
import DirectDistanceZonesTariffForm from './directDistanceZonesTariffForm.vue'
import IdleTimeTariffForm from './idleTimeTariffForm.vue'
import IdleTimeTariffList from './idleTimeTariffList.vue'
import ReturnPercentTariffForm from './returnPercentTariffForm.vue'
import ReturnPercentTariffList from './returnPercentTariffList.vue'

defineOptions({ name: 'TariffContractForm' })

const props = defineProps({
  agreements: Array,
  item: Object,
})

const emit = defineEmits(['submit', 'cancel'])

const { state, disableSubmitBtn, submitHandler, cancelHandler, agreementReadonly } =
  useTariffContractForm(props, { emit })
</script>

<style scoped>
.main-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  flex-basis: auto;
}
</style>
