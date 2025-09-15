<template>
  <v-data-table
    :value="selected"
    :headers="headers"
    :items="items"
    selectable-key="isSelectable"
    checkbox-color="primary"
    density="compact"
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
          {{ pivotData.totalCount }}
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
                pivotData[
                  priceWithVat ? 'outsourceCostsWithVat' : 'outsourceCostsWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{
              prepareSum(
                pivotData[
                  priceWithVat ? 'totalProfitWithVat' : 'totalProfitWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{
              prepareSum(
                pivotData[
                  priceWithVat
                    ? 'avgOutsourceCostsWithVat'
                    : 'avgOutsourceCostsWOVat'
                ]
              )
            }}
          </th>
          <th class="text-right">
            {{ prepareSum(pivotData.avgProfitWOVat) }}
          </th>
          <th class="text-right">
            {{ Math.round(pivotData.avgProfitWOVatPercent * 100) / 100 }}
          </th>
        </template>
      </tr>
      <tr v-if="pivotData.items && daysCount">
        <th />
        <th>Среднее по дням:</th>
        <th class="text-right">
          {{
            Intl.NumberFormat().format(
              Math.round(pivotData.totalCount / daysCount)
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
    const {
      headers,
      totalAvgByDay,
      items,
      totalSum,
      totalAvg,
      totalAvgOutsourceCost,
    } = usePivotTable(props)
    return {
      selected,
      headers,
      totalAvgByDay,
      items,
      totalSum,
      totalAvg,
      totalAvgOutsourceCost,
    }
  },

  methods: {
    prepareSum(sum) {
      if (isNaN(sum)) return null
      const roundBy = this.withRound ? 1000 : 1
      return Intl.NumberFormat().format(Math.round(sum / roundBy))
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
