import { ref, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { debounce } from '@/shared/utils'
import { roundingHours } from '../helpers'

export function useScheduleLayout(tableBodyRef, rowTitleColumnRef) {
  const tableWidth = ref(0)
  const titleColumnWidth = ref(0)
  const titleRowHeight = ref(0)

  function resizeScreen() {
    if (!tableBodyRef.value) return
    titleColumnWidth.value = rowTitleColumnRef.value.offsetWidth
    titleRowHeight.value = rowTitleColumnRef.value.offsetHeight
    tableWidth.value = tableBodyRef.value.offsetWidth - titleColumnWidth.value
  }

  let _debouncedResize = null

  onMounted(() => {
    _debouncedResize = debounce(resizeScreen, 150)
    window.addEventListener('resize', _debouncedResize)
    resizeScreen()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', _debouncedResize)
  })

  function getLeftShiftForOrder({ startPositionDate, needRoundTime }, { period, secInPx }) {
    if (!tableWidth.value) return 0

    let sPositionMoment
    if (needRoundTime) {
      sPositionMoment = dayjs(startPositionDate)
      sPositionMoment = sPositionMoment.hour(roundingHours(sPositionMoment.hour()))
      sPositionMoment = sPositionMoment.minute(0)
    } else {
      sPositionMoment = dayjs(startPositionDate)
    }

    const sPeriod = dayjs(period.value[0]).unix()
    const sOrder = sPositionMoment.unix()
    let leftShift = 0
    if (sPeriod <= sOrder) leftShift = sOrder - sPeriod
    return leftShift / secInPx.value + titleColumnWidth.value
  }

  function getOrderWidth(
    { startPositionDate, endPositionDate, type, needRoundTime, isCompleted },
    { period, secInPx, onlyPlannedDates }
  ) {
    let startPoint
    let endPoint
    const SEC_IN_SIX_HOURS = 6 * 60 * 60
    const SEC_IN_THREE_HOURS = 3 * 60 * 60

    if (dayjs(startPositionDate).isBefore(period.value[0])) startPoint = dayjs(period.value[0])
    else startPoint = dayjs(startPositionDate)

    if (needRoundTime) {
      startPoint = startPoint.hour(roundingHours(startPoint.hour()))
      startPoint = startPoint.minute(0)
    }

    if (dayjs(period.value[1]).add(24, 'h').isBefore(endPositionDate))
      endPoint = dayjs(period.value[1]).add(1, 'd')
    else endPoint = dayjs(endPositionDate)

    const duration = endPoint.unix() - startPoint.unix()

    if (type && onlyPlannedDates)
      return (duration > SEC_IN_THREE_HOURS ? duration : SEC_IN_THREE_HOURS) / secInPx.value
    else
      return (
        (duration > SEC_IN_SIX_HOURS || !!type || (isCompleted && !onlyPlannedDates)
          ? duration
          : SEC_IN_SIX_HOURS) / secInPx.value
      )
  }

  return {
    tableWidth,
    titleColumnWidth,
    titleRowHeight,
    getLeftShiftForOrder,
    getOrderWidth,
  }
}
