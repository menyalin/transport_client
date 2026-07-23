<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-submit="!store.getters.hasPermission('carrierAgreement:write')"
      @submit="createHandler"
      @refresh="refreshHandler"
    />
    <CarrierAgreementListSettings v-model:settings="settings" @updateHeaders="changeHeaders" />

    <CarrierAgreementListDataTable
      :items="items"
      :loading="loading"
      :headers="headers"
      :totalCount="totalCount"
      v-model:options="listOptions"
      @dblClickRow="dblClickRow"
    />
  </EntityListWrapper>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel } from '@/shared/ui'
import { useListData } from './useList'
import { EntityListWrapper } from '@/shared/ui/index'
import {
  CarrierAgreementListSettings,
  CarrierAgreementListDataTable,
} from '@/entities/carrierAgreement'

defineOptions({ name: 'CarrierAgreementList' })

const store = useStore()
const router = useRouter()

const {
  refreshHandler,
  createHandler,
  settings,
  listOptions,
  items,
  loading,
  totalCount,
  changeHeaders,
  headers,
} = useListData()

function dblClickRow(item) {
  router.push(`carrierAgreements/${item._id}`)
}
</script>

<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 300px 280px;
  align-items: center;
}
</style>
