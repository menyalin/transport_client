<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('tariff:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <v-text-field
            v-model="settings.date"
            outlined
            dense
            clearable
            hide-details
            label="Тарифы на дату"
            type="date"
            :style="{ 'max-width': '220px' }"
          />

          <v-autocomplete
            v-model="settings.agreement"
            label="Соглашение"
            outlined
            clearable
            dense
            :disabled="!!settings.document"
            :items="agreementItems"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '300px' }"
          />
          <v-autocomplete
            v-model="settings.document"
            label="Документ"
            outlined
            clearable
            dense
            :items="documentItems"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '300px' }"
          />
          <v-select
            v-model="settings.type"
            :items="$store.getters.tariffTypes"
            outlined
            clearable
            dense
            hide-details
            label="Тип тарифа"
            :style="{ 'max-width': '180px' }"
          />
          <v-autocomplete
            v-model="settings.client"
            label="Заказчик"
            outlined
            clearable
            dense
            :items="clientItems"
            item-value="_id"
            item-text="name"
            hide-details
            :style="{ 'max-width': '250px' }"
          />
        </div>

        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          height="73vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item._result`]="{ item }">
            <tariff-description-cell :item="item" />
          </template>
          <template #[`item._withVat`]="{ item }">
            <v-icon v-if="item._withVat" color="primary">mdi-plus</v-icon>
            <v-icon v-else color="primary">mdi-minus</v-icon>
          </template>
        </v-data-table>
        <tariff-form
          v-model="editableItem"
          :dialog="showDialog"
          @cancel="cancelDialog"
          @update="updateItem"
          @deletedItem="deletedItemHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel } from '@/shared/ui'
import { TariffForm, TariffDescriptionCell } from '@/entities/tariff'

import { useListData } from './model/useListData'

export default {
  name: 'TariffList',
  components: {
    ButtonsPanel,
    TariffForm,
    TariffDescriptionCell,
  },
  setup() {
    const {
      headers,
      items,
      count,
      loading,
      settings,
      refresh,
      agreementItems,
      clientItems,
      documentItems,
      deletedItemHandler,
      showDialog,
      cancelDialog,
      dblClickRow,
      updateItem,
      editableItem,
      listOptions,
    } = useListData()
    return {
      headers,
      items,
      count,
      loading,
      settings,
      refresh,
      agreementItems,
      clientItems,
      documentItems,
      deletedItemHandler,
      showDialog,
      cancelDialog,
      dblClickRow,
      updateItem,
      editableItem,
      listOptions,
    }
  },

  methods: {
    create() {
      this.$router.push({ name: 'TariffCreate' })
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
