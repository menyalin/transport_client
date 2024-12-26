import { ref, watch, getCurrentInstance, computed } from 'vue'
import { allHeaders } from './headers'
import { IncomingInvoiceService } from '@/shared/services'
import { moneyFormatter } from '@/shared/utils'

export const useTable = (props, _ctx) => {
  const selected = ref([])
  const selectedIds = computed(() => {
    return selected.value.map((i) => i.orderId)
  })
  const { proxy } = getCurrentInstance()
  const listOptions = ref({})
  const loading = ref(false)
  const items = ref([])
  const total = ref({
    count: 0,
    withVat: 0,
    woVat: 0,
  })

  async function getData(invoiceId) {
    if (!invoiceId) return

    try {
      loading.value = true
      const data = await IncomingInvoiceService.getInvoiceOrders({
        incomingInvoiceId: invoiceId,
        limit: listOptions.value.itemsPerPage,
        skip: (listOptions.value.page - 1) * listOptions.value.itemsPerPage,
      })
      items.value = data.items.map((i) => ({
        ...i,
        total: {
          priceWithVat: moneyFormatter(i.total.priceWithVat, 2),
          priceWOVat: moneyFormatter(i.total.priceWOVat, 2),
        },
      }))
      total.value = {
        count: data.totalCount,
        withVat: data.totalPriceWithVat,
        woVat: data.totalPriceWOVat,
      }
    } catch (e) {
      proxy.$store.commit('setError', e.response.data || e.message)
    } finally {
      loading.value = false
    }
  }

  function dblClickRow(_event, { item }) {
    proxy.$router.push({
      name: 'DetailsOrder',
      params: { id: item.orderId },
    })
  }

  async function removeOrdersHandler() {
    try {
      loading.value = true
      await IncomingInvoiceService.removeOrders(
        props.invoiceId,
        selectedIds.value
      )
      await getData(props.invoiceId)
    } catch (e) {
      proxy.$store.commit('setError', e.response.data || e.message)
    } finally {
      loading.value = false
    }
  }
  watch(
    () => props.invoiceId,
    async (val) => {
      await getData(val)
    }
  )

  return {
    items,
    total,
    loading,
    headers: allHeaders,
    dblClickRow,
    listOptions,
    selected,
    removeOrdersHandler,
  }
}
