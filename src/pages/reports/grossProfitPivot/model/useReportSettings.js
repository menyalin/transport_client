import { ref, computed, watch, onMounted } from 'vue'
import store from '@/store'
import { AgreementService, ReportService } from '@/shared/services'

import { ADDITIONAL_FILTER_LIST, MAIN_FILTER_LIST, GROUP_BY_ITEMS } from './constants.js'
import initDateRange from './initDateRange.js'
import usePersistedRef from '@/shared/hooks/usePersistedRef.js'

export const useReportSettings = () => {
  const mainFilters = usePersistedRef(MAIN_FILTER_LIST, 'main_filters')
  const selectedGroups = usePersistedRef([], 'selected_groups')
  const additionalFilters = usePersistedRef(ADDITIONAL_FILTER_LIST, 'grossProfitPivot:additional_filters')
  const usePriceWithVat = usePersistedRef(false, 'usePriceWithVat')
  const withRound = usePersistedRef(true, 'grossProfitPivot:withRound')
  const loading = ref(false)

  const agreements = ref([])
  const pivotData = ref({})

  const settings = usePersistedRef(
    {
      dateRange: initDateRange(),
      groupBy: 'client',
    },
    'grossProfitPivot:settings'
  )

  const daysInRange = computed(() => {
    const start = new Date(settings.value.dateRange[0])
    const end = new Date(settings.value.dateRange[1])
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  })

  async function getAgreements() {
    const { items } = await AgreementService.getList({
      skip: 0,
      limit: 100,
      company: store.getters.directoriesProfile,
      clientsOnly: true,
    })
    agreements.value = Object.assign(
      [],
      items
        .map(i => ({
          value: i._id,
          text: i.name,
        }))
        .sort((a, b) => (a.name > b.name ? -1 : 1))
    )
  }

  function updateSelected(val) {
    selectedGroups.value = val
    console.log('update selected: ', val)
    const groupItem = GROUP_BY_ITEMS.find(i => i.value === settings.value.groupBy)
    additionalFilters.value[groupItem.filterName] = {
      values: val,
      cond: 'in',
    }
  }
  async function getPivotData() {
    try {
      loading.value = true
      const { pivot } = await ReportService.grossProfitPivot({
        dateRange: settings.value.dateRange,
        company: store.getters.directoriesProfile,
        groupBy: settings.value.groupBy,
        mainFilters: mainFilters.value,
      })
      pivotData.value = pivot
      loading.value = false
    } catch (e) {
      store.commit('setError', e.message)
      loading.value = false
    }
  }

  onMounted(async () => {
    await getAgreements()
  })

  watch([settings, mainFilters], getPivotData, { deep: true, immediate: true })

  return {
    settings,
    withRound,
    groupItems: GROUP_BY_ITEMS,
    mainFilters,
    additionalFilters,
    agreements,
    loading,
    pivotData,
    usePriceWithVat,
    daysInRange,
    // убрать
    getAgreements,
    updateSelected,
    selectedGroups,
    getPivotData,
  }
}
