<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('carrier:write')"
          @submit="create"
          @refresh="refreshHandler"
        />
        <CarrierListSettings v-model="settings" />
        <v-data-table
          :headers="headers"
          :items="carriers"
          :loading="loading"
          :search="settings.search"
          fixed-header
          height="72vh"
          dense
          :itemsPerPage="100"
          :footerProps="{
            'items-per-page-options': [100, 200, -1],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.outsource`]="{ item }">
            <v-icon>{{ item.outsource ? 'mdi-check' : 'mdi-minus' }}</v-icon>
          </template>
          <template #[`item.agreements`]="{ item }">
            <CarrierListAgreementsCell
              :items="item.agreements"
              :agreementsData="item.agreementsData"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { useListData } from './useListData'
import {
  CarrierListSettings,
  CarrierListAgreementsCell,
} from '@/entities/carrier'
import { onMounted } from 'vue'

export default {
  name: 'CarrierList',
  components: {
    ButtonsPanel,
    CarrierListSettings,
    CarrierListAgreementsCell,
  },
  setup() {
    const { carriers, loading, refreshHandler, headers, settings } =
      useListData()
    onMounted(() => {
      refreshHandler()
    })
    return {
      carriers,
      loading,
      refreshHandler,
      headers,
      settings,
    }
  },

  methods: {
    create() {
      this.$router.push({ name: 'CarrierCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`carriers/${item._id}`)
    },
  },
}
</script>
<style></style>
