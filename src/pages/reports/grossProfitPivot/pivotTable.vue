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
          {{ pivotData.totalCount }}
        </th>
        <th class="text-right">
          {{ totalSumWOVat }}
        </th>
        <th class="text-right">
          {{ totalAvgWOVat }}
        </th>
        <th class="text-right">
          {{ totalSumWithVat }}
        </th>
        <th class="text-right">
          {{ totalAvgWithVat }}
        </th>
        <th v-if="showOutsourceCosts" class="text-right">
          {{ prepareSum(pivotData.outsourceCostsWOVat) }}
        </th>
        <th v-if="showOutsourceCosts" class="text-right">
          {{ prepareSum(pivotData.totalProfitWOVat) }}
        </th>
        <th v-if="showOutsourceCosts" class="text-right">
          {{ prepareSum(pivotData.avgOutsourceCostsWOVat) }}
        </th>
        <th v-if="showOutsourceCosts" class="text-right">
          {{ prepareSum(pivotData.avgProfitWOVat) }}
        </th>
        <th v-if="showOutsourceCosts" class="text-right">
          {{ Math.round(pivotData.avgProfitWOVatPercent * 100) / 100 }}
        </th>
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
          {{ totalAvgByDayWOVat }}
        </th>
        <th />
        <th class="text-right">
          {{ totalAvgByDayWithVat }}
        </th>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import { useHistorySettings } from '@/shared/hooks'
import { usePivotHeaders } from './usePivotHeaders'
export default {
  name: 'PivotTable',
  props: {
    groupItems: { type: Array, required: true },
    groupBy: { type: String, required: true },
    daysCount: Number,
    pivotData: { type: Object },
    agreements: Array,
    selectedGroups: Array,
    showOutsourceCosts: { type: Boolean, default: false },
  },
  setup(props) {
    const selected = useHistorySettings([], 'selected_items')
    const { headers } = usePivotHeaders(props)
    return { selected, headers }
  },

  computed: {
    totalAvgByDayWithVat() {
      const sum = this.pivotData.totalWithVat / 1000
      if (isNaN(sum)) return null
      if (!this.daysCount) return null
      return Intl.NumberFormat().format(Math.round(sum / this.daysCount))
    },

    totalAvgByDayWOVat() {
      const sum = this.pivotData.totalWOVat / 1000
      if (isNaN(sum)) return null
      if (!this.daysCount) return null
      return Intl.NumberFormat().format(Math.round(sum / this.daysCount))
    },

    totalSumWithVat() {
      const sum = this.pivotData.totalWithVat / 1000
      if (isNaN(sum)) return null
      return Intl.NumberFormat().format(Math.round(sum))
    },
    totalSumWOVat() {
      const sum = this.pivotData.totalWOVat / 1000
      if (isNaN(sum)) return null
      return Intl.NumberFormat().format(Math.round(sum))
    },

    totalAvgWithVat() {
      const avg = this.pivotData.totalWithVat / this.pivotData.totalCount / 1000
      if (isNaN(avg)) return null
      return Intl.NumberFormat().format(Math.round(avg))
    },
    totalAvgWOVat() {
      const avg = this.pivotData.totalWOVat / this.pivotData.totalCount / 1000
      if (isNaN(avg)) return null
      return Intl.NumberFormat().format(Math.round(avg))
    },

    items() {
      if (!this.pivotData?.items) return []
      return this.pivotData.items.map((i) => ({
        ...i,
        _id: i._id?.toString(),
        titleColumn: this.setTitleColumn(i._id),
        count: i.totalCount,
        sumWOVat: Intl.NumberFormat().format(Math.round(i.totalWOVat / 1000)),
        sumWithVat: Intl.NumberFormat().format(
          Math.round(i.totalWithVat / 1000)
        ),
        avgWOVat: Intl.NumberFormat().format(Math.round(i.avgWOVat / 1000)),
        avgWithVat: Intl.NumberFormat().format(Math.round(i.avgWithVat / 1000)),
        isSelectable: !!i._id,
        outsourceCostsWOVat: Intl.NumberFormat().format(
          Math.round(i.outsourceCostsWOVat / 1000)
        ),
        totalProfitWOVat: Intl.NumberFormat().format(
          Math.round(i.totalProfitWOVat / 1000)
        ),
        avgOutsourceCostsWOVat: Intl.NumberFormat().format(
          Math.round(i.avgOutsourceCostsWOVat / 1000)
        ),
        avgProfitWOVat: Intl.NumberFormat().format(
          Math.round(i.avgProfitWOVat / 1000)
        ),
        avgProfitWOVatPercent: Intl.NumberFormat().format(
          Math.round(i.avgProfitWOVatPercent * 100) / 100
        ),
      }))
    },

    titlesMap() {
      const res = new Map()
      switch (this.groupBy) {
        case 'client':
          this.$store.getters.partners.forEach((p) => {
            res.set(p._id, p.name)
          })
          break
        case 'orderType':
          this.$store.getters.orderAnalyticTypes.forEach((p) => {
            res.set(p.value, p.text)
          })
          break
        case 'truck':
          this.$store.getters.trucks.forEach((p) => {
            res.set(p._id, p.regNum)
          })
          break
        case 'driver':
          this.$store.getters.drivers.forEach((p) => {
            res.set(p._id, p.fullName)
          })
          break
        case 'tkName':
          this.$store.getters.tkNames.forEach((p) => {
            res.set(p._id, p.name)
          })
          break
        case 'loadingRegion':
          this.$store.getters.regions.forEach((p) => {
            res.set(p._id, p.name)
          })
          break
        case 'agreement':
          this.agreements.forEach((p) => {
            res.set(p.value, p.text)
          })
      }
      return res
    },
  },

  methods: {
    prepareSum(sum) {
      if (isNaN(sum)) return null
      return Intl.NumberFormat().format(Math.round(sum / 1000))
    },
    selectHandler(val) {
      this.$emit(
        'updateSelected',
        val.filter((i) => !!i._id).map((i) => i._id)
      )
    },
    setTitleColumn(id) {
      if (Array.isArray(id))
        return id.map((i) =>
          this.titlesMap.has(i) ? this.titlesMap.get(i) : '-'
        )
      return this.titlesMap.has(id) ? this.titlesMap.get(id) : '-'
    },
  },
}
</script>
<style></style>
