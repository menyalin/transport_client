import { computed } from 'vue'

export const usePivotHeaders = (props) => {
  const showOutsourceCosts = computed(() => props.showOutsourceCosts)
  const groupName = computed(() => {
    return props.groupItems.find((i) => i.value === props.groupBy)?.text || '-'
  })

  const headers = computed(() => {
    const defaultFields = [
      { text: 'Кол-во', value: 'count', align: 'right' },
      { text: 'Сумма без НДС', value: 'sumWOVat', align: 'right' },
      { text: 'Сред.сумма без НДС', value: 'avgWOVat', align: 'right' },
      { text: 'Сумма c НДС', value: 'sumWithVat', align: 'right' },
      { text: 'Сред.сумма c НДС', value: 'avgWithVat', align: 'right' },
    ]
    const outsourceFields = [
      {
        text: 'Наемники без НДС',
        value: 'outsourceCostsWOVat',
        align: 'right',
      },
      {
        text: 'Прибыль, без НДС',
        value: 'totalProfitWOVat',
        align: 'right',
      },
      {
        text: 'Средний тариф без НДС',
        value: 'avgOutsourceCostsWOVat',
        align: 'right',
      },
      {
        text: 'Средняя прибыль, без НДС',
        value: 'avgProfitWOVat',
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

  return {
    headers,
  }
}

/*

{
	"0": {
	
		
		
		
		"avgProfitWOVat": 10333.333333333336,
		"avgProfitWOVatPercent": 17.71428571428572
	}
}
*/
