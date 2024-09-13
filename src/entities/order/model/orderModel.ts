//@ts-nocheck
import dayjs from 'dayjs'

function setFixedTime(time = null) {
  if (!time) return null
  if (typeof time === 'string') return convertTimeToHours(time)
  return time
}

function convertTimeToHours(timeString: string): number {
  const [time, periodString] = timeString.split(' ')
  const [hours, minutes] = time.split(':').map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid time string: ${timeString}`)
  }

  let hour = hours
  if (periodString) {
    switch (periodString.toLowerCase()) {
      case 'pm':
        if (hour !== 12) {
          hour += 12
        }
        break
      case 'am':
        if (hour === 12) {
          hour = 0
        }
        break
      default:
        throw new Error(`Invalid period string: ${periodString}`)
    }
  }

  return hour + minutes / 60
}

export class OrderModel {
  static fillRouteFromTemplate(template, date) {
    if (!date) throw new Error('fillRouteFromTemplate: route date is missing')
    if (!dayjs(date).isValid())
      throw new Error('fillRouteFromTemplate: route date is invalid')
    const orderDate = dayjs(date)
    const tmpRoute = []

    template.route.forEach((p, idx) => {
      const point = {
        plannedDate: null,
        plannedDateDoc: null,
        type: p.type,
        isReturn: p.isReturn,
        address: p.address,
        note: p.note,
        useInterval: p.useInterval,
      }
      if (idx === 0 && !p.fixedTime) {
        point.plannedDate = orderDate.toISOString()
        point.plannedDateDoc = orderDate.toISOString()
      }
      if (p.fixedTime) {
        const plannedDate = orderDate
          .startOf('day')
          .add(setFixedTime(p.fixedTime) || 0, 'hours')
          .add(p.offsetDays || 0, 'days')

        point.plannedDate = plannedDate.toISOString()
        point.plannedDateDoc = plannedDate.toISOString()
        if (p.useInterval) {
          point.intervalEndDate = plannedDate
            .add(p.hoursInterval || 0, 'hours')
            .toISOString()
          point.intervalEndDateDoc = point.intervalEndDate
        }
      }
      tmpRoute.push(point)
    })
    return tmpRoute
  }
}
