<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledSubmit="!$store.getters.hasPermission('carrier:write')"
          @submit="create"
          @refresh="refreshHandler"
        />
        <CarrierListSettings v-model="settings" />
        <v-data-table
          v-model:options="listOptions"
          :headers="headers"
          :items="items"
          :loading="loading"
          :itemsLength="count"
          fixedHeader
          height="72vh"
         
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.outsource`]="{ item }">
            <v-icon>{{ item.outsource ? 'mdi-check' : 'mdi-minus' }}</v-icon>
          </template>
          <template #[`item.agreements`]="{ item }">
            <CarrierListAgreementsCell :items="item.agreements" :agreementsData="item.agreementsData" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { useListData } from './useListData'
import { CarrierListSettings, CarrierListAgreementsCell } from '@/entities/carrier'

export default {
  name: 'CarrierList',
  components: {
    ButtonsPanel,
    CarrierListSettings,
    CarrierListAgreementsCell,
  },
  setup() {
    const { items, loading, refreshHandler, count, settings, listOptions, headers } = useListData()
    return {
      items,
      loading,
      refreshHandler,
      count,
      settings,
      listOptions,
      headers,
    }
  },

  methods: {
    create() {
      this.$router.push({ name: 'CarrierCreate' })
    },
    refresh() {
      this.$store.dispatch('getTkNames', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`carriers/${item._id}`)
    },
  },
}
</script>
<style></style>
