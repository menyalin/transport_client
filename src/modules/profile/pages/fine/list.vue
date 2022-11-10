<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <app-date-range v-model="settings.period" />
          <v-select
            v-model="settings.status"
            :items="fineStatuses"
            dense
            hide-details
            outlined
            label="Статус"
            :style="{ maxWidth: '200px' }"
          />
          <v-autocomplete
            v-model="settings.truck"
            label="Грузовик / Прицеп"
            :items="trucks"
            clearable
            auto-select-first
            outlined
            hide-details
            dense
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            v-model="settings.driver"
            label="Водитель"
            :items="drivers"
            auto-select-first
            clearable
            outlined
            hide-details
            dense
            :style="{ maxWidth: '350px' }"
          />
          <v-select
            v-model.trim="settings.category"
            :items="$store.getters.fineCategories"
            label="Категория"
            outlined
            clearable
            hide-details
            dense
            :style="{ maxWidth: '450px' }"
          />
          <v-checkbox
            v-model="showOnlySelected"
            label="Только отмеченные"
            hide-details
            dense
          />
          <v-text-field
            v-model.lazy.trim="settings.searchStr"
            label="Поиск"
            outlined
            clearable
            hide-details
            dense
            :style="{ minWidth: '450px' }"
          />
        </div>
        <v-data-table
          v-model="selected"
          item-key="_id"
          show-select
          :headers="headers"
          :items="preparedList"
          :loading="loading"
          :singleSelect="false"
          height="70vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateRange from '@/modules/common/components/dateRange2'
import { useFineList } from './useList'

export default {
  name: 'FineList',
  components: {
    AppButtonsPanel,
    AppDateRange,
  },

  setup() {
    const {
      fineStatuses,
      settings,
      headers,
      selected,
      showOnlySelected,
      formName,
      loading,
      refetch,
      count,
      preparedList,
      setInitSettings,
    } = useFineList()

    return {
      fineStatuses,
      formName,
      settings,
      headers,
      loading,
      refetch,
      count,
      preparedList,
      selected,
      showOnlySelected,
      setInitSettings,
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    trucks() {
      return this.$store.getters
        .activeTrucksOnDate()
        .filter((item) => ['truck', 'trailer'].includes(item.type))
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.regNum }))
    },

    drivers() {
      return this.$store.getters
        .activeDriversOnDate()
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.fullName }))
    },
  },
  mounted() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      const storedSettings = this.$store.getters.formSettingsMap.get(
        this.formName
      )
      this.setInitSettings(storedSettings)
    }
  },

  methods: {
    create() {
      this.$router.push({ name: 'FineCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`fines/${item._id}`)
    },
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}
</style>
