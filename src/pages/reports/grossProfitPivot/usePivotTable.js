import { computed } from 'vue'
import store from '@/store'

export const usePivotTable = (props) => {
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

  const totalAvgByDay = computed(() => {
    const sum =
      props.pivotData[props.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
    if (isNaN(sum)) return null
    if (!props.daysCount) return null
    return Intl.NumberFormat().format(Math.round(sum / props.daysCount))
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
      case 'tkName':
        store.getters.tkNames.forEach((p) => {
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
    const sum =
      props.pivotData[props.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
    if (isNaN(sum)) return null
    return Intl.NumberFormat().format(Math.round(sum))
  })

  const totalAvg = computed(() => {
    const avg =
      props.pivotData[props.priceWithVat ? 'totalWithVat' : 'totalWOVat'] /
      props.pivotData.totalCount /
      1000
    if (isNaN(avg)) return null
    return Intl.NumberFormat().format(Math.round(avg))
  })
  const totalAvgOutsourceCost = computed(() => {
    return 212121
  })

  function setTitleColumn(id) {
    if (Array.isArray(id))
      return id.map((i) =>
        titlesMap.value.has(i) ? titlesMap.value.get(i) : '-'
      )
    return titlesMap.value.has(id) ? titlesMap.value.get(id) : '-'
  }

  const items = computed(() => {
    if (!props.pivotData?.items) return []
    const withVat = props.priceWithVat
    return props.pivotData.items.map((i) => ({
      ...i,
      _id: i._id?.toString(),
      titleColumn: setTitleColumn(i._id),
      count: i.totalCount,
      sum: Intl.NumberFormat().format(
        Math.round(i[withVat ? 'totalWithVat' : 'totalWOVat'] / 1000)
      ),

      avg: Intl.NumberFormat().format(
        Math.round(i[withVat ? 'avgWithVat' : 'avgWOVat'] / 1000)
      ),

      isSelectable: !!i._id,
      outsourceCosts: Intl.NumberFormat().format(
        Math.round(
          i[withVat ? 'outsourceCostsWithVat' : 'outsourceCostsWOVat'] / 1000
        )
      ),
      totalProfit: Intl.NumberFormat().format(
        Math.round(
          i[withVat ? 'totalProfitWithVat' : 'totalProfitWOVat'] / 1000
        )
      ),
      avgOutsourceCosts: Intl.NumberFormat().format(
        Math.round(
          i[withVat ? 'avgOutsourceCostsWithVat' : 'avgOutsourceCostsWOVat'] /
            1000
        )
      ),
      avgProfit: Intl.NumberFormat().format(
        Math.round(i[withVat ? 'avgProfitWithVat' : 'avgProfitWOVat'] / 1000)
      ),
      avgProfitWOVatPercent: Intl.NumberFormat().format(
        Math.round(i.avgProfitWOVatPercent * 100) / 100
      ),
    }))
  })

  return {
    headers,
    totalAvgByDay,
    totalAvg,
    items,
    totalSum,
    totalAvgOutsourceCost,
  }
}
