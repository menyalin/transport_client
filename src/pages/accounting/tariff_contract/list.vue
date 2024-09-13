<template>
  <EntityListWrapper>
    <ButtonsPanel panelType="list" @submit="create" @refresh="refresh" />
    <TariffContractListSettings :settings="settings" />
    <TariffContractListDataTable
      v-model:listOptions="listOptions"
      :items="items"
      :loading="loading"
    />
  </EntityListWrapper>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import {
  TariffContractListSettings,
  TariffContractListDataTable,
} from '@/entities/tariff_contract'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

import { useListData } from './model/useListData'
export default defineComponent({
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
})
</script>
