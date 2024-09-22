<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabledSubmit="!$store.getters.hasPermission('driver:write')"
      @submit="createDriver"
      @refresh="refresh"
    />
    <v-data-table
      :headers="headers"
      :items="filteredDrivers"
      :search="listSettings.search"
      :loading="loading"
      fixed-header
      height="71vh"
      dense
      :footer-props="{
        'items-per-page-options': [50, 100, 200],
      }"
      :options.sync="listSettings.listOptions"
      @dblclick:row="dblClickRow"
    >
      <template #top>
        <div class="filter-wrapper">
          <AppTableColumnSetting
            :allHeaders="allHeaders"
            listSettingsName="driversTableColumns"
            @change="updateHeadersHandler"
          />
          <v-select
            v-model="listSettings.tkNameFilter"
            dense
            outlined
            hide-details
            label="ТК"
            clearable
            :items="tkNameItems"
            item-value="_id"
            item-text="name"
          />
          <v-select
            v-model="listSettings.workState"
            label="Статус"
            :items="workStateItems"
            outlined
            dense
          />
          <v-select
            v-model="listSettings.stuffStatus"
            label="Сотрудники"
            :items="stuffStatusItems"
            outlined
            dense
          />
          <v-text-field
            v-model="listSettings.search"
            outlined
            hide-details
            dense
            label="Быстрый поиск"
          />
        </div>
      </template>
      <template #[`item.hasScans`]="{ item }">
        <v-icon v-if="item.hasScans" small color="green"> mdi-check </v-icon>
        <v-icon v-else small color="red"> mdi-minus </v-icon>
      </template>
      <template #[`item.isCalcSalary`]="{ item }">
        <v-icon v-if="item.isCalcSalary" small color="green">
          mdi-check
        </v-icon>
        <v-icon v-else small color="red"> mdi-minus </v-icon>
      </template>
    </v-data-table>
  </EntityListWrapper>
</template>
<script>
import { ref } from 'vue'
import { useDriverList } from './useDriverList'
import {
  ButtonsPanel,
  EntityListWrapper,
  AppTableColumnSetting,
} from '@/shared/ui'

export default {
  name: 'DriverList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
    AppTableColumnSetting,
  },

  setup() {
    const headers = ref([])

    function updateHeadersHandler(val) {
      headers.value = val
    }

    const {
      allHeaders,
      stuffStatusItems,
      workStateItems,
      listSettings,
      loading,
      tkNameItems,
      refresh,
      filteredDrivers,
    } = useDriverList()

    return {
      headers,
      allHeaders,
      stuffStatusItems,
      workStateItems,
      listSettings,
      loading,
      tkNameItems,
      filteredDrivers,
      refresh,
      updateHeadersHandler,
    }
  },

  methods: {
    createDriver() {
      this.$router.push({ name: 'DriverCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`drivers/${item._id}`)
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
</style>
