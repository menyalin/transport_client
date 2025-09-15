<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="disableSubmitBtn"
      @submit="submitHandler"
      @cancel="cancelHandler"
    />
    <v-text-field v-model="state.name" label="Название" />
    <div class="main-block">
      <v-autocomplete
        v-model="state.agreement"
        :items="agreements"
        item-title="name"
        item-value="_id"
        label="Соглашение"
        :readonly="agreementReadonly"
        :style="{ maxWidth: '300px' }"
      />
      <v-text-field
        v-model="state.startDate"
        label="Дата начала"
        type="date"
        :style="{ maxWidth: '150px' }"
      />
      <v-text-field
        v-model="state.endDate"
        label="Дата окончания"
        type="date"
        :style="{ maxWidth: '150px' }"
      />

      <v-checkbox
        v-model="state.withVat"
        color="primary"
        label="Тарифы указаны с НДС"
      />
    </div>
    <v-divider />
    <TariffListWrapper
      v-model="state.zonesTariffs"
      title="Базовые тарифы по зонам"
      formTitle="Базовый тариф по зонам"
      :tariffListComponent="zoneBaseTariffList"
      :tariffFormComponent="zoneBaseTariffForm"
      class="mb-6"
    />
    <v-divider />
    <TariffListWrapper
      v-model="state.directDistanceZonesTariffs"
      title="Базовые тарифы по линейке от зоны погрузки"
      formTitle="Базовый тариф по линейке"
      :tariffListComponent="directDistanceZonesTariffList"
      :tariffFormComponent="directDistanceZonesTariffForm"
    />
    <v-divider />

    <TariffListWrapper
      v-model="state.idleTimeTariffs"
      title="Простой по типу рейса"
      formTitle="Тариф для расчета простоя ТС"
      :tariffListComponent="idleTimeTariffList"
      :tariffFormComponent="idleTimeTariffForm"
    />
    <v-divider />
    <TariffListWrapper
      v-model="state.returnPercentTariffs"
      title="Возврат: % от базового тарифа"
      formTitle="Тариф на возврат"
      :tariffListComponent="returnPercentTariffList"
      :tariffFormComponent="returnPercentTariffForm"
    />
    <v-divider />
    <v-text-field v-model="state.note" label="Примечание" />
    <EntityFiles
      v-if="item && item._id"
      :itemId="item._id"
      docType="tariffContract"
    />
  </div>
</template>
<script>
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

export default {
  name: 'TariffContractForm',
  components: {
    ButtonsPanel,
    TariffListWrapper,
    EntityFiles,
  },
  props: {
    agreements: Array,
    item: Object,
  },
  data() {
    return {
      zoneBaseTariffList: ZoneBaseTariffList,
      zoneBaseTariffForm: ZoneBaseTariffForm,
      directDistanceZonesTariffList: DirectDistanceZonesTariffList,
      directDistanceZonesTariffForm: DirectDistanceZonesTariffForm,
      idleTimeTariffForm: IdleTimeTariffForm,
      idleTimeTariffList: IdleTimeTariffList,
      returnPercentTariffForm: ReturnPercentTariffForm,
      returnPercentTariffList: ReturnPercentTariffList,
    }
  },
  setup(props, ctx) {
    const {
      state,
      orderTypeItems,
      disableSubmitBtn,
      submitHandler,
      cancelHandler,
      mainFormV$,
      agreementReadonly,
    } = useTariffContractForm(props, ctx)

    return {
      state,
      mainFormV$,
      disableSubmitBtn,
      orderTypeItems,
      submitHandler,
      cancelHandler,
      agreementReadonly,
    }
  },
}
</script>
<style scoped>
.main-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
}
</style>
