<template>
  <div>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th>Тип</th>
            <th class="text-center" />
            <th class="text-center">Вид ТС</th>
            <th class="text-center">Грузоподъемность</th>
            <th class="text-right">Тариф</th>

            <th class="text-left">Примечание</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, ind) of items" :key="ind">
            <td>
              {{ tariffTypesMap.get(item.type) }}
            </td>
            <td>
              <tariff-description-cell :item="item" />
            </td>

            <td class="text-center">
              {{ truckKindMap.get(item.truckKind) }}
            </td>
            <td class="text-center">
              {{ item.liftCapacity }}
            </td>
            <td class="text-right">
              {{
                item.type === 'return' || item.type === 'directDistanceZones'
                  ? null
                  : Intl.NumberFormat().format(item.price.price)
              }}
            </td>

            <td>{{ item.note }}</td>
            <td class="text-right">
              <v-btn small icon @click="removeHandler(ind)">
                <v-icon small color="red"> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
<script>
import TariffDescriptionCell from '../tariffDescriptionCell'

export default {
  name: 'TariffGroupList',
  components: {
    TariffDescriptionCell,
  },
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
