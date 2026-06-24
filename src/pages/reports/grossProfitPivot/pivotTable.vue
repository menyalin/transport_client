<template>
  <div class="pivot-table-wrapper">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      selectable-key="isSelectable"
      checkbox-color="primary"
      item-key="_id"
      show-select
      hide-default-footer
      items-per-page="-1"
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
                  pivotData.total?.[priceWithVat ? 'outsourceCostsWithVat' : 'outsourceCostsWOVat']
                )
              }}
            </th>
            <th class="text-right">
              {{
                prepareSum(
                  pivotData.total?.[priceWithVat ? 'totalProfitWithVat' : 'totalProfitWOVat']
                )
              }}
            </th>
            <th class="text-right">
              {{
                prepareSum(
                  pivotData.total?.[
                    priceWithVat ? 'avgOutsourceCostsWithVat' : 'avgOutsourceCostsWOVat'
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
              Intl.NumberFormat().format(Math.round((pivotData.total?.totalCount || 0) / daysCount))
            }}
          </th>
          <th class="text-right">
            {{ totalAvgByDay }}
          </th>
          <th />
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import { usePersistedRef } from '@/shared/hooks'
import { usePivotTable } from './usePivotTable'

defineOptions({ name: 'PivotTable' })

const props = defineProps({
  groupItems: { type: Array, required: true },
  groupBy: { type: String, required: true },
  daysCount: Number,
  pivotData: { type: Object },
  agreements: Array,
  selectedGroups: Array,
  priceWithVat: { type: Boolean, default: false },
  showOutsourceCosts: { type: Boolean, default: false },
  withRound: { type: Boolean, default: true },
})

const emit = defineEmits(['updateSelected'])

const selected = usePersistedRef([], 'selected_items')

const { headers, totalAvgByDay, items, totalSum, totalAvg } = usePivotTable(props)

watch(selected, (val) => {
  emit(
    'updateSelected',
    val.filter((i) => !!i._id).map((i) => i._id)
  )
})

function prepareSum(sum) {
  if (sum == null || isNaN(sum)) return '-'
  const roundBy = props.withRound ? 1000 : 1
  return Intl.NumberFormat('ru-RU').format(Math.round(sum / roundBy))
}

function percentFormat(value) {
  if (value == null || isNaN(value)) return '-'
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
</script>
<style scoped>
.pivot-table-wrapper {
  display: inline-block;
}
.pivot-table-wrapper :deep(td) {
  text-align: right;
}
.pivot-table-wrapper :deep(td:first-child),
.pivot-table-wrapper :deep(td:nth-child(2)) {
  text-align: left;
}
</style>
