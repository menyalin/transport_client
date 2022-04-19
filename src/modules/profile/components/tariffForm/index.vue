<template>
  <div>
    <v-dialog
      v-model="tmpDialog"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-card-title>
          {{ tmpItem._id ? 'Редактировать тариф' : 'Добавить тариф' }}
        </v-card-title>
        <v-card-text id="fields-wrapper">
          <v-select
            v-model="tmpItem.type"
            label="Тип"
            :items="$store.getters.tariffTypes"
            dense
            outlined
            hide-details
          />
          <v-text-field
            v-model="tmpItem.date"
            type="date"
            label="Дата"
            dense
            outlined
            hide-details
            readonly
          />
          <v-select
            ref="truckKindEl"
            v-model="tmpItem.truckKind"
            :items="$store.getters.truckKinds"
            label="Вид ТС"
            outlined
            dense
            hide-details
          />
          <v-select
            v-model="tmpItem.liftCapacity"
            :items="$store.getters.liftCapacityTypes"
            label="Грузоподъемность ТС"
            outlined
            dense
            hide-details
          />
          <app-points
            v-if="tmpItem.type === 'points'"
            ref="points"
            v-model="points"
            :style="{ 'min-width': '550px' }"
          />
          <app-additional-points
            v-if="tmpItem.type === 'additionalPoints'"
            ref="additionalPoints"
            v-model="additionalPoints"
            :style="{ 'min-width': '550px' }"
          />
          <app-direct-distance-zones
            v-if="tmpItem.type === 'directDistanceZones'"
            ref="directDistanceZones"
            v-model="directDistanceZones"
            :style="{ 'min-width': '550px' }"
          />
          <app-waiting
            v-if="tmpItem.type === 'waiting'"
            ref="waiting"
            v-model="waiting"
            :style="{ 'min-width': '550px' }"
          />
          <app-return
            v-if="tmpItem.type === 'return'"
            ref="return"
            v-model="returnTariff"
            :style="{ 'min-width': '550px' }"
          />
          <v-text-field
            v-model.number="tmpItem.price"
            :disabled="tmpItem.type === 'return'"
            dense
            type="number"
            :label="tmpItem.groupVat ? 'Тариф c НДС' : 'Тариф без НДС'"
            outlined
            hide-details
          />
          <v-text-field
            v-model.trim="tmpItem.note"
            label="Примечание"
            dense
            outlined
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false">
            Отмена
          </v-btn>
          <v-btn
            v-if="tmpItem._id"
            :disabled="invalidItem"
            color="primary"
            @click="update"
          >
            Обновить
          </v-btn>
          <v-btn
            v-else
            :disabled="invalidItem"
            color="primary"
            @click="pushItem"
          >
            Добавить в список
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="showDeleteBtn"
            color="error"
            @click="deleteItem"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppPoints from './points.vue'
import AppAdditionalPoints from './additionalPoints.vue'
import AppDirectDistanceZones from './directDistanceZones.vue'
import AppWaiting from './waiting.vue'
import AppReturn from './return.vue'
import TariffService from '../../services/tariff.service.js'
import { TariffDTO } from './tariff.dto'

export default {
  name: 'TariffForm',
  components: {
    AppPoints,
    AppAdditionalPoints,
    AppDirectDistanceZones,
    AppWaiting,
    AppReturn,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    dialog: Boolean,
  },
  data() {
    return {
      tmpDialog: false,
      points: {},
      additionalPoints: {},
      tmpItem: {},
      directDistanceZones: {},
      waiting: {},
      returnTariff: {},
    }
  },
  computed: {
    invalidItem() {
      return TariffDTO.invalidItem({
        ...this.tmpItem,
        ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
        ...(this.tmpItem.type && this.tmpItem.type === 'return'
          ? this.returnTariff
          : {}),
      })
    },
    showDeleteBtn() {
      return this.item._id && this.$store.getters.hasPermission('tariff:delete')
    },
    formState() {
      return {
        ...new TariffDTO({
          ...this.tmpItem,
          ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
          ...(this.tmpItem.type && this.tmpItem.type === 'return'
            ? this.returnTariff
            : {}),
        }),
      }
    },
  },
  watch: {
    dialog: function (val) {
      this.tmpDialog = val
    },
    tmpDialog: function (val) {
      if (!val) this.cancel()
    },
    item: {
      deep: true,
      immediate: true,
      handler: function (val) {
        if (val) {
          const item = TariffDTO.tariffFromDBItem(val)
          const itemKeys = Object.keys(item)
          itemKeys.forEach((key) => (this[key] = { ...item[key] }))
          if (val.type === 'return') this.returnTariff = item.return
        }
      },
    },
  },
  created() {
    document.addEventListener('keyup', this.keypressEventHandler)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keypressEventHandler)
  },
  methods: {
    keypressEventHandler(e) {
      if (e.altKey && e.key === 'Enter') this.pushItem()
    },

    cancel() {
      this.$emit('cancel')
    },
    pushItem() {
      if (!this.invalidItem) {
        this.$emit('push', this.formState)
        this.$nextTick(() => {
          // if (this.tmpItem.type === 'return') this.$refs.return.focus()
          this.$refs[this.tmpItem.type].focus()
        })
      }
    },
    update() {
      this.$emit('update', this.formState)
      this.tmpDialog = false
    },
    async deleteItem() {
      const res = await this.$confirm('Вы уверены? Запись будет удалена')
      if (!res) return null
      try {
        this.loading = true
        await TariffService.deleteById(this.item._id)
        this.loading = false
        this.$emit('deletedItem', this.item._id)
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style scoped>
#fields-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
