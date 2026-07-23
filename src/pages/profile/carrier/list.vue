<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-submit="!store.getters.hasPermission('carrier:write')"
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
      :items-per-page="100"
      :items-per-page-options="[100, 200, -1]"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.outsource`]="{ item }">
        <v-icon>{{ item.outsource ? 'mdi-check' : 'mdi-minus' }}</v-icon>
      </template>
      <template #[`item.agreements`]="{ item }">
        <CarrierListAgreementsCell :items="item.agreements" :agreementsData="item.agreementsData" />
      </template>
    </v-data-table>
  </EntityListWrapper>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper } from '@/shared/ui'
import { useListData } from './useListData'
import { CarrierListSettings, CarrierListAgreementsCell } from '@/entities/carrier'

defineOptions({ name: 'CarrierList' })

const router = useRouter()
const store = useStore()

const { carriers, loading, refreshHandler, headers, settings } = useListData()

onMounted(() => {
  refreshHandler()
})

function create() {
  router.push({ name: 'CarrierCreate' })
}

function dblClickRow(_, { item }) {
  router.push(`carriers/${item._id}`)
}
</script>
<style></style>
