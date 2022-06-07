<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            {{ groupName }}
          </th>
          <th class="text-right">
            Кол-во
          </th>
          <th class="text-right">
            Сумма
          </th>
          <th class="text-right">
            Сред.сумма
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in pivotData.items"
          :key="idx"
        >
          <td>
            {{ titlesMap.has(item._id) ? titlesMap.get(item._id) : '--' }}
          </td>
          <td class="text-right">
            {{ item.totalCount }}
          </td>
          <td class="text-right">
            {{
              Intl.NumberFormat().format(Math.round(item.totalWithVat / 1000))
            }}
          </td>
          <td class="text-right">
            {{ Intl.NumberFormat().format(Math.round(item.avgWithVat / 1000)) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Итого:</th>
          <th class="text-right">
            {{ pivotData.totalCount }}
          </th>
          <th class="text-right">
            {{
              Intl.NumberFormat().format(
                Math.round(pivotData.totalWithVat / 1000)
              )
            }}
          </th>
          <th class="text-right">
            {{
              Intl.NumberFormat().format(
                Math.round(pivotData.totalWithVat / pivotData.totalCount / 1000)
              )
            }}
          </th>
        </tr>
      </tfoot>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'PivotTable',
  props: {
    groupItems: { type: Array, required: true },
    groupBy: { type: String, required: true },
    pivotData: { type: Object },
  },
  computed: {
    groupName() {
      const group = this.groupItems.find((i) => i.value === this.groupBy)
      return group?.text || '--'
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
      }
      return res
    },
  },
}
</script>
<style></style>
