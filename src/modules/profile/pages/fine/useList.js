import store from '@/store'
import { computed, watch, ref, onMounted } from 'vue'
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
    {
      value: 'totalSum',
      text: 'Общая сумма штрафа',
      sortable: true,
      align: 'right',
    },
    {
      value: 'discountedSum',
      text: 'Сумма, с учетом скидки',
      sortable: true,
      align: 'right',
    },
    { value: 'expiryDateOfDiscount', text: 'Скидка до', sortable: true },
    { value: 'isPayment', text: 'Оплачен', sortable: false },
    { value: 'withheldSum', text: 'Удержано', sortable: false, align: 'right' },
    { value: 'paymentDate', text: 'Дата оплаты', sortable: false },
    { value: '_worker.name', text: 'Оплатил', sortable: false },
    { value: 'category', text: 'Категория', sortable: false },
    { value: 'note', text: 'Примечание', sortable: false },
  ]
  const loading = ref(false)
  const selected = ref([])
  const showOnlySelected = ref(false)

  let settings = ref({
    period: [
      dayjs().add(-90, 'd').format('YYYY-MM-DD'),
      dayjs().add(25, 'd').format('YYYY-MM-DD'),
    ],
    status: 'notPaid',
    driver: null,
    truck: null,
    category: null,
    searchStr: null,
    listOptions: {
      page: 1,
      itemsPerPage: 50,
    },
  })

  const queryParams = computed(() => ({
    company: store.getters.directoriesProfile,
    startDate: settings.value.period[0],
    endDate: settings.value.period[1],
    status: settings.value.status,
    truck: settings.value.truck,
    driver: settings.value.driver,
    category: settings.value.category,
    sortBy: settings.value.listOptions?.sortBy,
    sortDesc: settings.value.listOptions.sortDesc,
    searchStr: settings.value.searchStr,
    skip:
      settings.value.listOptions.itemsPerPage *
      (settings.value.listOptions.page - 1),
    limit: settings.value.listOptions.itemsPerPage,
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

  const refetch = () => {
    getData(queryParams.value)
  }

  const preparedList = computed(() => {
    return list.value
      .filter((i) => {
        if (!showOnlySelected.value) return true
        else return selected.value.map((s) => s._id).includes(i._id)
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
        paymentDate: i.paymentDate
          ? new Date(i.paymentDate).toLocaleDateString()
          : null,
        expiryDateOfDiscount: i.expiryDateOfDiscount
          ? new Date(i.expiryDateOfDiscount).toLocaleDateString()
          : null,
      }))
  })

  watch(settings.value, () => getData(queryParams.value))

  onMounted(() => {
    getData(queryParams.value)
  })

  function setInitSettings(initSettings) {
    settings.value = Object.assign(settings.value, initSettings)
  }

  return {
    selected,
    showOnlySelected,
    fineStatuses,
    formName,
    settings,
    refetch,
    headers,
    loading,
    list,
    count,
    preparedList,
    setInitSettings,
  }
}
