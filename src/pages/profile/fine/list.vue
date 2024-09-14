<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <date-range-input v-model="settings.period" />
          <v-select
            v-model="settings.status"
            :items="fineStatuses"
            density="compact"
            hide-details
            variant="outlined"
            label="Статус"
            :style="{ maxWidth: '200px' }"
          />
          <v-autocomplete
            v-model="settings.truck"
            label="Грузовик / Прицеп"
            :items="trucks"
            clearable
            auto-select-first
            variant="outlined"
            hide-details
            density="compact"
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            v-model="settings.driver"
            label="Водитель"
            :items="drivers"
            auto-select-first
            clearable
            variant="outlined"
            hide-details
            density="compact"
            :style="{ maxWidth: '350px' }"
          />
          <v-select
            v-model.trim="settings.category"
            :items="$store.getters.fineCategories"
            label="Категория"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :style="{ maxWidth: '450px' }"
          />
          <v-checkbox
            v-model="showOnlySelected"
            label="Только отмеченные"
            hide-details
          />
          <v-checkbox
            v-model="settings.needToWithheld"
            label="Удержать из ЗП водителя"
            hide-details
          />
          <v-text-field
            v-model.lazy.trim="settings.searchStr"
            label="Поиск"
            variant="outlined"
            clearable
            hide-details
            density="compact"
            :style="{ minWidth: '450px', maxWidth: '600px' }"
          />
          <v-autocomplete
            v-model="settings.payingByWorker"
            label="Оплатил"
            :items="workerItems"
            auto-select-first
            clearable
            variant="outlined"
            hide-details
            density="compact"
            :loading="workerIsLoading"
            :style="{ maxWidth: '350px' }"
            :customFilter="() => true"
            :search="searchString"
            @update:search="handleSearchInputUpdate"
            @update:model-value="handleChange"
          />
        </div>
        <v-data-table-server
          v-model="selected"
          v-model:options="settings.listOptions"
          item-key="_id"
          show-select
          :headers="headers"
          :items="preparedList"
          :loading="loading"
          :singleSelect="false"
          dense
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.isWithheld`]="{ item }">
            <v-icon v-if="item.isWithheld" color="primary">mdi-check</v-icon>
            <v-icon v-else color="primary">mdi-minus</v-icon>
          </template>
          <template #[`footer.prepend`]>
            <FineListAnalitics :data="analyticData" />
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { computed } from 'vue'
import { mapGetters } from 'vuex'

import { FineListAnalitics } from '@/entities/fine'
import { useItemsForAutocomplete } from '@/entities/worker'
import { ButtonsPanel, DateRangeInput } from '@/shared/ui'

import { useFineList } from './useList'

export default defineComponent({
  name: 'FineList',
  components: {
    ButtonsPanel,
    DateRangeInput,
    FineListAnalitics,
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },

  setup(_props, ctx) {
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
      analyticData,
      preparedList,
      setInitSettings,
    } = useFineList()

    const {
      items: workers,
      loading: workerIsLoading,
      handleChange,
      handleSearchInputUpdate,
      searchString,
    } = useItemsForAutocomplete({
      ctx,
      propValue: settings.value.payingByWorker,
    })
    const workerItems = computed(() => {
      return [{ value: '__driver__', text: 'ВОДИТЕЛЬ' }, ...workers.value]
    })
    return {
      workerItems,
      workerIsLoading,
      handleChange,
      handleSearchInputUpdate,
      searchString,
      //
      fineStatuses,
      formName,
      settings,
      headers,
      loading,
      refetch,
      count,
      analyticData,
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
})
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
