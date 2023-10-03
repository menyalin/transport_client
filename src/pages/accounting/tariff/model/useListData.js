import store from '@/store'
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { TariffService, AgreementService } from '@/shared/services'
import { useHistorySettings } from '@/shared/hooks'

export const useListData = () => {
  const editableItem = ref({})
  const agreementItems = ref([])
  const showDialog = ref(false)

  const settings = useHistorySettings({
    type: null,
    date: null,
    document: null,
    agreement: null,
  })

  const listOptions = useHistorySettings({
    page: 1,
    itemsPerPage: 50,
  })

  const loading = ref(false)
  const count = ref(0)
  const items = ref([])
  const headers = [
    {
      value: '_date',
      text: 'Дата начала действия',
      sortable: false,
      align: 'right',
    },
    { value: 'agreementName', text: 'Соглашение', sortable: false },
    { value: '_document', text: 'Документ', sortable: false },
    { value: '_type', text: 'Тип', sortable: false },
    { value: '_result', text: 'Параметры', sortable: false },

    {
      value: '_truckKind',
      text: 'Вид ТС',
      sortable: false,
    },
    {
      value: 'liftCapacity',
      text: 'Грузоподъемность',
      sortable: false,
    },
    {
      value: '_price',
      text: 'Тариф',
      sortable: false,
      align: 'right',
    },
    {
      value: '_withVat',
      text: 'в т.ч. НДС',
      sortable: false,
      align: 'right',
    },

    { value: 'note', text: 'Примечание', sortable: false },
  ]

  function getResultStrByType(item) {
    try {
      switch (item.type) {
        case 'points': {
          const loadingStr =
            store.getters.addressMap.get(item.loading)?.shortName ||
            store.getters.addressMap.get(item.loading)?.name
          const unloadingStr =
            store.getters.addressMap.get(item.unloading)?.shortName ||
            store.getters.addressMap.get(item.unloading)?.name

          return loadingStr + '  >>>  ' + unloadingStr
        }

        case 'directDistanceZones':
          return `Погрузка: ${
            store.getters.addressMap.get(item.loading).shortName
          } , до ${item.maxDistance}км`
        default:
          return '-'
      }
    } catch (e) {
      // store.commit('setError', `Ошибка формирования строки: ${e.message || e}`)
      return '__ошибка формирования строки__'
    }
  }

  const preparedItems = computed(() => {
    return items.value.map((i) => ({
      ...i,
      _type: store.getters.tariffTypesMap.get(i.type),
      _document: store.getters.documentsMap.get(i.document)?.name || null,
      _date: new Date(i.date).toLocaleDateString(),
      _truckKind: store.getters.truckKindsMap.get(i.truckKind),
      _withVat: i.price.withVat,
      _price: new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: i.price.currency,
      }).format(i.price.price),

      _result: getResultStrByType(i),
    }))
  })
  async function refresh() {
    getData()
  }

  async function getData() {
    try {
      loading.value = true
      const data = await TariffService.getList({
        company: store.getters.directoriesProfile,
        date: settings.value.date,
        type: settings.value.type,
        agreement: settings.value.agreement,
        document: settings.value.document,
        client: settings.value.client,
        skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
        limit: listOptions.value.itemsPerPage,
        sortBy: listOptions.value?.sortBy.length
          ? listOptions.value.sortBy[0]
          : null,
        sortDesc: listOptions.value?.sortDesc.length
          ? listOptions.value.sortDesc[0]
          : null,
      })
      if (data.count) {
        items.value = data.items
        count.value = data.count
      } else {
        items.value = []
        count.value = 0
      }
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }
  const clientItems = computed(() =>
    store.getters.partners.filter((i) => i.isClient)
  )

  const documentItems = computed(() => {
    if (!settings.value.agreement || agreementItems.value.length === 0)
      return store.getters.documents
    const { clients } = agreementItems.value.find(
      (i) => i._id === settings.value.agreement
    )
    return store.getters.documents.filter((i) =>
      clients ? clients.includes(i.partner) : true
    )
  })

  async function dblClickRow(_, { item }) {
    const cleanItem = items.value.find((i) => i._id === item._id)
    editableItem.value = cleanItem
    await nextTick()
    showDialog.value = true
  }

  function cancelDialog() {
    showDialog.value = false
  }

  function deletedItemHandler(id) {
    items.value = items.value.filter((i) => i._id !== id)
    cancelDialog()
  }

  async function updateItem(item) {
    try {
      loading.value = true
      const updatedItem = await TariffService.updateOne({
        _id: item._id,
        body: item,
      })
      loading.value = false
      const idx = items.value.findIndex((i) => i._id === item._id)
      if (idx !== -1) items.value.splice(idx, 1, updatedItem)
      await nextTick()
      showDialog.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  watch(
    settings,
    () => {
      listOptions.value = Object.assign({}, listOptions.value, { page: 1 })
    },
    { deep: true }
  )

  watch(
    listOptions,
    () => {
      getData()
    },
    { deep: true }
  )

  onMounted(async () => {
    agreementItems.value = await AgreementService.getActiveAgreements()
  })

  return {
    headers,
    items: preparedItems,
    count,
    loading,
    settings,
    refresh,
    agreementItems,
    clientItems,
    documentItems,
    deletedItemHandler,
    cancelDialog,
    showDialog,
    dblClickRow,
    editableItem,
    updateItem,
    listOptions,
  }
}
