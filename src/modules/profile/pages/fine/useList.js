import store from '@/store'
import { reactive, computed, watch, ref, onMounted} from '@vue/composition-api'
import service from '@/modules/profile/services/fine.service'
import dayjs from 'dayjs'

export const useFineList = () => {
  const formName = 'fineList'
  const fineStatuses = [
    { text: 'Не оплачен', value: 'notPaid' },
    { text: 'Оплачен', value: 'paid' },
    { text: 'Все', value: 'all' },
  ]
  const headers = [
    { value: 'date', text: 'Дата постановления', sortable: true },
    { value: 'number', text: 'Номер постановления', sortable: false },
    { value: 'violationDate', text: 'Дата нарушения', sortable: true },
    { value: 'truck', text: 'Грузовик / Прицеп', sortable: false },
    { value: 'driver', text: 'Водитель', sortable: false },
    { value: 'totalSum', text: 'Общая сумма штрафа', sortable: true },
    { value: 'discountedSum', text: 'Сумма, с учетом скидки', sortable: true },
    { value: 'expiryDateOfDiscount', text: 'Скидка до', sortable: true },
    { value: 'isPayment', text: 'Оплачен', sortable: false },
    { value: 'category', text: 'Категория', sortable: false },
    { value: 'note', text: 'Примечание', sortable: false },
  ]
  const loading = ref(false)
  const settings = reactive({
    selected: [],
    showOnlySelected: false,
    period: [
      dayjs().add(-45, 'd').format('YYYY-MM-DD'),
      dayjs().add(5, 'd').format('YYYY-MM-DD'),
    ],
    status: 'notPaid',
    driver: null,
    truck: null,
    category: null,
    listOptions: {
      page: 1,
      itemsPerPage: 50,
    },
  })
  const setSettingsPeriod = (period) => {
    if (period) settings.period = period
  }

  const queryParams = computed(() => ({
    company: store.getters.directoriesProfile,
    startDate: settings.period[0],
    endDate: settings.period[1],
    status: settings.status,
    truck: settings.truck,
    driver: settings.driver,
    category: settings.category,
    sortBy: settings.listOptions?.sortBy,
    sortDesc: settings.listOptions.sortDesc,
    skip: settings.listOptions.itemsPerPage * (settings.listOptions.page - 1),
    limit: settings.listOptions.itemsPerPage,
  }))

  const list = ref([])
  const count = ref(0)

  const getData = async (params) => {
    if (!params) return null
    try {
      loading.value = true
      const data = await service.getList(params)
      loading.value = false
      list.value = data.items || []
      count.value = data.count || 0
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  const refetch = () => getData(queryParams.value)

  const preparedList = computed(() => {
    return list.value
    .filter(i => {
      if (!settings.showOnlySelected) return true
      else return settings.selected.map((s) => s._id).includes(i._id)
    })
    .map((i) => ({
      ...i,
      date: new Date(i.date).toLocaleDateString(),
      truck: store.getters.trucksMap.get(i.truck)?.regNum || '-',
      driver: store.getters.driversMap.get(i.driver)?.fullName || '-',
      violationDate: i.violationDate
        ? new Date(i.violationDate).toLocaleString()
        : null,
      isPayment: i.paymentDate || i.isPaydByDriver ? 'Да' : 'Нет',
      category: i.category
        ? store.getters.fineCategoriesMap.get(i.category)
        : null,
      expiryDateOfDiscount: i.expiryDateOfDiscount
        ? new Date(i.expiryDateOfDiscount).toLocaleDateString()
        : null,
    }))
  })

  watch(settings, () => getData(queryParams.value))
  
  onMounted(() => {
    getData(queryParams.value)
  })

  return {
    fineStatuses,
    formName,
    settings,
    refetch,
    headers,
    loading,
    list,
    count,
    setSettingsPeriod,
    preparedList,
  }
}

