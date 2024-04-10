<template>
  <EntityListWrapper>
    <ButtonsPanel panelType="list" @submit="create" @refresh="refresh" />
    <TariffContractListSettings :settings="settings" />
    <TariffContractListDataTable
      :items="items"
      :loading="loading"
      :listOptions.sync="listOptions"
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
export default {
  name: 'TariffContractList',
  components: {
    EntityListWrapper,
    ButtonsPanel,
    TariffContractListSettings,
    TariffContractListDataTable,
  },
  setup() {
    const { items, refresh, loading, listOptions, settings } = useListData()
    return {
      items,
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
