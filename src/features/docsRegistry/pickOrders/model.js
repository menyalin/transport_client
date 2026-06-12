import socket from '@/socket'
import dayjs from 'dayjs'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { DocsRegistryService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { useStore } from 'vuex'

const initPeriod = () => {
  return [dayjs().add(-1, 'month').startOf('month').toISOString(), new Date().toISOString()]
}

export const useListData = (props) => {
  if (!props.client) console.error('client id is missing')
  const vuexStore = useStore()
  const initialState = {
    search: null,
    docsRegistryId: null,
    onlySelectable: true,
    period: initPeriod(),
  }
  const settings = usePersistedRef(initialState, 'docsRegistry:pickOrders:settings')
  const listOptions = usePersistedRef({ page: 1 }, 'docsRegistry:pickOrders:listOptions')
  const items = ref([])
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  watch(
    settings,
    () => {
      listOptions.value = { ...listOptions.value, page: 1 }
    },
    { deep: true }
  )
  watch(listOptions, refresh, { deep: true })

  const queryParams = computed(() => ({
    ...settings.value,
    client: props.client,
    docsRegistryId: props._id,
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await DocsRegistryService.pickOrders(queryParams.value)
      items.value = data
    } catch (e) {
      vuexStore.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  function updateItems(data) {
    if (!items.value) return null
    let order = items.value.find((item) => item._id === data._id)
    if (!order) return null
    order = Object.assign(order, data)
  }

  socket.on('order:updated', updateItems)
  onBeforeUnmount(() => {
    socket.off('order:updated', updateItems)
  })

  return {
    loading,
    listOptions,
    refresh,
    settings,
    items,
  }
}
