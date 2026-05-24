<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <v-select
            v-model="settings.periodSetting"
            :items="periodSettingItems"
            hide-details
            label="Период по"
            :style="{ maxWidth: '300px' }"
          />
          <date-range-input v-model="settings.period" />

          <v-select
            v-model="settings.status"
            :items="fineStatuses"
            hide-details
            label="Статус"
            :style="{ maxWidth: '200px' }"
          />
          <v-autocomplete
            v-model="settings.truck"
            label="Грузовик / Прицеп"
            :items="trucks"
            hide-details
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            v-model="settings.driver"
            label="Водитель"
            :items="drivers"
            hide-details
            :style="{ maxWidth: '350px' }"
          />
          <v-select
            v-model.trim="settings.categories"
            :items="$store.getters.fineCategories"
            label="Категория"
            clearable
            multiple
            hide-details
            singleLine
          />
          <v-checkbox v-model="showOnlySelected" label="Только отмеченные" hide-details />
          <v-checkbox
            v-model="settings.needToWithheld"
            label="Удержать из ЗП водителя"
            hide-details
          />
          <v-text-field
            v-model.lazy.trim="settings.searchStr"
            label="Поиск"
            clearable
            hide-details
            :style="{ minWidth: '450px', maxWidth: '600px' }"
          />
          <v-autocomplete
            v-model="settings.payingByWorker"
            label="Оплатил"
            :items="workerItems"
            auto-select-first
            clearable
            hide-details
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
          item-key="_id"
          show-select
          :headers="headers"
          :items="preparedList"
          :loading="loading"
          fixed-header
          height="71vh"
          :items-length="count"
          :items-per-page-options="[50, 100, 200]"
          v-model:options="listOptions"
          @update:model-value="onSelectedChange"
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

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, DateRangeInput } from '@/shared/ui'
import { useItemsForAutocomplete } from '@/entities/worker'
import { FineListAnalitics } from '@/entities/fine'
import { useFineList } from './useList'

defineOptions({ name: 'FineList' })

const router = useRouter()
const store = useStore()

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
  listOptions,
  onSelectedChange,
} = useFineList()

const {
  items: workers,
  loading: workerIsLoading,
  handleChange,
  handleSearchInputUpdate,
  searchString,
} = useItemsForAutocomplete({
  ctx: { emit: () => {} },
  propValue: computed(() => settings.value.payingByWorker),
})

const workerItems = computed(() => [{ value: '__driver__', text: 'ВОДИТЕЛЬ' }, ...workers.value])

const trucks = computed(() =>
  store.getters
    .activeTrucksOnDate()
    .filter((item) => ['truck', 'trailer'].includes(item.type))
    .filter((item) => !item.hideInFines)
    .map((item) => ({ value: item._id, text: item.regNum }))
)

const drivers = computed(() =>
  store.getters
    .activeDriversOnDate()
    .filter((item) => !item.hideInFines)
    .map((item) => ({ value: item._id, text: item.fullName }))
)

function create() {
  router.push({ name: 'FineCreate' })
}

function dblClickRow(_, { item }) {
  router.push(`fines/${item._id}`)
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
