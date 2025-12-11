<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="disableSubmitBtn"
      @submit="submitHandler"
      @cancel="cancelHandler"
    />
    <v-text-field label="Название" v-model="state.name" />
    <div class="main-block">
      <v-autocomplete
        :items="agreements"
        item-text="name"
        item-value="_id"
        label="Соглашения"
        :readonly="agreementReadonly"
        v-model="state.agreements"
        :style="{ maxWidth: '300px' }"
        multiple
        chips
        small-chips
        deletable-chips
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

      <v-checkbox
        color="primary"
        v-model="state.withVat"
        label="Тарифы указаны с НДС"
      />
    </div>
    <v-divider />
    <TariffListWrapper
      title="Базовые тарифы по зонам"
      formTitle="Базовый тариф по зонам"
      v-model="state.zonesTariffs"
      :tariffListComponent="zoneBaseTariffList"
      :tariffFormComponent="zoneBaseTariffForm"
      class="mb-6"
    />
    <v-divider />
    <TariffListWrapper
      title="Базовые тарифы по линейке от зоны погрузки"
      formTitle="Базовый тариф по линейке"
      v-model="state.directDistanceZonesTariffs"
      :tariffListComponent="directDistanceZonesTariffList"
      :tariffFormComponent="directDistanceZonesTariffForm"
    />
    <v-divider />

    <TariffListWrapper
      title="Простой по типу рейса"
      formTitle="Тариф для расчета простоя ТС"
      v-model="state.idleTimeTariffs"
      :tariffListComponent="idleTimeTariffList"
      :tariffFormComponent="idleTimeTariffForm"
    />
    <v-divider />
    <TariffListWrapper
      title="Возврат: % от базового тарифа"
      formTitle="Тариф на возврат"
      v-model="state.returnPercentTariffs"
      :tariffListComponent="returnPercentTariffList"
      :tariffFormComponent="returnPercentTariffForm"
    />
    <v-divider />
    <v-text-field label="Примечание" v-model="state.note" />
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
