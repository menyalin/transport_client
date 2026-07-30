import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRegionStore } from '@/entities/region/regionStore'
import { useOrderStore } from '@/entities/order/orderStore'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

function formatNumber(value) {
  if (value == null || isNaN(value)) return '-'
  return Intl.NumberFormat('ru-RU').format(Math.round(value))
}

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const usePivotTable = (props) => {
  const store = useStore()
  const orderStore = useOrderStore()
  const carrierStore = useCarrierStore()

  const groupName = computed(() => {
    return props.groupItems.find((i) => i.value === props.groupBy)?.text || '-'
  })

  const headers = computed(() => {
    const defaultFields = [
      { title: 'Кол-во', value: 'count', align: 'right' },
      { title: 'Сумма', value: 'sum', align: 'right' },
      { title: 'Сред.сумма', value: 'avg', align: 'right' },
    ]
    const outsourceFields = [
      { title: 'Наемники', value: 'outsourceCosts', align: 'right' },
      { title: 'Прибыль', value: 'totalProfit', align: 'right' },
      { title: 'Средний тариф', value: 'avgOutsourceCosts', align: 'right' },
      { title: 'Средняя прибыль', value: 'avgProfit', align: 'right' },
      { title: 'Доходность %', value: 'avgProfitWOVatPercent', align: 'right' },
    ]
    const res = [{ title: groupName.value, value: 'titleColumn' }, ...defaultFields]
    if (props.showOutsourceCosts) {
      res.push(...outsourceFields)
    }
    return res
  })

  const roundBy = computed(() => (props.withRound ? 1000 : 1))

  const totalData = computed(() => props.pivotData?.total)

  const totalAvgByDay = computed(() => {
    const total = totalData.value
    if (!total) return null
    const sum = getItemField(total, 'total') / roundBy.value
    if (!props.daysCount) return null
    return formatNumber(sum / props.daysCount)
  })

  const titlesMap = computed(() => {
    const res = new Map()
    switch (props.groupBy) {
      case 'client':
        store.getters.partners.forEach((p) => {
          res.set(p._id, p.name)
        })
        break
      case 'orderType':
        orderStore.orderAnalyticTypes.forEach((p) => {
          res.set(p.value, p.text)
        })
        break
      case 'truck':
        store.getters.trucks.forEach((p) => {
          res.set(p._id, p.regNum)
        })
        break
      case 'driver':
        store.getters.drivers.forEach((p) => {
          res.set(p._id, p.fullName)
        })
        break
      case 'carrier':
        carrierStore.carriers.forEach((p) => {
          res.set(p._id, p.name)
        })
        break
      case 'loadingRegion':
        useRegionStore().regions.forEach((p) => {
          res.set(p._id, p.name)
        })
        break
      case 'agreement':
        props.agreements.forEach((p) => {
          res.set(p.value, p.title)
        })
    }
    return res
  })

  const totalSum = computed(() => {
    const total = totalData.value
    if (!total) return null
    return formatNumber(getItemField(total, 'total') / roundBy.value)
  })

  const totalAvg = computed(() => {
    const total = totalData.value
    if (!total) return null
    const totalCount = total.totalCount
    if (!totalCount) return null
    return formatNumber(getItemField(total, 'total') / totalCount / roundBy.value)
  })

  function setTitleColumn(id) {
    if (Array.isArray(id))
      return id.map((i) => (titlesMap.value.has(i) ? titlesMap.value.get(i) : '-'))
    return titlesMap.value.has(id) ? titlesMap.value.get(id) : '-'
  }

  const fieldSuffix = computed(() => (props.priceWithVat ? 'WithVat' : 'WOVat'))

  function getItemField(item, fieldName) {
    return item[`${fieldName}${fieldSuffix.value}`]
  }

  const items = computed(() => {
    if (!props.pivotData?.items) return []
    return props.pivotData.items.map((i) => ({
      ...i,
      _id: i._id?.toString(),
      titleColumn: setTitleColumn(i._id),
      count: i.totalCount,
      sum: formatNumber(getItemField(i, 'total') / roundBy.value),
      avg: formatNumber(getItemField(i, 'avg') / roundBy.value),
      isSelectable: !!i._id,
      outsourceCosts: formatNumber(getItemField(i, 'outsourceCosts') / roundBy.value),
      totalProfit: formatNumber(getItemField(i, 'totalProfit') / roundBy.value),
      avgOutsourceCosts: formatNumber(getItemField(i, 'avgOutsourceCosts') / roundBy.value),
      avgProfit: formatNumber(getItemField(i, 'avgProfit') / roundBy.value),
      avgProfitWOVatPercent: percentFormatter.format(i.avgProfitWOVatPercent),
    }))
  })

  return {
    headers,
    totalAvgByDay,
    totalAvg,
    items,
    totalSum,
  }
}
