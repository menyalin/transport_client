import dayjs from 'dayjs'
import socket from '@/socket'
import store from '@/store'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { OrderService } from '@/shared/services'

const _initPeriod = () => {
  const todayM = dayjs()
  return [
    todayM.add(-3, 'd').startOf('day').format(),
    todayM.add(-1, 'd').endOf('day').format(),
  ]
}

export function useFeatureModel() {
  const truckItems = computed(() => {
    return store.getters.trucks
      .filter((t) => t.type === 'truck')
      .map((t) => ({ value: t._id, text: t.regNum }))
      .sort((a, b) => a.text - b.text)
  })

  const operationToken = uuidv4()
  const loading = ref(false)
  const messages = ref([])
  const historyState = window.history.state
  const initialState = {
    period: _initPeriod(),
    tripDurationInMinutes: 30,
    unloadingDurationInMinutes: 15,
    truckIds: [],
  }
  const infoText =
    'Для автозаполнения доступны рейсы в статусе "в работе". Плановые даты выгрузки не учитываются. При пересечении по времени, рейсы не обновляются.'

  const settings = ref(historyState.settings || initialState)

  async function autoFillDatesHandler() {
    messages.value = []
    messages.value.push({
      type: 'info',
      content: 'Запрос на автозаполнение отправлен',
    })
    const data = await OrderService.autoFillOrderDates({
      ...settings.value,
      operationToken,
    })
    console.log('data: ', data)
  }

  const disabledSubmit = computed(() => {
    const trucks = !settings.value.truckIds.length
    const tripDurationInMinutes =
      !!settings.value.tripDurationInMinutes &&
      settings.value.tripDurationInMinutes >= 10
    const unloadingDurationInMinutes =
      !!settings.value.unloadingDurationInMinutes &&
      settings.value.unloadingDurationInMinutes >= 10
    return trucks || !tripDurationInMinutes || !unloadingDurationInMinutes
  })
  watch(
    settings,
    () => {
      window.history.pushState({ settings: settings.value }, '')
    },
    { deep: true }
  )

  function autoFillDatesSuccessfulHandler(event) {
    if (event.token === operationToken)
      messages.value.push({
        type: 'info',
        content: event.message,
      })
  }

  function autoFillDatesCompletedHandler(event) {
    if (event.token === operationToken)
      messages.value.push({
        type: 'info',
        content: 'Обработка завершена',
      })
  }

  function autoFillDatesErrorHandler(event) {
    if (event.token === operationToken) {
      const regNum = store.getters.truckById(event.truck)?.regNum || ' - '
      messages.value.push({
        type: 'error',
        content: `Для грузовика ${regNum} автозаполнение не возможно! Пересечение временных интервалов.`,
      })
    }
  }

  socket.on('order:autoFillDatesSuccessful', autoFillDatesSuccessfulHandler)
  socket.on('order:autoFillDatesCompleted', autoFillDatesCompletedHandler)
  socket.on('order:autoFillDatesError', autoFillDatesErrorHandler)

  onBeforeUnmount(() => {
    socket.off('order:autoFillDatesSuccessful', autoFillDatesSuccessfulHandler)
    socket.off('order:autoFillDatesCompleted', autoFillDatesCompletedHandler)
    socket.off('order:autoFillDatesError', autoFillDatesErrorHandler)
  })

  return {
    loading,
    settings,
    infoText,
    operationToken,
    truckItems,
    autoFillDatesHandler,
    disabledSubmit,
    messages,
  }
}
