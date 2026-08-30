import { ref, computed } from 'vue'

export interface RoutePoint {
  type?: string
  address?: string | null
  plannedDate?: string
  arrivalDate?: string
  departureDate?: string
  note?: string
  isReturn?: boolean
  [key: string]: any
}

export function useOrderRoute(initialRoute?: RoutePoint[]) {
  // Создаём ref для маршрута
  const route = ref<RoutePoint[]>(
    initialRoute || [
      { type: 'loading', address: null, plannedDate: '', note: '' },
      { type: 'unloading', address: null, plannedDate: '', note: '' },
    ]
  )

  const currentPointInd = computed(() => {
    return route.value.findIndex((p) => !p.departureDate)
  })

  const routeDate = computed(() => {
    return route.value[0].plannedDate
  })

  const routeCompleted = computed(() => {
    return route.value.filter((point) => !point.departureDate).length === 0
  })

  const isExistFirstArrivalDate = computed(() => {
    return !!route.value[0]?.arrivalDate
  })

  // Оптимизированная версия - один проход с проверкой
  const isValidDatesInRoute = computed(() => {
    let lastDate: number | null = null
    for (const p of route.value) {
      for (const d of [p.arrivalDate, p.departureDate]) {
        if (!d) continue
        const date = new Date(d).getTime()
        if (lastDate && date < lastDate) return false
        lastDate = date
      }
    }
    return true
  })

  const isValidRoute = computed(() => {
    if (!route.value) return false
    const length = route.value.length >= 2
    const firstPoint = route.value[0].type === 'loading'
    const lastPoint = route.value[route.value.length - 1].type === 'unloading'
    const hasAddresses = route.value.filter((item) => !!item.address).length === route.value.length
    return length && firstPoint && lastPoint && hasAddresses && isValidDatesInRoute.value
  })

  function getMinArrivalDate(ind: number): string | null {
    if (!ind) return null
    if (ind > 0 && !!route.value[ind - 1].departureDate) return route.value[ind - 1].departureDate
    return null
  }

  function isDisabledArrivalDate(ind: number): boolean {
    if (currentPointInd.value === ind && !!route.value[ind].departureDate) return true
    if (currentPointInd.value !== ind) return true
    return false
  }

  function isDisabledDepartureDate(ind: number): boolean {
    if (currentPointInd.value === ind && !route.value[ind].arrivalDate) return true
    if (currentPointInd.value !== -1 && !route.value[ind].arrivalDate) return true
    if (ind + 1 <= route.value.length - 1 && !!route.value[ind + 1].arrivalDate) return true
    return false
  }

  function setRoute(val: RoutePoint[]) {
    route.value = Array.isArray(val) ? [...val] : val
  }

  function resetRoute() {
    route.value = []
  }

  return {
    route,
    currentPointInd,
    routeDate,
    routeCompleted,
    isExistFirstArrivalDate,
    isValidDatesInRoute,
    isValidRoute,
    getMinArrivalDate,
    isDisabledArrivalDate,
    isDisabledDepartureDate,
    setRoute,
    resetRoute,
  }
}
