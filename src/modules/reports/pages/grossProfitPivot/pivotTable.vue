<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    selectable-key="isSelectable"
    checkbox-color="primary"
    dense
    item-key="_id"
    show-select
    hide-default-footer
    :itemsPerPage="-1"
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
export default {
  name: 'PivotTable',
  props: {
    groupItems: { type: Array, required: true },
    groupBy: { type: String, required: true },
    daysCount: Number,
    priceWithVat: Boolean,
    pivotData: { type: Object },
    agreements: Array,
  },
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    totalAvgByDay() {
      const sum =
        this.pivotData[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
      if (isNaN(sum)) return null
      if (!this.daysCount) return null
      return Intl.NumberFormat().format(Math.round(sum / this.daysCount))
    },
    totalSum() {
      const sum =
        this.pivotData[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
      if (isNaN(sum)) return null
      return Intl.NumberFormat().format(Math.round(sum))
    },

    totalAvg() {
      const avg =
        this.pivotData[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'] /
        this.pivotData.totalCount /
        1000
      if (isNaN(avg)) return null
      return Intl.NumberFormat().format(Math.round(avg))
    },

    headers() {
      return [
        //{ value: '_id' },
        { text: this.groupName, value: 'titleColumn' },
        { text: 'Кол-во', value: 'count', align: 'right' },
        { text: 'Сумма', value: 'sum', align: 'right' },
        { text: 'Сред.сумма', value: 'avg', align: 'right' },
      ]
    },
    items() {
      if (!this.pivotData?.items) return []
      return this.pivotData.items.map((i) => ({
        _id: i._id?.toString(),
        titleColumn: this.setTitleColumn(i._id),

        count: i.totalCount,
        sum: Intl.NumberFormat().format(
          Math.round(
            i[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
          )
        ),
        avg: Intl.NumberFormat().format(
          Math.round(i[this.priceWithVat ? 'avgWithVat' : 'avgWOVat'] / 1000)
        ),
        isSelectable: !!i._id,
      }))
    },
    groupName() {
      const group = this.groupItems.find((i) => i.value === this.groupBy)
      return group?.text || '-'
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
  watch: {
    selected: {
      deep: true,
      handler: function (val) {
        this.$emit(
          'updateSelected',
          val.map((i) => i._id)
        )
      },
    },
  },
  methods: {
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
