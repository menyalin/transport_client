<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <v-select
            :modelValue="settings.periodSetting"
            :items="periodSettingItems"
           
            hideDetails
            variant="outlined"
       density="compact"
            label="Период по"
            :style="{ maxWidth: '300px' }"
          />
          <DateRangeInput :modelValue="settings.period" />

          <v-select
            :modelValue="settings.status"
            :items="fineStatuses"
           
            hideDetails
            variant="outlined"
       density="compact"
            label="Статус"
            :style="{ maxWidth: '200px' }"
          />
          <v-autocomplete
            :modelValue="settings.truck"
            label="Грузовик / Прицеп"
            :items="trucks"
            clearable
            autoSelectFirst
            variant="outlined"
       density="compact"
            hideDetails
           
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            :modelValue="settings.driver"
            label="Водитель"
            :items="drivers"
            autoSelectFirst
            clearable
            variant="outlined"
       density="compact"
            hideDetails
           
            :style="{ maxWidth: '350px' }"
          />
          <v-select
            v-model.trim="settings.categories"
            :items="$store.getters.fineCategories"
            label="Категория"
            variant="outlined"
       density="compact"
            clearable
            multiple
            hideDetails
            singleLine
           
          />
          <v-checkbox v-model="showOnlySelected" label="Только отмеченные" hideDetails dense />
          <v-checkbox :modelValue="settings.needToWithheld" label="Удержать из ЗП водителя" hideDetails dense />
          <v-text-field
            v-model.lazy.trim="settings.searchStr"
            label="Поиск"
            variant="outlined"
       density="compact"
            clearable
            hideDetails
           
            :style="{ minWidth: '450px', maxWidth: '600px' }"
          />
          <v-autocomplete
            :modelValue="settings.payingByWorker"
            label="Оплатил"
            :items="workerItems"
            autoSelectFirst
            clearable
            variant="outlined"
       density="compact"
            hideDetails
           
            :loading="workerIsLoading"
            :style="{ maxWidth: '350px' }"
            :customFilter="() => true"
            :search="searchString"
            @update:search="handleSearchInputUpdate"
            @update:model-value="handleChange"
          />
        </div>
        <v-data-table
          v-model="selected"
          v-model:options="listOptions"
          itemKey="_id"
          showSelect
          :headers="headers"
          :items="preparedList"
          :loading="loading"
          :singleSelect="false"
         
          fixedHeader
          height="71vh"
          :itemsLength="count"
          :footerProps="{
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
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { computed } from 'vue'
import { ButtonsPanel, DateRangeInput } from '@/shared/ui'
import { useItemsForAutocomplete } from '@/entities/worker'
import { FineListAnalitics } from '@/entities/fine'
import { useFineList } from './useList'

export default {
  name: 'FineList',
  components: {
    ButtonsPanel,
    DateRangeInput,
    FineListAnalitics,
  },

  setup(_props, ctx) {
    const {
      fineStatuses,
      settings,
      headers,
      selected,
      showOnlySelected,
      periodSettingItems,
      loading,
      refetch,
      count,
      analyticData,
      preparedList,
      setInitSettings,
      listOptions,
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
      fineStatuses,
      periodSettingItems,
      settings,
      listOptions,
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
    trucks() {
      return this.$store.getters
        .activeTrucksOnDate()
        .filter(item => ['truck', 'trailer'].includes(item.type))
        .filter(item => !item.hideInFines)
        .map(item => ({ value: item._id, text: item.regNum }))
    },

    drivers() {
      return this.$store.getters
        .activeDriversOnDate()
        .filter(item => !item.hideInFines)
        .map(item => ({ value: item._id, text: item.fullName }))
    },
  },

  methods: {
    create() {
      this.$router.push({ name: 'FineCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`fines/${item._id}`)
    },
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
