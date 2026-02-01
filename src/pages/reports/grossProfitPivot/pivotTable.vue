<template>
  <v-data-table
    :value="selected"
    :headers="headers"
    :items="items"
    selectable-key="isSelectable"
    checkbox-color="primary"
    dense
    item-key="_id"
    show-select
    hide-default-footer
    :itemsPerPage="-1"
    @input="selectHandler"
  >
    <template #[`body.append`]="{}">
      <tr v-if="pivotData.items">
        <th />
        <th>Итого:</th>
        <th class="text-right">
          {{ pivotData.total?.totalCount }}
        </th>
        <th class="text-right">
          {{ totalSum }}
        </th>
        <th class="text-right">
          {{ totalAvg }}
        </th>

        <template v-if="showOutsourceCosts">
          <th class="text-right">
            {{
              prepareSum(
                pivotData.total?.[
                  priceWithVat ? 'outsourceCostsWithVat' : 'outsourceCostsWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{
              prepareSum(
                pivotData.total?.[
                  priceWithVat ? 'totalProfitWithVat' : 'totalProfitWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{
              prepareSum(
                pivotData.total?.[
                  priceWithVat
                    ? 'avgOutsourceCostsWithVat'
                    : 'avgOutsourceCostsWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{ prepareSum(pivotData.total?.avgProfitWOVat) }}
          </th>
          <th class="text-right">
            {{ percentFormat(pivotData.total?.avgProfitWOVatPercent) }}
          </th>
        </template>
      </tr>
      <tr v-if="pivotData.items && daysCount">
        <th />
        <th>Среднее по дням:</th>
        <th class="text-right">
          {{
            Intl.NumberFormat().format(
              Math.round((pivotData.total?.totalCount || 0) / daysCount)
            )
          }}
        </th>
        <th class="text-right">
          {{ totalAvgByDay }}
        </th>
        <th />
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import { usePersistedRef } from '@/shared/hooks'
import { usePivotTable } from './usePivotTable'

export default {
  name: 'PivotTable',
  props: {
    groupItems: { type: Array, required: true },
    groupBy: { type: String, required: true },
    daysCount: Number,
    pivotData: { type: Object },
    agreements: Array,
    selectedGroups: Array,
    priceWithVat: { type: Boolean, default: false },
    showOutsourceCosts: { type: Boolean, default: false },
    withRound: { type: Boolean, default: true },
  },
  setup(props) {
    const selected = usePersistedRef([], 'selected_items')
    const { headers, totalAvgByDay, items, totalSum, totalAvg } =
      usePivotTable(props)
    return {
      selected,
      headers,
      totalAvgByDay,
      items,
      totalSum,
      totalAvg,
    }
  },

  methods: {
    prepareSum(sum) {
      if (sum == null || isNaN(sum)) return '-'
      const roundBy = this.withRound ? 1000 : 1
      return Intl.NumberFormat('ru-RU').format(Math.round(sum / roundBy))
    },
    percentFormat(value) {
      if (value == null || isNaN(value)) return '-'
      return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    },
    selectHandler(val) {
      this.$emit(
        'updateSelected',
        val.filter((i) => !!i._id).map((i) => i._id)
      )
    },
  },
}
</script>
<style></style>
