<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('fine:write')"
      @submit="create"
      @refresh="refetch"
    />
    <ListSettingsWrapper>
      <app-table-column-settings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :defaultHeaders="defaultHeaders"
        listSettingsName="fineListColumns"
      />
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
        item-title="text"
        item-value="value"
        hide-details
        :style="{ maxWidth: '250px' }"
      />
      <v-autocomplete
        v-model="settings.driver"
        label="Водитель"
        :items="drivers"
        item-title="text"
        item-value="value"
        hide-details
        :style="{ maxWidth: '350px' }"
      />
      <v-select
        v-model="settings.categories"
        :items="store.getters.fineCategories"
        label="Категория"
        clearable
        multiple
        hide-details
        single-line
      />
      <v-checkbox v-model="showOnlySelected" label="Только отмеченные" hide-details />
      <v-checkbox v-model="settings.needToWithheld" label="Удержать из ЗП водителя" hide-details />
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
        item-title="text"
        item-value="value"
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
    </ListSettingsWrapper>
    <v-data-table-server
      v-model="selected"
      item-value="_id"
      show-select
      :headers="filteredHeaders"
      :items="preparedList"
      :loading="loading"
      fixed-header
      height="71vh"
      :items-length="count"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="listOptions"
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
  </EntityListWrapper>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, DateRangeInput, ListSettingsWrapper, EntityListWrapper } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings/index.vue'
import { useItemsForAutocomplete } from '@/entities/worker'
import { FineListAnalitics } from '@/entities/fine'
import { useFineList } from './useList'

defineOptions({ name: 'FineList' })

const router = useRouter()
const store = useStore()

const {
  fineStatuses,
  settings,
  allHeaders,
  selected,
  showOnlySelected,
  periodSettingItems,
  loading,
  refetch,
  count,
  analyticData,
  preparedList,
  listOptions,
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

const activeHeaders = ref([])

const defaultHeaders = allHeaders.value.filter((i) => i.default).map((i) => i.value)

const filteredHeaders = computed(() => {
  return allHeaders.value.filter((i) => activeHeaders.value.includes(i.value))
})

onMounted(() => {
  const savedFields = JSON.parse(localStorage.getItem('fineListColumns'))
  if (savedFields && savedFields.length > 0) {
    activeHeaders.value = savedFields
  } else {
    activeHeaders.value = defaultHeaders
  }
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

const directoriesProfile = computed(() => store.getters.directoriesProfile)

function create() {
  router.push({ name: 'FineCreate' })
}

function dblClickRow(_, { item }) {
  router.push(`fines/${item._id}`)
}
</script>

<style scoped></style>
