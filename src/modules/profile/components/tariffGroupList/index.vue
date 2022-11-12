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
            <th class="text-right">Цена с НДС</th>
            <th class="text-right">Цена без НДС</th>
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
              <div v-if="item.type === 'points'">
                {{ addressMap.get(item.loading).shortName }} >>>
                {{ addressMap.get(item.unloading).shortName }}
              </div>
              <app-direct-distance-zones
                v-if="item.type === 'directDistanceZones'"
                :item="item"
              />
              <app-additional-points-cell
                v-if="item.type === 'additionalPoints'"
                :item="item"
              />
              <app-waiting-cell v-if="item.type === 'waiting'" :item="item" />
              <app-zones-cell v-if="item.type === 'zones'" :item="item" />
              <app-return-cell v-if="item.type === 'return'" :item="item" />
            </td>

            <td class="text-center">
              {{ truckKindMap.get(item.truckKind) }}
            </td>
            <td class="text-center">
              {{ item.liftCapacity }}
            </td>
            <td class="text-right">
              {{ Intl.NumberFormat().format(item.price) }}
            </td>
            <td class="text-right">
              {{ Intl.NumberFormat().format(item.priceWOVat) }}
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
import AppWaitingCell from './waiting.vue'
import AppAdditionalPointsCell from './additionalPoints.vue'
import AppReturnCell from './return.vue'
import AppZonesCell from './zones.vue'
import AppDirectDistanceZones from './directDistanceZones.vue'

export default {
  name: 'TariffGroupList',
  components: {
    AppAdditionalPointsCell,
    AppWaitingCell,
    AppReturnCell,
    AppDirectDistanceZones,
    AppZonesCell,
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
