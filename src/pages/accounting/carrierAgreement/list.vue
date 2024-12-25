<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabledSubmit="!$store.getters.hasPermission('carrierAgreement:write')"
      @submit="createHandler"
      @refresh="refreshHandler"
    />
    <CarrierAgreementListSettings
      v-model="settings"
      @updateHeaders="changeHeaders"
    />

    <CarrierAgreementListDataTable
      :items="items"
      :loading="loading"
      :headers="headers"
      :totalCount="totalCount"
      :options.sync="listOptions"
      :settings="settings"
      @dblClickRow="dblClickRow"
    />
  </EntityListWrapper>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { useListData } from './useList'
import { EntityListWrapper } from '@/shared/ui/index'
import {
  CarrierAgreementListSettings,
  CarrierAgreementListDataTable,
} from '@/entities/carrierAgreement'

export default {
  name: 'CarrierAgreementList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
    CarrierAgreementListSettings,
    CarrierAgreementListDataTable,
  },
  setup() {
    const {
      refreshHandler,
      createHandler,
      settings,
      listOptions,
      items,
      loading,
      onDeleteHandler,
      totalCount,
      changeHeaders,
      headers,
    } = useListData()

    return {
      refreshHandler,
      createHandler,
      settings,
      listOptions,
      items,
      loading,
      onDeleteHandler,
      totalCount,
      changeHeaders,
      headers,
    }
  },

  methods: {
    dblClickRow(_, { item }) {
      this.$router.push(`carrierAgreements/${item._id}`)
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 300px 280px;
  align-items: center;
}
</style>
