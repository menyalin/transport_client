import { ref, computed, watch } from 'vue'
import { AgreementService, ReportService } from '@/shared/services'
import {
  ADDITIONAL_FILTER_LIST,
  MAIN_FILTER_LIST,
  GROUP_BY_ITEMS,
} from './constants.js'

export const useReportSettings = () => {
  const mainFilters = ref(MAIN_FILTER_LIST)
  const agreements = ref([])
  const loading = ref(false)
  const pivotData = ref({})
  const usePriceWithVat = ref(false)

  const settings = ref({
    dateRange: null,
    groupBy: 'client',
  })

  const daysInRange = computed(() => {
    const start = new Date(settings.value.dateRange[0])
    const end = new Date(settings.value.dateRange[1])
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  })

  async function getAgreements() {
    const { items } = await AgreementService.getList({
      skip: 0,
      limit: 100,
      company: this.$store.getters.directoriesProfile,
      clientsOnly: true,
    })
    this.agreements = Object.assign(
      [],
      items
        .map((i) => ({
          value: i._id,
          text: i.name,
        }))
        .sort((a, b) => (a.name > b.name ? -1 : 1))
    )
  }

  function updateSelected(val) {
    const groupItem = GROUP_BY_ITEMS.find(
      (i) => i.value === this.settings.groupBy
    )
    this.additionalFilters[groupItem.filterName] = {
      values: val,
      cond: 'in',
    }
  }
  async function getData() {
    try {
      loading.value = true
      const { pivot } = await ReportService.grossProfitPivot({
        dateRange: this.settings.dateRange,
        company: this.$store.getters.directoriesProfile,
        groupBy: this.settings.groupBy,
        mainFilters: this.mainFilters,
      })
      this.pivotData = pivot
      loading.value = false
    } catch (e) {
      this.$store.commit('setError', e.message)
      loading.value = false
    }
  }

  watch([settings, mainFilters], getData, { deep: true })

  return {
    settings,
    groupItems: GROUP_BY_ITEMS,

    additionalFilters: ADDITIONAL_FILTER_LIST,
    agreements,
    loading,
    pivotData,
    usePriceWithVat,
    daysInRange,
  }
}
