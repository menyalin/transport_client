import dayjs from 'dayjs'
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { FineService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { sortingAdapterForOldApi } from '@/shared/utils/migrationUtils'

export const useFineList = () => {
  const store = useStore()

  const initialSettings = {
    period: [
      dayjs().add(-120, 'd').format('YYYY-MM-DD'),
      dayjs().add(25, 'd').format('YYYY-MM-DD'),
    ],
    periodSetting: 'date',
    fineStatus: 'all',
    status: 'notPaid',
    driver: null,
    truck: null,
    categories: [],
    searchStr: null,
    payingByWorker: null,
    needToWithheld: false,
  }
  const list = ref([])
  const count = ref(0)
  const serverAnalyticData = ref({})
  const periodSettingItems = [
    { title: 'Дата постановления', value: 'date' },
    { title: 'Дата нарушения', value: 'violationDate' },
    { title: 'Дата оплаты', value: 'paymentDate' },
  ]
  const fineStatuses = [
    { title: 'Не оплачен', value: 'notPaid' },
    { title: 'Оплачен', value: 'paid' },
    { title: 'Все', value: 'all' },
  ]
  const headers = [
    { value: 'date', title: 'Дата постановления', sortable: true, default: true },
    { value: 'number', title: 'Номер постановления', sortable: false, default: true },
    { value: 'violationDate', title: 'Дата нарушения', sortable: true, default: true },
    { value: 'truck', title: 'Грузовик / Прицеп', sortable: false, default: true },
    { value: 'driver', title: 'Водитель', sortable: false, default: true },
    {
      value: 'totalSum',
      title: 'Общая сумма штрафа',
      sortable: true,
      align: 'right',
      default: true,
    },
    {
      value: 'discountedSum',
      title: 'Сумма, с учетом скидки',
      sortable: true,
      align: 'right',
      default: true,
    },
    { value: 'expiryDateOfDiscount', title: 'Скидка до', sortable: true, default: true },
    { value: 'isPayment', title: 'Оплачен', sortable: false, default: true },
    { value: 'withheldSum', title: 'Удержать', sortable: false, align: 'right', default: true },
    { value: 'paymentDate', title: 'Дата оплаты', sortable: false, default: false },
    { value: '_worker.name', title: 'Оплатил', sortable: false, default: false },
    { value: 'category', title: 'Категория', sortable: false, default: true },
    { value: 'note', title: 'Примечание', sortable: false, default: true },
  ]
  const loading = ref(false)
  const selected = ref([])
  const showOnlySelected = ref(false)

  const settings = usePersistedRef(initialSettings, 'fineList:settings')
  const listOptions = usePersistedRef({ page: 1, itemsPerPage: 100 }, 'fineList:listOptions')

  // const activeSort = computed(() => listOptions.value.sortBy?.[0])

  const queryParams = computed(() => ({
    company: store.getters.directoriesProfile,
    startDate: settings.value.period[0],
    endDate: settings.value.period[1],
    periodSetting: settings.value.periodSetting,
    status: settings.value.status,
    truck: settings.value.truck,
    driver: settings.value.driver,
    categories: settings.value.categories,
    ...sortingAdapterForOldApi(listOptions.value.sortBy),
    searchStr: settings.value.searchStr,
    payingByWorker: settings.value.payingByWorker,
    needToWithheld: settings.value.needToWithheld,
    skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
    limit: listOptions.value.itemsPerPage,
  }))

  const getData = async (params) => {
    if (!params) return null
    try {
      loading.value = true
      const data = await FineService.getList(params)
      loading.value = false
      list.value = data.items || []
      count.value = data.count || 0
      serverAnalyticData.value = data.analyticData || {}
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  const analyticData = computed(() => {
    if (selected.value.length === 0) return serverAnalyticData.value
    return selected.value.reduce(
      (res, item) => {
        return {
          count: res.count + 1,
          totalSum: res.totalSum + item.totalSum,
          totalSumWithDiscount: res.totalSumWithDiscount + item.discountedSum,
          totalPayed: res.totalPayed + (item.paymentSum || 0),
          needWithheld: res.needWithheld + (item.withheldSum || 0),
          isWithheld: res.isWithheld + (item.isWithheld ? item.withheldSum : 0),
        }
      },
      {
        totalSum: 0,
        totalSumWithDiscount: 0,
        totalPayed: 0,
        needWithheld: 0,
        isWithheld: 0,
        count: 0,
      }
    )
  })

  const refetch = async () => {
    await getData(queryParams.value)
  }

  const preparedList = computed(() => {
    return list.value
      .filter((i) => {
        if (!showOnlySelected.value) return true
        return selected.value.map((s) => s._id).includes(i._id)
      })
      .map((i) => ({
        ...i,
        date: new Date(i.date).toLocaleDateString(),
        truck: store.getters.trucksMap.get(i.truck)?.regNum || '-',
        driver: store.getters.driversMap.get(i.driver)?.fullName || '-',
        violationDate: i.violationDate ? new Date(i.violationDate).toLocaleString() : null,
        isPayment: i.paymentDate || i.isPaydByDriver ? 'Да' : 'Нет',
        category: i.category ? store.getters.fineCategoriesMap.get(i.category) : null,
        paymentDate: i.paymentDate ? new Date(i.paymentDate).toLocaleDateString() : null,
        expiryDateOfDiscount: i.expiryDateOfDiscount
          ? new Date(i.expiryDateOfDiscount).toLocaleDateString()
          : null,
      }))
  })

  watch(
    settings,
    () => {
      listOptions.value = { ...listOptions.value, page: 1 }
    },
    { deep: true }
  )

  watch(
    listOptions,
    async () => {
      await getData(queryParams.value)
    },
    { deep: true }
  )

  const allHeaders = computed(() => {
    if (store.getters.hasPermission('fine:isWithheldRead'))
      return [
        ...headers,
        {
          value: 'isWithheld',
          title: 'Удержано',
          sortable: false,
          align: 'center',
        },
      ]
    return headers
  })

  return {
    selected,
    showOnlySelected,
    fineStatuses,
    periodSettingItems,
    settings,
    refetch,
    allHeaders,
    loading,
    list,
    count,
    analyticData,
    preparedList,
    listOptions,
  }
}
