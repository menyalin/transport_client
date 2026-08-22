import dayjs from 'dayjs'

export interface TemplateRoutePoint {
  type?: string
  isReturn?: boolean
  address?: string | null
  note?: string | null
  useInterval?: boolean
  fixedTime?: string | number | null
  offsetDays?: number
  hoursInterval?: number
  [key: string]: any
}

export interface FilledRoutePoint {
  plannedDate: string | null
  plannedDateDoc: string | null
  type?: string
  isReturn?: boolean
  address?: string | null
  note?: string | null
  useInterval?: boolean
  intervalEndDate?: string
  intervalEndDateDoc?: string
}

function convertTimeToHours(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time string')
  }
  return hours + minutes / 60
}

function setFixedTime(time: string | number | null | undefined): number | null {
  if (time === null || time === undefined) return null
  if (typeof time === 'string') return convertTimeToHours(time)
  return time
}

export function fillRouteFromTemplate(
  template: { route?: TemplateRoutePoint[] } | null | undefined,
  date: string | null | undefined
): FilledRoutePoint[] {
  if (!date) throw new Error('fillRouteFromTemplate: route date is missing')
  if (!dayjs(date).isValid()) throw new Error('fillRouteFromTemplate: route date is invalid')

  const orderDate = dayjs(date)
  const route = template?.route ?? []

  return route.map((p, idx) => {
    const point: FilledRoutePoint = {
      plannedDate: null,
      plannedDateDoc: null,
      type: p.type,
      isReturn: p.isReturn,
      address: p.address,
      note: p.note,
      useInterval: p.useInterval,
    }

    const hasFixedTime = p.fixedTime !== null && p.fixedTime !== undefined && p.fixedTime !== ''

    if (idx === 0 && !hasFixedTime) {
      point.plannedDate = orderDate.toISOString()
      point.plannedDateDoc = orderDate.toISOString()
    }

    if (hasFixedTime) {
      const plannedDate = orderDate
        .startOf('day')
        .add(setFixedTime(p.fixedTime) ?? 0, 'hours')
        .add(p.offsetDays || 0, 'days')

      point.plannedDate = plannedDate.toISOString()
      point.plannedDateDoc = plannedDate.toISOString()

      if (p.useInterval) {
        point.intervalEndDate = plannedDate.add(p.hoursInterval || 0, 'hours').toISOString()
        point.intervalEndDateDoc = point.intervalEndDate
      }
    }

    return point
  })
}
