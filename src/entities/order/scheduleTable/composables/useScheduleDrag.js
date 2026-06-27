import { ref } from 'vue'
import dayjs from 'dayjs'
import { LINE_HEIGHT } from '../constants'
import { roundingHours } from '../helpers'

export function useScheduleDrag({
  rows,
  period,
  secInPx,
  titleColumnWidth,
  titleRowHeight,
  _draggableMode,
  emit,
}) {
  const draggedOrderId = ref(null)
  const overRowInd = ref(null)
  let _dragRAF = null

  function dragStartHandler(e, id) {
    const dt = e.dataTransfer
    dt.setData('text/orderId', id)
    dt.effectAllowed = 'move'
    draggedOrderId.value = id
    e.target.style.opacity = 0.5
    emit('startDragOrder', id)
  }

  function dragEndHandler(e, orderId) {
    e.target.style.opacity = 1
    if (e.dataTransfer.dropEffect === 'none') emit('endDragOrder', orderId)
    overRowInd.value = null
    draggedOrderId.value = null
  }

  function dragOverHandler(e) {
    const tableRect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - tableRect.top
    const x = e.clientX - tableRect.left - titleColumnWidth.value
    if (x < 0 || y < 0 || e.dataTransfer.effectAllowed === 'none') {
      e.dataTransfer.dropEffect = 'none'
      overRowInd.value = null
      return true
    }
    e.dataTransfer.dropEffect = 'move'
    if (_dragRAF) return
    _dragRAF = requestAnimationFrame(() => {
      _dragRAF = null
      overRowInd.value = Math.max(0, Math.floor((y - titleRowHeight.value) / LINE_HEIGHT))
    })
  }

  function dropOnBufferHandler(e) {
    draggedOrderId.value = null
    const tableRect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - tableRect.left - titleColumnWidth.value
    let startDate = dayjs.unix(dayjs(period.value[0]).unix() + x * secInPx.value)
    startDate = startDate.hour(roundingHours(startDate.hour()))
    emit('updateOrder', {
      truckId: null,
      orderId: e.dataTransfer.getData('text/orderId'),
      startDate: startDate.toISOString(),
    })
  }

  function dropHandler(e) {
    draggedOrderId.value = null
    if (
      overRowInd.value === null ||
      overRowInd.value < 0 ||
      overRowInd.value > rows.value.length - 1
    )
      return null

    const tableRect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - tableRect.left - titleColumnWidth.value
    let startDate = dayjs.unix(dayjs(period.value[0]).unix() + x * secInPx.value)
    startDate = startDate.hour(roundingHours(startDate.hour()))

    emit('updateOrder', {
      truckId: rows.value[overRowInd.value]._id,
      orderId: e.dataTransfer.getData('text/orderId'),
      startDate: startDate.format('YYYY-MM-DD HH:00'),
    })
  }

  function disabledZone(e) {
    e.dataTransfer.dropEffect = 'none'
    e.dataTransfer.effectAllowed = 'none'
    overRowInd.value = null
    return true
  }

  function isDraggableOrder(order) {
    const disabled = order.isDisabled
    const confirmed = order.state?.driverNotified || order.state?.clientNotified
    return !disabled && !confirmed
  }

  return {
    draggedOrderId,
    overRowInd,
    dragStartHandler,
    dragEndHandler,
    dragOverHandler,
    dropOnBufferHandler,
    dropHandler,
    disabledZone,
    isDraggableOrder,
  }
}
