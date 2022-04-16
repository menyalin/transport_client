<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">
              Тип
            </th>
            <th class="text-center" />
            <th class="text-center">
              Вид ТС
            </th>
            <th class="text-center">
              Грузоподъемность
            </th>
            <th class="text-center">
              Цена с НДС
            </th>
            <th class="text-center">
              Цена без НДС
            </th>
            <th class="text-left">
              Примечание
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, ind) of items"
            :key="ind"
          >
            <td class="text-center">
              {{ tariffTypesMap.get(item.type) }}
            </td>
            <td class="text-center">
              <div v-if="item.type === 'points'">
                {{ addressMap.get(item.loading).shortName }} ->
                {{ addressMap.get(item.unloading).shortName }}
              </div>
              <div v-if="item.type === 'additionalPoints'">
                {{
                  `Рейс: ${orderAnalyticTypesMap.get(
                    item.orderType
                  )}, Кол-во точек в тарифе: ${item.includedPoints}`
                }}
              </div>
            </td>

            <td class="text-center">
              {{ truckKindMap.get(item.truckKind) }}
            </td>
            <td class="text-center">
              {{ item.liftCapacity }}
            </td>
            <td class="text-center">
              {{ Intl.NumberFormat().format(item.price) }}
            </td>
            <td class="text-center">
              {{ Intl.NumberFormat().format(item.priceWOVat) }}
            </td>
            <td>{{ item.note }}</td>
            <td class="text-right">
              <v-btn
                small
                icon
                @click="removeHandler(ind)"
              >
                <v-icon
                  small
                  color="red"
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
<script>
export default {
  name: 'TariffGroupList',

  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
  },
  computed: {
    addressMap() {
      return this.$store.getters.addressMap
    },
    truckKindMap() {
      return this.$store.getters.truckKindsMap
    },
    tariffTypesMap() {
      return this.$store.getters.tariffTypesMap
    },
    orderAnalyticTypesMap() {
      return this.$store.getters.orderAnalyticTypesMap
    },
  },
  methods: {
    removeHandler(ind) {
      this.$emit('removeItem', ind)
    },
  },
}
</script>
<style scoped></style>
