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
        label="Соглашение"
        :readonly="agreementReadonly"
        v-model="state.agreement"
        :style="{ maxWidth: '300px' }"
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
      <v-select
        label="Тип рейса"
        v-model="state.orderType"
        :items="orderTypeItems"
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
      @change="tmpHandler"
    />
    <v-divider />
    <TariffListWrapper
      title="Базовые тарифы по линейке от зоны погрузки"
      formTitle="Базовый тариф по линейке"
      v-model="state.directDistanceZonesTariffs"
      :tariffListComponent="directDistanceZonesTariffList"
      :tariffFormComponent="directDistanceZonesTariffForm"
      @change="tmpHandler"
    />
    <v-divider />
    <v-text-field label="Примечание" v-model="state.note" />
  </div>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { useTariffContractForm } from './useTariffContractForm'
import TariffListWrapper from './tariffListWrapper'
import ZoneBaseTariffList from './zonesBaseTariffList.vue'
import ZoneBaseTariffForm from './zonesBaseTariffForm.vue'
import DirectDistanceZonesTariffList from './directDistanceZonesTariffList.vue'
import DirectDistanceZonesTariffForm from './directDistanceZonesTariffForm.vue'

export default {
  name: 'TariffContractForm',
  components: {
    ButtonsPanel,
    TariffListWrapper,
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
    function tmpHandler(val) {
      console.log(val)
    }

    return {
      state,
      mainFormV$,
      disableSubmitBtn,
      orderTypeItems,
      submitHandler,
      cancelHandler,
      agreementReadonly,
      tmpHandler,
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
