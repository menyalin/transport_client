<template>
  <div>
    <v-table>
      <template #default>
        <thead>
          <tr>
            <th>Тип</th>
            <th class="text-center"></th>
            <th class="text-center">Грузоподъемность</th>
            <th class="text-right">Тариф</th>
            <th class="text-left">Примечание</th>
            <th></th>
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

              <AppDirectDistanceZones v-if="item.type === 'directDistanceZones'" :item="item" />
              <AppAdditionalPointsCell v-if="item.type === 'additionalPoints'" :item="item" />
              <AppWaitingCell v-if="item.type === 'waiting'" :item="item" />
              <AppRegionsCell v-if="item.type === 'regions'" :item="item" />
              <AppZonesCell v-if="item.type === 'zones'" :item="item" />
              <AppReturnCell v-if="item.type === 'return'" :item="item" />
            </td>

            <td class="text-center">
              {{ Array.isArray(item.liftCapacity) ? item.liftCapacity.join(', ') : item.liftCapacity }}
            </td>
            <td class="text-right">
              {{ Intl.NumberFormat().format(item.sum) }}
            </td>

            <td>{{ item.note }}</td>
            <td class="text-right">
              <v-btn size="small" icon @click="removeHandler(ind)">
                <v-icon size="small" color="red">mdi-delete</v-icon>
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
import AppZonesCell from '@/modules/accounting/components/salaryTariffGroupList/zones'
import AppRegionsCell from '@/modules/accounting/components/salaryTariffGroupList/regions'
import AppDirectDistanceZones from './directDistanceZones.vue'

export default {
  name: 'SalaryTariffGroupList',
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
      return this.$store.getters.addressMap
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
