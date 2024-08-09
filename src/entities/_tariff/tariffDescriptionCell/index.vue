<template>
  <waiting-cell v-if="item.type === 'waiting'" :item="item" />
  <additional-points-cell
    v-else-if="item.type === 'additionalPoints'"
    :item="item"
  />
  <zones-cell v-else-if="item.type === 'zones'" :item="item" />
  <return-cell v-else-if="item.type === 'return'" :item="item" />
  <direct-distance-zones-cell
    v-else-if="item.type === 'directDistanceZones'"
    :item="item"
  />
  <div v-else>
    {{ item._result || 'Описание не определено' }}
  </div>
</template>
<script>
import WaitingCell from './waiting.vue'
import AdditionalPointsCell from './additionalPoints.vue'
import ZonesCell from './zones.vue'
import ReturnCell from './return.vue'
import DirectDistanceZonesCell from './directDistanceZones.vue'

export default {
  name: 'TariffDescriptionCell',
  components: {
    WaitingCell,
    AdditionalPointsCell,
    ZonesCell,
    ReturnCell,
    DirectDistanceZonesCell,
  },
  props: {
    item: Object,
  },
}
</script>
