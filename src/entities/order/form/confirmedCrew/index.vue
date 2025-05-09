<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="confirmed-crew-block">
      <v-autocomplete
        :value="state.truck"
        label="Грузовик"
        :loading="loading"
        dense
        :clearable="!confirmed"
        :readonly="truckReadOnly"
        :items="trucks"
        outlined
        hide-details
        @change="changeTruckHandler"
      />
      <v-autocomplete
        label="Водитель"
        :value="state.driver"
        :items="drivers"
        readonly
        hide-details
        dense
        outlined
      />
      <v-autocomplete
        label="Прицеп"
        :value="state.trailer"
        :items="trailers"
        readonly
        dense
        hide-details
        outlined
      />
      <v-btn text small color="primary" @click="copyHandler">
        Скопировать данные
      </v-btn>
    </div>
    <v-alert
      v-if="crewEmptyError"
      type="error"
      dense
      outlined
      :style="{ maxWidth: '400px' }"
    >
      Экипаж не задан
    </v-alert>
    <div v-if="showOutsourceAgreementRow" class="outsource-agreement-row ml-4">
      <small>Перевозчик: {{ tkName ? tkName : 'Не указан' }}</small>
      <small
        :class="{
          'deep-orange--text text--darken-4 font-weight-bold ':
            executorAndCustomerMissmatch,
        }"
      >
        Соглашение: {{ outsourceAgreementName }}
        {{ state.directiveAgreement ? '(Установлено вручную)' : '' }}
      </small>
      <v-btn
        v-if="allowChangeOutsourceAgreement"
        small
        color="primary"
        @click="changeOutsourceAgreementHandler"
        text
      >
        Изменить соглашение
      </v-btn>
    </div>
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'
import { useConfirmedCrew } from './useConfirmedCrew'

export default {
  name: 'ConfirmedCrew',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'crew',
    event: 'change',
  },
  props: {
    confirmed: Boolean,
    crew: Object,
    hasIncomingInvoice: Boolean,
    title: String,
    date: String,
    executorIdInClientAgreement: String,
  },
  setup(props, ctx) {
    const {
      state,
      loading,
      outsourceAgreement,
      showOutsourceAgreementRow,
      tkName,
      outsourceAgreementName,
      trucks,
      drivers,
      trailers,
      hasTruck,
      allowChangeOutsourceAgreement,
      changeOutsourceAgreementHandler,
      changeTruckHandler,
      copyHandler,
      truckReadOnly,
      crewEmptyError,
      executorAndCustomerMissmatch,
    } = useConfirmedCrew(props, ctx)
    return {
      state,
      loading,
      outsourceAgreement,
      showOutsourceAgreementRow,
      tkName,
      outsourceAgreementName,
      trucks,
      drivers,
      trailers,
      hasTruck,
      allowChangeOutsourceAgreement,
      changeOutsourceAgreementHandler,
      changeTruckHandler,
      copyHandler,
      truckReadOnly,
      crewEmptyError,
      executorAndCustomerMissmatch,
    }
  },
}
</script>
<style scoped>
.confirmed-crew-block {
  display: grid;
  grid-template-columns: 300px 300px 300px 250px;
  margin: 10px;
  gap: 15px;
  align-items: center;
}
.outsource-agreement-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
</style>
