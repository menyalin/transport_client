<template>
  <v-simple-table dense>
    <template #default>
      <thead>
        <tr>
          <th class="text-center">Тип</th>
          <th class="text-center">Цена без НДС</th>
          <th v-if="false" class="text-center">Сумма НДС</th>
          <th class="text-center">Цена итоговая</th>
          <th class="text-center">Примечание</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="showPrePrice && basePrePrice">
          <td>Тариф из ДС</td>

          <td class="text-right">
            {{ new Intl.NumberFormat().format(basePrePrice.priceWOVat) }}
          </td>
          <td class="text-right" v-if="false">
            {{ new Intl.NumberFormat().format(basePrePrice.sumVat) }}
          </td>
          <td class="text-right">
            {{ new Intl.NumberFormat().format(basePrePrice.price) }}
          </td>
          <td colspan="4" />
        </tr>
        <tr v-else-if="showPrePrice">
          <td colspan="99" align="center">
            <b>Базовый тариф не определен</b>
          </td>
        </tr>

        <tr v-for="(item, idx) in sortedItems" :key="idx">
          <td class="text-start">
            {{
              $store.getters.orderPriceTypesMap.has(item.type)
                ? $store.getters.orderPriceTypesMap.get(item.type)
                : '-'
            }}
          </td>
          <td class="text-right">
            {{ new Intl.NumberFormat().format(item.priceWOVat) }}
          </td>
          <td class="text-right" v-if="false">
            {{ new Intl.NumberFormat().format(item.sumVat) }}
          </td>
          <td class="text-right">
            {{ new Intl.NumberFormat().format(item.price) }}
          </td>
          <td>
            <v-icon v-if="item.cashPayment" class="px-2" color="teal darken-2">
              mdi-cash
            </v-icon>

            {{ item.note }}
          </td>
          <td v-if="!readonly" class="text-right">
            <v-btn icon @click="$emit('editPrice', item.type)">
              <v-icon color="green" small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn icon @click="$emit('deletePrice', item.type)">
              <v-icon color="red" small> mdi-delete </v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
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
  },
  computed: {
    sortedItems() {
      const typesOrder = this.$store.getters.orderPriceTypes.map((i) => i.value)
      return this.items
        .slice()
        .sort(
          (a, b) =>
            typesOrder.findIndex((t) => t === a.type) -
            typesOrder.findIndex((t) => t === b.type)
        )
    },
    showPrePrice() {
      return !this.hidePrePrice
    },
  },
}
</script>
<style></style>
