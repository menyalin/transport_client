<template>
  <v-table>
    <template #default>
      <thead>
        <tr>
          <th class="text-center" width="180">Тип</th>
          <th v-if="usePriceWithVat" class="text-center" width="130">Цена c НДС</th>
          <th v-else class="text-center" width="130">Цена без НДС</th>
          <th class="text-center">Примечание</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="showPrePrice">
          <td>Тариф из ДС</td>
          <td v-if="usePriceWithVat" class="text-right">
            {{ basePrePrice ? moneyFormatter.format(basePrePrice.price) : 0 }}
          </td>

          <td v-else class="text-right">
            {{ basePrePrice ? moneyFormatter.format(basePrePrice.priceWOVat) : 0 }}
          </td>

          <td colspan="4"></td>
        </tr>

        <tr v-for="(item, idx) in sortedItems" :key="idx">
          <td class="text-start">
            {{
              $store.getters.orderPriceTypesMap.has(item.type) ? $store.getters.orderPriceTypesMap.get(item.type) : '-'
            }}
          </td>
          <td v-if="usePriceWithVat" class="text-right">
            {{ moneyFormatter.format(item.price) }}
          </td>
          <td v-else class="text-right">
            {{ moneyFormatter.format(item.priceWOVat) }}
          </td>

          <td>
            <v-icon v-if="item.cashPayment" class="px-2" color="tealen-2">mdi-cash</v-icon>

            {{ item.note }}
          </td>
          <td v-if="!readonly" class="text-right">
            <v-btn icon @click="$emit('editPrice', item.type)">
              <v-icon color="green" size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="$emit('deletePrice', item.type)">
              <v-icon color="red" size="small">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>
<script>
export default {
  name: 'CostsTable',
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
    readonly: Boolean,
    basePrePrice: Object,
    hidePrePrice: Boolean,
    usePriceWithVat: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    moneyFormatter() {
      return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    },
    sortedItems() {
      const typesOrder = this.$store.getters.orderPriceTypes.map(i => i.value)
      return this.items
        .slice()
        .sort((a, b) => typesOrder.findIndex(t => t === a.type) - typesOrder.findIndex(t => t === b.type))
    },
    showPrePrice() {
      return !this.hidePrePrice
    },
  },
}
</script>
<style></style>
