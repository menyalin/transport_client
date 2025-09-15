<template>
  <EntityListWrapper>
    <ButtonsPanel panelType="list" @submit="create" @refresh="refresh" />
    <TariffContractListSettings
      v-model="settings"
      :agreementItems="allClientAgreements"
    />
    <TariffContractListDataTable
      v-model:listOptions="listOptions"
      :items="items"
      :loading="loading"
    />
  </EntityListWrapper>
</template>
<script>
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { useListData } from './model/useListData'
import {
  TariffContractListSettings,
  TariffContractListDataTable,
} from '@/entities/tariff_contract'
import { useAgreements } from '@/entities/agreement/useAgreements'
export default {
  name: 'TariffContractList',
  components: {
    EntityListWrapper,
    ButtonsPanel,
    TariffContractListSettings,
    TariffContractListDataTable,
  },
  setup() {
    const { allClientAgreements } = useAgreements()
    const { items, refresh, loading, listOptions, settings } = useListData()
    return {
      items,
      allClientAgreements,
      refresh,
      loading,
      listOptions,
      settings,
    }
  },
  methods: {
    create() {
      this.$router.push({ name: 'TariffContractCreate' })
    },
  },
}
</script>
