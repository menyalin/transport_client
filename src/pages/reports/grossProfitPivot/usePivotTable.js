import { computed } from 'vue'
import store from '@/store'
import { useCarrierStore } from '@/entities/carrier'

function formatNumber(value) {
  if (value == null || isNaN(value)) return '-'
  return Intl.NumberFormat('ru-RU').format(Math.round(value))
}

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const usePivotTable = (props) => {
  const carrierStore = useCarrierStore()
  const showOutsourceCosts = computed(() => props.showOutsourceCosts)

  const groupName = computed(() => {
    return props.groupItems.find((i) => i.value === props.groupBy)?.text || '-'
  })

  const headers = computed(() => {
    const defaultFields = [
      { text: 'Кол-во', value: 'count', align: 'right' },
      { text: 'Сумма', value: 'sum', align: 'right' },
      { text: 'Сред.сумма', value: 'avg', align: 'right' },
    ]
    const outsourceFields = [
      {
        text: 'Наемники',
        value: 'outsourceCosts',
        align: 'right',
      },
      {
        text: 'Прибыль',
        value: 'totalProfit',
        align: 'right',
      },
      {
        text: 'Средний тариф',
        value: 'avgOutsourceCosts',
        align: 'right',
      },
      {
        text: 'Средняя прибыль',
        value: 'avgProfit',
        align: 'right',
      },
      {
        text: 'Доходность %',
        value: 'avgProfitWOVatPercent',
        align: 'right',
      },
    ]
    const res = [
      { text: groupName.value, value: 'titleColumn' },
      ...defaultFields,
    ]
    if (showOutsourceCosts.value) {
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
        store.getters.orderAnalyticTypes.forEach((p) => {
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
        store.getters.regions.forEach((p) => {
          res.set(p._id, p.name)
        })
        break
      case 'agreement':
        props.agreements.forEach((p) => {
          res.set(p.value, p.text)
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
      return id.map((i) =>
        titlesMap.value.has(i) ? titlesMap.value.get(i) : '-'
      )
    return titlesMap.value.has(id) ? titlesMap.value.get(id) : '-'
  }

  const fieldSuffix = computed(() => props.priceWithVat ? 'WithVat' : 'WOVat')

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
