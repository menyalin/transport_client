<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!hasPermission"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <app-table-column-settings
            v-model="activeHeaders"
            :allHeaders="allHeaders"
            :listSettingsName="listSettingsName"
          />
          <v-text-field
            v-model="settings.date"
            type="date"
            outlined
            dense
            hide-details
            label="Тарифы на дату"
            :style="{ 'max-width': '220px' }"
          />
          <v-select
            v-model="settings.tk"
            label="ТК"
            :items="carriers"
            dense
            item-text="name"
            item-value="_id"
            outlined
            clearable
            hide-details
            :style="{ 'max-width': '220px' }"
          />
          <v-select
            v-model="settings.type"
            :items="salaryTariffTypes"
            outlined
            clearable
            dense
            hide-details
            label="Тип тарифа"
            :style="{ 'max-width': '250px' }"
          />
          <v-select
            v-model="settings.liftCapacity"
            :items="liftCapacityTypes"
            outlined
            clearable
            dense
            hide-details
            label="Грузоподъемность"
            :style="{ 'max-width': '180px' }"
          />
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredList"
          :loading="loading"
          height="73vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item._result`]="{ item }">
            <app-zones-cell v-if="item.type === 'zones'" :item="item" />
            <app-regions-cell
              v-else-if="item.type === 'regions'"
              :item="item"
            />
            <app-waiting-cell
              v-else-if="item.type === 'waiting'"
              :item="item"
            />
            <app-return-cell v-else-if="item.type === 'return'" :item="item" />
            <div v-else>{{ item._result }}</div>
          </template>
        </v-data-table>
        <app-salary-tariff-form
          v-model="editableItem"
          :carrierItems="carriers"
          :dialog="dialog"
          @cancel="cancelDialog"
          @update="updateItem"
          @deletedItem="deletedItem"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from 'vue'

import { ButtonsPanel } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import AppSalaryTariffForm from '@/modules/accounting/components/salaryTariffForm/index.vue'
import AppZonesCell from '@/modules/accounting/components/salaryTariffGroupList/zones'
import AppRegionsCell from '@/modules/accounting/components/salaryTariffGroupList/regions'
import AppWaitingCell from '@/modules/accounting/components/salaryTariffGroupList/waiting.vue'
import AppReturnCell from '@/modules/accounting/components/salaryTariffGroupList/return.vue'

import { SalaryTariffService } from '@/shared/services'
import { useListColumnSetting, usePersistedRef } from '@/shared/hooks'
import { useCarrierStore } from '@/entities/carrier'
import { ALL_LIST_HEADERS, DEFAULT_HEADERS } from './constants'

