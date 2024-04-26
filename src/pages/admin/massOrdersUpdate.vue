<template>
  <div class="page-wrapper">
    <h4>Групповое обновление рейсов</h4>

    <div class="settings-wrapper">
      <DateRangeInput v-model="period" />
      <v-select
        v-model="company"
        label="Компания"
        :items="allCompanyItems"
        :loading="companyListLoading"
        :disabled="companyListLoading"
        item-value="_id"
        item-text="name"
        :style="{ maxWidth: '250px' }"
      />
    </div>
    <v-btn :disabled="!isFilledParams" @click="getOrdersCountBtnHandler">
      Кол-во рейсов
    </v-btn>
    <p>Рейсов: {{ ordersCount }}</p>
    <div v-if="processingState.isOrdersProcessing" class="loader-row">
      <v-progress-linear
        v-model="processingState.percent"
        color="green"
        height="35"
        class="my-6"
      >
        <template v-slot:default="{ value }">
          <strong>{{ value }}%</strong>
        </template>
      </v-progress-linear>
      <v-btn color="error" @click="cancelProcessing">Отменить обработку</v-btn>
    </div>

    <v-btn
      v-else
      @click="runOrderProcessing"
      color="error"
      :loading="processingState.isOrdersProcessing"
      :disabled="processingState.isOrdersProcessing"
    >
      Обновить
    </v-btn>
  </div>
</template>
<script>
import { DateRangeInput } from '@/shared/ui'
import { useCompany } from '@/entities/company'
import { useMassOrderUpdate } from './model/useMassOrderUpdate'

export default {
  name: 'MassOrderUpdatePage',
  components: {
    DateRangeInput,
  },
  setup(_props, _ctx) {
    const { allCompanyItems, loading: companyListLoading } = useCompany()
    const {
      company,
      period,
      getOrdersCountBtnHandler,
      isFilledParams,
      ordersCount,
      runOrderProcessing,
      processingState,
      cancelProcessing,
    } = useMassOrderUpdate()

    return {
      getOrdersCountBtnHandler,
      runOrderProcessing,
      company,
      period,
      allCompanyItems,
      companyListLoading,
      isFilledParams,
      ordersCount,
      processingState,
      cancelProcessing,
    }
  },
}
</script>
<style scoped>
.page-wrapper {
  padding: 15px;
  display: flex;
  flex-direction: column;
}
.settings-wrapper {
  padding: 20px 10px;
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>
