<template>
  <EntityListWrapper>
    <ButtonsPanel panel-type="list" @submit="create" @refresh="refresh" />
    <TariffContractListSettings v-model="settings" :agreementItems="allClientAgreements" />
    <TariffContractListDataTable
      :items="items"
      :count="count"
      :loading="loading"
      v-model:options="listOptions"
    />
  </EntityListWrapper>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { useListData } from './model/useListData'
import { TariffContractListSettings, TariffContractListDataTable } from '@/entities/tariff_contract'
import { useAgreements } from '@/entities/agreement'

defineOptions({ name: 'TariffContractList' })

const router = useRouter()
const { allClientAgreements } = useAgreements()
const { items, count, refresh, loading, listOptions, settings } = useListData()

function create() {
  router.push({ name: 'TariffContractCreate' })
}
</script>