export default {
  name: 'SalaryTariffList',

  components: {
    ButtonsPanel,
    AppTableColumnSettings,
    AppSalaryTariffForm,
    AppZonesCell,
    AppRegionsCell,
    AppWaitingCell,
    AppReturnCell,
  },

  setup() {
    const { proxy } = getCurrentInstance()
    const carrierStore = useCarrierStore()

    // Настройки колонок таблицы
    const { listSettingsName, activeHeaders, allHeaders, headers } =
      useListColumnSetting({
        listSettingsName: 'salaryTariffList:columns',
        defaultHeaders: DEFAULT_HEADERS,
        allHeaders: ALL_LIST_HEADERS,
      })

    // Состояние
    const loading = ref(false)
    const dialog = ref(false)
    const editableItem = ref({})
    const list = ref([])
    const count = ref(0)

    const settings = usePersistedRef(
      {
        type: null,
        date: null,
        tk: null,
        liftCapacity: null,
        listOptions: {
          page: 1,
          itemsPerPage: 50,
        },
      },
      'salaryTariffList:settings'
    )

    // Getters
    const hasPermission = computed(() =>
      proxy.$store.getters.hasPermission('salaryTariff:write')
    )
    const directoriesProfile = computed(
      () => proxy.$store.getters.directoriesProfile
    )
    const salaryTariffTypes = computed(
      () => proxy.$store.getters.salaryTariffTypes
    )
    const salaryTariffTypesMap = computed(
      () => proxy.$store.getters.salaryTariffTypesMap
    )
    const liftCapacityTypes = computed(
      () => proxy.$store.getters.liftCapacityTypes
    )
    const addressMap = computed(() => proxy.$store.getters.addressMap)
    const partnersMap = computed(() => proxy.$store.getters.partnersMap)
    const partnerGroupsMap = computed(
      () => proxy.$store.getters.partnerGroupsMap
    )
    const carriers = computed(() => carrierStore.carriers)
    const carriersMap = computed(() => carrierStore.carriersMap)

    // Получение строки результата по типу тарифа
    const getResultStrByType = (item) => {
      switch (item.type) {
        case 'points': {
          const loadingAddr = addressMap.value.get(item.loading)
          const unloadingAddr = addressMap.value.get(item.unloading)
          const loadingStr = loadingAddr?.shortName || loadingAddr?.name
          const unloadingStr = unloadingAddr?.shortName || unloadingAddr?.name
          return loadingStr + '  >>>  ' + unloadingStr
        }
        case 'directDistanceZones':
          return `Погрузка: ${
            addressMap.value.get(item.loading).shortName
          }, до ${item.maxDistance}км`
        default:
          return '-'
      }
    }

    // Трансформация данных для таблицы
    const filteredList = computed(() => {
      return list.value.map((item) => ({
        ...item,
        _type: salaryTariffTypesMap.value.get(item.type),
        _date: new Date(item.date).toLocaleDateString(),
        _result: getResultStrByType(item),
        _tks: item.tks
          .map((tkId) => carriersMap.value?.get(tkId)?.name)
          .join(', '),
        _sum: Intl.NumberFormat().format(item.sum),
        _clients: item.clients
          ?.map((client) => partnersMap.value.get(client)?.name)
          .join(', '),
        _consigneeTypes: item.consigneeTypes
          ?.map((type) => partnerGroupsMap.value.get(type))
          .join(', '),
        _liftCapacity: item.liftCapacity.join(', '),
      }))
    })

    // Загрузка данных
    const getData = async () => {
      try {
        loading.value = true
        const { items, count: totalCount } = await SalaryTariffService.getList({
          company: directoriesProfile.value,
          date: settings.value.date,
          type: settings.value.type,
          tk: settings.value.tk,
          liftCapacity: settings.value.liftCapacity,
          skip:
            settings.value.listOptions.itemsPerPage *
            (settings.value.listOptions.page - 1),
          limit: settings.value.listOptions.itemsPerPage,
          sortBy: settings.value.listOptions.sortBy[0] || null,
          sortDesc: settings.value.listOptions.sortDesc[0] || null,
        })

        list.value = items || []
        count.value = totalCount || 0
      } catch (e) {
        console.log(e)
        proxy.$store.commit('setError', e.message)
      } finally {
        loading.value = false
      }
    }

    // Действия
    const create = () => {
      proxy.$router.push({ name: 'SalaryTariffCreate' })
    }

    const refresh = () => {
      getData()
    }

    const dblClickRow = (_, { item }) => {
      const cleanItem = list.value.find((i) => i._id === item._id)
      editableItem.value = { ...cleanItem }
      dialog.value = true
    }

    const cancelDialog = () => {
      dialog.value = false
    }

    const deletedItem = (id) => {
      list.value = list.value.filter((i) => i._id !== id)
      dialog.value = false
    }

    const updateItem = async (item) => {
      try {
        loading.value = true
        const updatedItem = await SalaryTariffService.updateOne({
          _id: item._id,
          body: item,
        })

        const idx = list.value.findIndex((i) => i._id === item._id)
        if (idx !== -1) list.value.splice(idx, 1, updatedItem)
        dialog.value = false
      } catch (e) {
        proxy.$store.commit('setError', e.message)
      } finally {
        loading.value = false
      }
    }

    // Watch
    watch(
      settings,
      () => {
        getData()
      },
      { deep: true }
    )

    return {
      // Настройки таблицы
      listSettingsName,
      activeHeaders,
      allHeaders,
      headers,

      // Состояние
      loading,
      dialog,
      editableItem,
      filteredList,
      count,
      settings,

      // Getters
      hasPermission,
      carriers,
      salaryTariffTypes,
      liftCapacityTypes,

      // Методы
      create,
      refresh,
      dblClickRow,
      cancelDialog,
      deletedItem,
      updateItem,
    }
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
