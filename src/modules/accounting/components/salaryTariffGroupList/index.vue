<template>
  <div>
    <v-table>
      <template #default>
        <thead>
          <tr>
            <th>Тип</th>
            <th class="text-center" />
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
              <div v-if="item.type === 'points'">
                {{ addressMap.get(item.loading).shortName }} >>>
                {{ addressMap.get(item.unloading).shortName }}
              </div>

              <app-direct-distance-zones v-if="item.type === 'directDistanceZones'" :item="item" />
              <app-additional-points-cell v-if="item.type === 'additionalPoints'" :item="item" />
              <app-waiting-cell v-if="item.type === 'waiting'" :item="item" />
              <app-regions-cell v-if="item.type === 'regions'" :item="item" />
              <app-zones-cell v-if="item.type === 'zones'" :item="item" />
              <app-return-cell v-if="item.type === 'return'" :item="item" />
            </td>

            <td class="text-center">
              {{
                Array.isArray(item.liftCapacity) ? item.liftCapacity.join(', ') : item.liftCapacity
              }}
            </td>
            <td class="text-right">
              {{ Intl.NumberFormat().format(item.sum) }}
            </td>

            <td>{{ item.note }}</td>
            <td class="text-right">
              <v-btn size="small" icon @click="removeHandler(ind)">
                <v-icon size="small" color="red"> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>
</template>
<script>
import AppWaitingCell from './waiting.vue'
import AppAdditionalPointsCell from './additionalPoints.vue'
import AppReturnCell from './return.vue'
import AppZonesCell from '@/modules/accounting/components/salaryTariffGroupList/zones.vue'
import AppRegionsCell from '@/modules/accounting/components/salaryTariffGroupList/regions.vue'
import AppDirectDistanceZones from './directDistanceZones.vue'
import { useAddressStore } from '@/entities/address'

export default {
  name: 'SalaryTariffGroupList',
  setup() {
    const addressStore = useAddressStore()
    return { addressStore }
  },
  components: {
    AppAdditionalPointsCell,
    AppWaitingCell,
    AppReturnCell,
    AppDirectDistanceZones,
    AppZonesCell,
    AppRegionsCell,
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
      return this.addressStore.addressMap
    },
    truckKindMap() {
      return this.$store.getters.truckKindsMap
    },
    tariffTypesMap() {
      return this.$store.getters.salaryTariffTypesMap
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
